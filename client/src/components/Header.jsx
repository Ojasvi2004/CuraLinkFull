import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const T = {
  ink:      "#0C0A09",
  body:     "#57534E",
  muted:    "#A8A29E",
  line:     "#ECEAE6",
  surface:  "#F5F4F2",
  surface2: "#FAFAF9",
  white:    "#FFFFFF",
};

const EASE = [0.22, 1, 0.36, 1];

// Iridescent orb gradients (used only as a fallback if WebGL is unavailable)
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── SHARED ICON PRIMITIVE ───────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  search:   ["M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z", "m21 21-4.35-4.35"],
  ai:       ["M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  calendar: ["M8 2v3M16 2v3M3 8h18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  chat:     ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
};

const STATS = [
  { to: 2400, decimals: 0, suffix: "+",  label: "Verified Doctors" },
  { to: 180,  decimals: 0, suffix: "K+", label: "Patients Served" },
  { to: 4.9,  decimals: 1, suffix: " ★", label: "Average Rating" },
  { to: 120,  decimals: 0, suffix: "+",  label: "Cities Covered" },
];

const TRUST = [
  { icon: ICONS.check,    label: "Verified Doctors" },
  { icon: ICONS.calendar, label: "Easy Appointments" },
  { icon: ICONS.chat,     label: "Digital Consultations" },
  { icon: ICONS.shield,   label: "HIPAA Compliant" },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const wordParent = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const wordChild = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};

// ─── HELPERS / UTILITIES ─────────────────────────────────────────────────────
const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

const WordReveal = ({ text, as = "h1", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em", marginRight: "0.24em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

const Magnetic = ({ children, strength = 0.26 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

const Stat = ({ to, decimals, suffix, label, delay = 0 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // once: true so the numbers stay counted after scrolling away
  const inView = useInView(ref, { amount: 0.6, once: true });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (reduce) { setV(to); return; }
    if (!inView) { setV(0); return; }
    const c = animate(0, to, { duration: 1.8, delay, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, to, delay, reduce]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, backgroundColor: "#FFFFFF" }}
      transition={{ duration: 0.25 }}
      style={{
        background: "rgba(245,244,242,0.85)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${T.line}`,
        borderRadius: 18,
        padding: "12px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 124,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </span>
      <span style={{ fontSize: 12, fontWeight: 400, color: T.muted, marginTop: 2 }}>{label}</span>
    </motion.div>
  );
};

// Fallback orb (only rendered when WebGL is unavailable)
const Orb = ({ size, bg, opacity = 1, blur = 0, pos, scrollY, mx, my, depth = 1, dur = 9, delay = 0 }) => {
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const x = useTransform(smx, [-0.5, 0.5], [-40 * depth, 40 * depth]);
  const my2 = useTransform(smy, [-0.5, 0.5], [-30 * depth, 30 * depth]);
  return (
    <motion.div style={{ position: "absolute", ...pos, y: scrollY, pointerEvents: "none" }}>
      <motion.div style={{ x, y: my2 }}>
        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
          style={{ width: size, height: size, borderRadius: "50%", background: bg, opacity, filter: `blur(${blur}px)` }}
        />
      </motion.div>
    </motion.div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// WATER SCENE  —  real-time WebGL (no dependencies)
// A reflective pastel water plane seen in perspective. 3D glass droplets fall
// from above and burst into expanding ripple rings; iridescent glass spheres
// float and mirror in the rippling surface. Move the cursor to stir the water,
// click to drop a droplet where you point.
// ═════════════════════════════════════════════════════════════════════════════
const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uT;
uniform vec4  uRip[12];   // x, z, startTime, amplitude
uniform vec4  uDrop[4];   // x, y, z, (y < 0 => inactive)

const float CP = 0.9131;   // cos(pitch)
const float SP = -0.4078;  // sin(pitch)
const float DROP_R = 0.13;

vec3 pal(float t){
  return vec3(0.62) + 0.38 * cos(6.28318 * (vec3(t) + vec3(0.0, 0.33, 0.67)));
}

// Soft studio environment in lilac / sky / peach
vec3 env(vec3 d){
  d = normalize(d);
  float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 c = mix(vec3(0.86, 0.83, 0.98), vec3(0.96, 0.93, 1.0), smoothstep(0.36, 0.55, h));
  c = mix(c, vec3(0.80, 0.88, 1.0), smoothstep(0.55, 0.92, h));
  float q = (d.x - 0.4) * 2.0;
  c += vec3(1.0, 0.78, 0.62) * 0.38 * exp(-q * q) * exp(-abs(d.y) * 7.0);
  c += vec3(1.0) * smoothstep(0.90, 0.985, dot(d, normalize(vec3(-0.5, 0.55, -0.6)))) * 1.1;
  c += vec3(1.0, 0.92, 1.0) * smoothstep(0.93, 0.99, dot(d, normalize(vec3(0.6, 0.35, -0.7)))) * 0.8;
  return c;
}

// Floating glass spheres: xyz centre, w radius
vec4 orb(float i){
  if (i < 0.5) return vec4(-2.3, 0.80 + 0.12 * sin(uT * 0.7),       -4.3, 0.62);
  if (i < 1.5) return vec4( 2.6, 1.05 + 0.15 * sin(uT * 0.6 + 2.0), -5.2, 0.82);
  return            vec4( 0.5, 0.52 + 0.10 * sin(uT * 0.9 + 4.0), -2.7, 0.30);
}

float hgt(vec2 p){
  float h = 0.0;
  for (int i = 0; i < 12; i++){
    vec4 r = uRip[i];
    float age = uT - r.z;
    if (age > 0.0 && r.w > 0.0){
      float x  = length(p - r.xy) - age * 1.15;
      float en = exp(-x * x * 2.4 - age * 0.45);
      h += r.w * sin(x * 10.5) * en / (1.0 + age * 0.9);
    }
  }
  h *= 0.032;
  h += 0.016 * sin(p.x * 1.9 + uT * 0.7 + sin(p.y * 1.4 + uT * 0.5));
  h += 0.012 * sin(p.y * 2.6 - uT * 0.6 + p.x * 0.8);
  return h;
}

float sph(vec3 ro, vec3 rd, vec3 c, float r){
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float cc = dot(oc, oc) - r * r;
  float h = b * b - cc;
  if (h < 0.0) return -1.0;
  return -b - sqrt(h);
}

vec3 sphereCol(vec3 pos, vec3 c, float r, vec3 rd, float seed){
  vec3 n = (pos - c) / r;
  float f = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  vec3 rf = env(reflect(rd, n));
  vec3 inner = mix(vec3(1.0), pal(dot(n, vec3(0.4, 0.8, 0.3)) * 0.6 + seed + uT * 0.03), 0.7);
  vec3 col = mix(inner, rf, 0.25 + 0.65 * f);
  col += pow(max(dot(n, normalize(vec3(-0.35, 0.7, -0.6))), 0.0), 40.0) * 0.9;
  return col;
}

void main(){
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.y;
  vec3 rc = normalize(vec3(uv * 0.9, -1.4));
  vec3 rd = vec3(rc.x, rc.y * CP - rc.z * SP, rc.y * SP + rc.z * CP);
  vec3 ro = vec3(0.0, 1.5, 0.0);

  float tp = rd.y < -0.002 ? -ro.y / rd.y : 1e5;

  // nearest sphere along the view ray
  float ts = 1e5; vec3 sc = vec3(0.0); float sr = 0.0; float seed = 0.0;
  for (int i = 0; i < 3; i++){
    vec4 o = orb(float(i));
    float t = sph(ro, rd, o.xyz, o.w);
    if (t > 0.0 && t < ts){ ts = t; sc = o.xyz; sr = o.w; seed = float(i) * 0.31; }
  }
  for (int i = 0; i < 4; i++){
    vec4 d = uDrop[i];
    if (d.y > 0.0){
      float t = sph(ro, rd, d.xyz, DROP_R);
      if (t > 0.0 && t < ts){ ts = t; sc = d.xyz; sr = DROP_R; seed = 0.7; }
    }
  }

  vec3 col;
  if (ts < tp){
    col = sphereCol(ro + rd * ts, sc, sr, rd, seed);
  } else if (tp < 1e4){
    vec3 p3 = ro + rd * tp;
    vec2 p = p3.xz;
    float k = exp(-tp * 0.11);          // calm the surface with distance (no shimmer)
    float eps = 0.025;
    // forward differences: 3 height samples instead of 4 (cheaper on weak GPUs)
    float h0 = hgt(p);
    float hx = (hgt(p + vec2(eps, 0.0)) - h0) / eps;
    float hz = (hgt(p + vec2(0.0, eps)) - h0) / eps;
    vec3 n = normalize(vec3(-hx * k, 1.0, -hz * k));
    vec3 v = -rd;

    float fr = 0.10 + 0.90 * pow(1.0 - max(dot(n, v), 0.0), 4.0);
    vec3 rr = reflect(rd, n);
    vec3 refl = env(rr);

    // mirror the spheres and droplets in the rippling surface
    for (int i = 0; i < 3; i++){
      vec4 o = orb(float(i));
      float t = sph(p3, rr, o.xyz, o.w);
      if (t > 0.0) refl = mix(refl, sphereCol(p3 + rr * t, o.xyz, o.w, rr, float(i) * 0.31), 0.92);
    }
    for (int i = 0; i < 4; i++){
      vec4 d = uDrop[i];
      if (d.y > 0.0){
        float t = sph(p3, rr, d.xyz, DROP_R);
        if (t > 0.0) refl = mix(refl, sphereCol(p3 + rr * t, d.xyz, DROP_R, rr, 0.7), 0.92);
      }
    }

    // water body: milky lilac, iridescent on the slopes
    float s = length(vec2(hx, hz)) * k;
    vec3 base = mix(vec3(0.83, 0.80, 1.0), vec3(0.72, 0.84, 1.0), 0.5 + 0.5 * sin(p.x * 0.35 + p.y * 0.22 + uT * 0.05));
    vec3 irid = mix(vec3(1.0), pal(dot(n.xz, vec2(1.0, 0.6)) * 2.2 + 0.2), 0.6);
    vec3 body = mix(base, irid, clamp(s * 3.0, 0.0, 0.55));
    for (int i = 0; i < 3; i++){
      vec4 o = orb(float(i));
      vec2 dd = p - o.xz;
      body *= 1.0 - 0.14 * exp(-dot(dd, dd) / (o.w * o.w * 3.0));
    }

    col = mix(body, refl, fr);
    vec3 L = normalize(vec3(-0.35, 0.7, -0.6));
    vec3 H = normalize(L + v);
    col += pow(max(dot(n, H), 0.0), 160.0) * 1.4;

    col = mix(col, env(rd), smoothstep(7.0, 34.0, tp));   // haze to the horizon
  } else {
    col = env(rd);
  }

  gl_FragColor = vec4(pow(clamp(col, 0.0, 1.0), vec3(0.96)), 1.0);
}
`;

// camera constants (must match the shader)
const COS_P = 0.9131;
const SIN_P = -0.4078;

const WaterScene = ({ onUnsupported }) => {
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Create a FRESH canvas every time the effect runs. A canvas whose context
    // was killed with loseContext() can never hand out a working context again,
    // which broke StrictMode remounts and `reduce` changes.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    wrap.appendChild(canvas);

    const bail = () => {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      onUnsupported && onUnsupported();
    };

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true, // software rendering → use fallback orbs
    });
    if (!gl) { bail(); return; }

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { bail(); return; }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); bail(); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");
    const uRip = gl.getUniformLocation(prog, "uRip");
    const uDrop = gl.getUniformLocation(prog, "uDrop");

    // ── simulation state ──
    const rip = new Float32Array(48);          // 12 ripples × (x, z, t0, amp)
    let ripIdx = 0;
    const dropU = new Float32Array(16);        // 4 droplets × (x, y, z, pad)
    let drops = [];
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;

    const addRipple = (x, z, t, a) => {
      const i = ripIdx * 4;
      rip[i] = x; rip[i + 1] = z; rip[i + 2] = t; rip[i + 3] = a;
      ripIdx = (ripIdx + 1) % 12;
    };
    const spawnDrop = (t, x, z) => {
      if (drops.length >= 4) return;
      drops.push({ x, z, t0: t, tf: 0.95 + Math.random() * 0.25, y0: 1.9 + 0.16 * Math.abs(z) });
    };
    const aspect = () => { const r = canvas.getBoundingClientRect(); return r.width / Math.max(1, r.height); };

    // screen → water-plane intersection (mirrors the shader camera)
    const toPlane = (cx, cy) => {
      const r = canvas.getBoundingClientRect();
      const sx = (2 * (cx - r.left) - r.width) / r.height;
      const sy = -(2 * (cy - r.top) - r.height) / r.height;
      const xc = sx * 0.9, yc = sy * 0.9, zc = -1.4;
      const ry = yc * COS_P - zc * SIN_P;
      const rz = yc * SIN_P + zc * COS_P;
      if (ry >= -0.02) return null;
      const t = -1.5 / ry;
      return [xc * t, rz * t];
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      let s = Math.min(window.devicePixelRatio || 1, 1.5);
      const px = r.width * r.height * s * s;
      if (px > 1.2e6) s *= Math.sqrt(1.2e6 / px);
      canvas.width = Math.max(2, Math.floor(r.width * s));
      canvas.height = Math.max(2, Math.floor(r.height * s));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (t) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform4fv(uRip, rip);
      gl.uniform4fv(uDrop, dropU);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let nextDrop = 0.5;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = now();

      if (t >= nextDrop) {
        const z = -(2.6 + Math.random() * 4.2);
        const x = (Math.random() * 2 - 1) * 0.5 * aspect() * Math.abs(z);
        spawnDrop(t, x, z);
        nextDrop = t + 1.1 + Math.random() * 1.3;
      }

      drops = drops.filter((d) => {
        const tau = (t - d.t0) / d.tf;
        if (tau >= 1) {
          addRipple(d.x, d.z, t, 1.0);
          addRipple(d.x, d.z, t + 0.14, 0.5);
          return false;
        }
        d.y = d.y0 * (1 - tau * tau);   // accelerating fall
        return true;
      });
      for (let i = 0; i < 4; i++) {
        const d = drops[i];
        dropU[i * 4] = d ? d.x : 0;
        dropU[i * 4 + 1] = d ? Math.max(0.01, d.y) : -1;
        dropU[i * 4 + 2] = d ? d.z : 0;
        dropU[i * 4 + 3] = 0;
      }
      draw(t);
    };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(frame); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    // GPU reset / driver crash: switch to the fallback instead of going blank
    const onContextLost = (e) => {
      e.preventDefault();
      stop();
      onUnsupported && onUnsupported();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    resize();
    dropU.fill(0);
    for (let i = 0; i < 4; i++) dropU[i * 4 + 1] = -1;

    // Reduced motion: one calm still frame with a few settled rings
    if (reduce) {
      addRipple(-1.3, -4.0, -1.6, 1);
      addRipple(1.7, -3.2, -2.6, 1);
      addRipple(0.2, -6.0, -2.0, 1);
      draw(0);
    }

    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0); });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    // ── interaction on the hero (parent of the wrapper) ──
    const host = wrap.parentElement;
    let lastMove = 0;
    let last = [1e9, 1e9];
    const onMove = (e) => {
      if (reduce) return;
      const tm = performance.now();
      if (tm - lastMove < 70) return;
      const p = toPlane(e.clientX, e.clientY);
      if (!p) return;
      const dx = p[0] - last[0], dz = p[1] - last[1];
      if (dx * dx + dz * dz < 0.12) return;
      lastMove = tm; last = p;
      addRipple(p[0], p[1], now(), 0.3);
    };
    const onDown = (e) => {
      if (reduce || (e.target.closest && e.target.closest("a,button,input"))) return;
      const p = toPlane(e.clientX, e.clientY);
      if (p) spawnDrop(now(), p[0], p[1]);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [reduce, onUnsupported]);

  return <div ref={wrapRef} aria-hidden style={{ position: "absolute", inset: 0 }} />;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Header = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const [glOk, setGlOk] = useState(true);
  const onUnsupported = useCallback(() => setGlOk(false), []);

  const contentY = useParallax(scrollYProgress, 0, 120);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.95]);

  // used by the fallback orbs only
  const orbA = useParallax(scrollYProgress, 0, -240);
  const orbB = useParallax(scrollYProgress, 0, 180);
  const orbC = useParallax(scrollYProgress, 0, -110);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .hero-root { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:${T.white}; color:${T.body}; -webkit-font-smoothing:antialiased; }
        .hero-root ::selection { background:${T.ink}; color:${T.white}; }

        .btn-ink {
          display:inline-flex; align-items:center; gap:8px;
          background:${T.ink}; color:#fff; font-weight:500; font-size:14px;
          padding:14px 28px; border-radius:999px; text-decoration:none;
          transition:box-shadow 0.25s, transform 0.25s;
        }
        .btn-ink:hover { box-shadow:0 16px 36px rgba(12,10,9,0.25); transform:translateY(-1px); }
        .btn-ink svg { transition:transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .btn-ink:hover svg:last-child { transform:translateX(4px); }

        .btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,255,255,0.85); backdrop-filter:blur(8px); color:${T.ink}; font-weight:500; font-size:14px;
          padding:13px 28px; border-radius:999px; text-decoration:none;
          border:1px solid ${T.line}; transition:background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .btn-outline:hover { background:${T.white}; border-color:#D6D3D1; transform:translateY(-1px); }

        .floating-status-card {
          position:absolute; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px);
          border-radius:20px; border:1px solid ${T.line}; box-shadow:0 18px 40px rgba(12,10,9,0.06);
          padding:12px 18px; display:flex; align-items:center; gap:12px; z-index:2;
        }

        @media (max-width: 1200px) {
          .floating-status-card { display:none !important; }
        }
      `}</style>

      <div
        ref={ref}
        className="hero-root"
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
      >
        {/* ── 3D water scene (WebGL) ── */}
        {glOk ? (
          <WaterScene onUnsupported={onUnsupported} />
        ) : (
          <>
            <Orb size={480} bg={ORBS.violet} opacity={0.38} blur={55} pos={{ top: -140, right: -120 }} scrollY={orbA} mx={mx} my={my} depth={1.2} dur={11} />
            <Orb size={390} bg={ORBS.sky}    opacity={0.32} blur={50} pos={{ bottom: -120, left: -100 }} scrollY={orbB} mx={mx} my={my} depth={0.8} dur={13} delay={1} />
            <Orb size={130} bg={ORBS.sun}    opacity={0.45} blur={24} pos={{ top: "32%", left: "8%" }} scrollY={orbC} mx={mx} my={my} depth={2} dur={8} delay={0.5} />
            <Orb size={85}  bg={ORBS.mint}   opacity={0.5} blur={16} pos={{ top: "20%", right: "12%" }} scrollY={orbC} mx={mx} my={my} depth={2.4} dur={7} delay={1.5} />
          </>
        )}

        {/* Legibility veil + soft fade into the page below */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background:
              "radial-gradient(ellipse 58% 52% at 50% 50%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 55%, rgba(255,255,255,0) 100%), linear-gradient(to bottom, rgba(255,255,255,0) 72%, #FFFFFF 100%)",
          }}
        />

        {/* ── Floating status card 1 (Health Score) ── */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          style={{ top: "20%", right: "7%" }}
          className="floating-status-card"
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.activity} size={18} color={T.ink} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Health Score</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Excellent ↑ 12%</p>
          </div>
        </motion.div>

        {/* ── Floating status card 2 (Next Appointment) ── */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          style={{ bottom: "20%", left: "6%" }}
          className="floating-status-card"
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.calendar} size={18} color={T.ink} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Next Appointment</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Tomorrow, 10:00 AM</p>
          </div>
        </motion.div>

        {/* ── Main content ── */}
        <motion.div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "120px 24px 80px",
            width: "100%",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
          }}
        >
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            {/* Top badge */}
            <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: `1px solid ${T.line}`, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                <div style={{ position: "relative", width: 26, height: 26 }}>
                  <motion.span
                    animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }}
                  />
                  <div style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.cross} size={13} color="white" />
                  </div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>AI-Powered Healthcare Platform</span>
              </span>
            </motion.div>

            {/* H1 Heading */}
            <WordReveal
              as="h1"
              text={"Find Your Doctor,\nGet AI-Powered Guidance"}
              style={{ fontSize: "clamp(40px, 6.5vw, 84px)", fontWeight: 300, color: T.ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}
            />

            {/* Subtitle */}
            <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
              CuraLink connects you with trusted medical professionals effortlessly. Use our smart symptom analyzer or search directly to find the care you deserve.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 54 }}>
              <Magnetic>
                <Link to="/find-doctors" className="btn-ink">
                  <Icon d={ICONS.search} size={16} color="white" />
                  Search Doctors
                  <Icon d={ICONS.arrow} size={15} color="white" />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link to="/symptom-analyzer" className="btn-outline">
                  <Icon d={ICONS.ai} size={16} color={T.ink} />
                  Analyze Symptoms (AI)
                </Link>
              </Magnetic>
            </motion.div>

            {/* Stats row with count-up animation */}
            <motion.div
              variants={fadeUp}
              style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 38 }}
            >
              {STATS.map((s, i) => (
                <Stat key={i} {...s} delay={0.6 + i * 0.1} />
              ))}
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {TRUST.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${T.line}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                  }}
                >
                  <Icon d={t.icon} size={12} color={T.ink} />
                  <span style={{ fontSize: 12.5, fontWeight: 400, color: T.body, letterSpacing: "-0.01em" }}>{t.label}</span>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Scroll down indicator
            Outer element: position + scroll-linked fade.
            Inner element: one-time fade-in. Separate elements so the two
            opacity animations no longer fight each other. */}
        <motion.div
          style={{ position: "absolute", bottom: 26, left: "50%", x: "-50%", opacity: contentOpacity }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div style={{ width: 22, height: 36, borderRadius: 14, border: `1.5px solid ${T.muted}`, display: "flex", justifyContent: "center", paddingTop: 7 }}>
              <motion.span
                animate={{ y: [0, 11, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 3, height: 7, borderRadius: 3, background: T.ink }}
              />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </>
  );
};

export default Header;