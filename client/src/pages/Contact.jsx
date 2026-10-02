import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

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

// Iridescent orb gradients
const ORBS = {
  violet: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)",
  sun:    "radial-gradient(circle at 32% 26%, #FFF3D6 0%, #FFB36B 28%, #FF5E3A 58%, #7A2BFF 100%)",
  sky:    "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)",
  mint:   "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #BDEFD8 26%, #5FD0A5 56%, #8EC5FF 100%)",
};

// ─── ICON PRIMITIVE ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  mail:     ["M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8", "M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"],
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"],
  location: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  faq:      ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  sparkle:  ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", "M5 3v4M3 5h4M19 17v4M17 19h4"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  subject:  ["M4 6h16M4 12h16M4 18h8"],
  msg:      ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
};

const CONTACT_CARDS = [
  {
    icon: ICONS.mail,
    title: "Email Us",
    sub: "General inquiries, support or feedback.",
    value: "support@curalink.com",
    href: "mailto:support@curalink.com",
    detail: "We reply within 24 hours",
  },
  {
    icon: ICONS.phone,
    title: "Call Us",
    sub: "Speak with our support team directly.",
    value: "(123) 456-7890",
    href: "tel:+1234567890",
    detail: "Mon – Fri, 9 AM – 6 PM",
  },
  {
    icon: ICONS.location,
    title: "Our Office",
    sub: "Visit us at our main headquarters.",
    value: "123 Health St, Wellness City",
    href: "#map",
    detail: "Get directions →",
  },
  {
    icon: ICONS.faq,
    title: "FAQ",
    sub: "Quick answers to common questions.",
    value: "Visit FAQ Page",
    href: "/faq",
    detail: "50+ articles available",
  },
];

// Hero trust pills (taken from the page's own content)
const HERO_PILLS = [
  { icon: ICONS.clock, label: "Replies within 24 hours" },
  { icon: ICONS.phone, label: "Mon – Fri, 9 AM – 6 PM" },
  { icon: ICONS.faq,   label: "50+ FAQ articles" },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const heroStagger = {
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

// ─── HOOKS & HELPERS ─────────────────────────────────────────────────────────
const useParallax = (progress, from, to) => {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
};

// Mask Word Reveal
const WordReveal = ({ text, as = "h2", style = {}, ...rest }) => {
  const Tag = motion[as];
  const lines = text.split("\n");
  return (
    <Tag variants={wordParent} style={style} {...rest}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginBottom: "-0.14em", marginRight: "0.26em" }}>
              <motion.span variants={wordChild} style={{ display: "inline-block", transformOrigin: "0% 100%" }}>{w}</motion.span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// Pill with rotating sparkle
const Pill = ({ children }) => (
  <motion.span
    variants={fadeUp}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      fontWeight: 500,
      color: T.muted,
      marginBottom: 16,
      letterSpacing: "-0.01em",
    }}
  >
    <motion.span
      animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-flex" }}
    >
      <Icon d={ICONS.sparkle} size={12} color={T.muted} />
    </motion.span>
    {children}
  </motion.span>
);

// Magnetic wrapper
const Magnetic = ({ children, strength = 0.28 }) => {
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

// 3D Tilt Card with cursor radial spotlight
const TiltCard = ({ children, style = {}, max = 5, ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="about-card"
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, ...style }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

// ─── FLOATING INPUT ───────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", icon, textarea = false, rows = 5 }) => {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const active = focused || val.length > 0;

  const baseStyle = {
    width: "100%",
    background: focused ? T.white : T.surface2,
    border: `1px solid ${focused ? T.ink : T.line}`,
    borderRadius: 16,
    outline: "none",
    fontSize: 14,
    fontWeight: 400,
    color: T.ink,
    transition: "all 0.22s ease",
    boxShadow: focused ? "0 4px 18px rgba(12,10,9,0.04)" : "none",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          position: "absolute",
          left: 44,
          top: active ? 9 : textarea ? 20 : "50%",
          transform: active ? "none" : textarea ? "none" : "translateY(-50%)",
          fontSize: active ? 10.5 : 13.5,
          fontWeight: active ? 500 : 400,
          color: focused ? T.ink : T.muted,
          transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "none",
          letterSpacing: active ? "0.02em" : 0,
          textTransform: active ? "uppercase" : "none",
          zIndex: 2,
        }}
      >
        {label}
      </label>

      <div style={{ position: "absolute", left: 16, top: textarea ? 20 : "50%", transform: textarea ? "none" : "translateY(-50%)", zIndex: 2 }}>
        <Icon d={icon} size={16} color={focused ? T.ink : T.muted} />
      </div>

      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          required
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...baseStyle,
            padding: "30px 16px 14px 44px",
            resize: "vertical",
            minHeight: 130,
          }}
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...baseStyle,
            height: 56,
            paddingTop: active ? 20 : 0,
            paddingBottom: active ? 4 : 0,
            paddingLeft: 44,
            paddingRight: 16,
          }}
        />
      )}
    </div>
  );
};

// ─── FALLBACK ORB (hero only, used when WebGL is unavailable) ────────────────
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

    // Fresh canvas on every effect run: a canvas whose context was killed with
    // loseContext() can never give back a working context.
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

// ─── HERO (same style as the home header: WebGL water scene) ─────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const [glOk, setGlOk] = useState(true);
  const onUnsupported = useCallback(() => setGlOk(false), []);

  const contentY = useParallax(scrollYProgress, 0, 100);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.95]);

  // fallback orbs only
  const orbA = useParallax(scrollYProgress, 0, -240);
  const orbB = useParallax(scrollYProgress, 0, 180);
  const orbC = useParallax(scrollYProgress, 0, -110);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      style={{ position: "relative", minHeight: "78vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
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

      {/* ── Floating status card 1 ── */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
        style={{ top: "22%", right: "7%" }}
        className="floating-status-card"
      >
        <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICONS.mail} size={18} color={T.ink} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Response Time</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Within 24 hours</p>
        </div>
      </motion.div>

      {/* ── Floating status card 2 ── */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
        style={{ bottom: "20%", left: "6%" }}
        className="floating-status-card"
      >
        <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICONS.clock} size={18} color={T.ink} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Support Hours</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Mon – Fri, 9 AM – 6 PM</p>
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "120px 24px 70px",
          width: "100%",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <motion.div initial="hidden" animate="visible" variants={heroStagger}>

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
              <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>We'd love to hear from you</span>
            </span>
          </motion.div>

          {/* H1 */}
          <WordReveal
            as="h1"
            text="Get In Touch"
            style={{ fontSize: "clamp(40px, 6.5vw, 84px)", fontWeight: 300, color: T.ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}
          />

          {/* Subtitle */}
          <motion.p variants={fadeUp} style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 36px" }}>
            We're here to help with any question you might have. Our dedicated team typically responds within 24 hours.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 40 }}>
            <Magnetic>
              <a href="#contact-form" className="hero-btn-ink">
                <Icon d={ICONS.msg} size={16} color="white" />
                Send a Message
                <Icon d={ICONS.arrow} size={15} color="white" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="tel:+1234567890" className="hero-btn-outline">
                <Icon d={ICONS.phone} size={16} color={T.ink} />
                Call Us
              </a>
            </Magnetic>
          </motion.div>

          {/* Pills */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {HERO_PILLS.map((t, i) => (
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

      {/* Scroll cue: outer = position + scroll fade, inner = one-time fade-in */}
      <motion.div
        style={{ position: "absolute", bottom: 26, left: "50%", x: "-50%", opacity: contentOpacity }}
        aria-hidden
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>
          <div style={{ width: 22, height: 36, borderRadius: 14, border: `1.5px solid ${T.muted}`, display: "flex", justifyContent: "center", paddingTop: 7 }}>
            <motion.span
              animate={{ y: [0, 11, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 3, height: 7, borderRadius: 3, background: T.ink }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Parallax Orbs
  const orbY1 = useParallax(scrollYProgress, 0, -180);
  const orbY2 = useParallax(scrollYProgress, 0, 160);
  const orbY3 = useParallax(scrollYProgress, 0, -110);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .ct-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.white};
          color: ${T.body};
          -webkit-font-smoothing: antialiased;
          overflow-x: clip;
          position: relative;
        }
        .ct-root ::selection { background: ${T.ink}; color: ${T.white}; }

        /* hero buttons + floating cards (same look as the home header) */
        .hero-btn-ink {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${T.ink}; color: #fff; font-weight: 500; font-size: 14px;
          padding: 14px 28px; border-radius: 999px; text-decoration: none;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .hero-btn-ink:hover { box-shadow: 0 16px 36px rgba(12,10,9,0.25); transform: translateY(-1px); }
        .hero-btn-ink svg { transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .hero-btn-ink:hover svg:last-child { transform: translateX(4px); }

        .hero-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); color: ${T.ink}; font-weight: 500; font-size: 14px;
          padding: 13px 28px; border-radius: 999px; text-decoration: none;
          border: 1px solid ${T.line}; transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .hero-btn-outline:hover { background: ${T.white}; border-color: #D6D3D1; transform: translateY(-1px); }

        .floating-status-card {
          position: absolute; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px);
          border-radius: 20px; border: 1px solid ${T.line}; box-shadow: 0 18px 40px rgba(12,10,9,0.06);
          padding: 12px 18px; display: flex; align-items: center; gap: 12px; z-index: 2;
        }
        @media (max-width: 1200px) {
          .floating-status-card { display: none !important; }
        }

        .about-card {
          position: relative;
          isolation: isolate;
          background: ${T.surface};
          border-radius: 24px;
          border: 1px solid ${T.line};
          transition: box-shadow 0.3s, border-color 0.3s;
          will-change: transform;
        }
        .about-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.95), rgba(255,255,255,0) 60%);
        }
        .about-card:hover {
          border-color: #D6D3D1;
          box-shadow: 0 18px 50px rgba(12,10,9,0.06);
        }
        .about-card:hover::before {
          opacity: 1;
        }

        .btn-ink {
          width: 100%;
          height: 52px;
          border-radius: 999px;
          border: none;
          background: ${T.ink};
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: box-shadow 0.25s, transform 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .btn-ink:hover:not(:disabled) {
          box-shadow: 0 14px 34px rgba(12,10,9,0.22);
          transform: translateY(-1px);
        }
        .btn-ink:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .btn-ink svg {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .btn-ink:hover:not(:disabled) svg {
          transform: translateX(4px);
        }

        .ct-map-card {
          width: 100%;
          height: 340px;
          border-radius: 24px;
          background: ${T.surface};
          border: 1px solid ${T.line};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
      `}</style>

      <div ref={containerRef} className="ct-root">

        {/* Ambient Scroll Parallax Orbs (sit behind the sections below the hero) */}
        <motion.div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: ORBS.violet,
            opacity: 0.32,
            filter: "blur(60px)",
            pointerEvents: "none",
            y: orbY1,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "35%",
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: ORBS.sky,
            opacity: 0.28,
            filter: "blur(55px)",
            pointerEvents: "none",
            y: orbY2,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "10%",
            right: -60,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: ORBS.sun,
            opacity: 0.24,
            filter: "blur(50px)",
            pointerEvents: "none",
            y: orbY3,
          }}
        />

        {/* ──────────────── HERO ──────────────── */}
        <Hero />

        {/* ──────────────── CONTACT CARDS ──────────────── */}
        <section style={{ padding: "0 24px 80px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}
            >
              {CONTACT_CARDS.map((c, i) => (
                <TiltCard key={i} style={{ padding: "28px 24px" }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: T.white,
                      border: `1px solid ${T.line}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    <Icon d={c.icon} size={20} color={T.ink} />
                  </div>

                  <h4 style={{ fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>
                    {c.title}
                  </h4>

                  <p style={{ fontSize: 13.5, color: T.muted, marginBottom: 14, lineHeight: 1.55 }}>
                    {c.sub}
                  </p>

                  <a
                    href={c.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: T.ink,
                      textDecoration: "none",
                      display: "block",
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.value}
                  </a>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.muted }}>
                    <Icon d={ICONS.clock} size={12} color={T.muted} />
                    <span style={{ fontSize: 12, fontWeight: 400 }}>{c.detail}</span>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ──────────────── FORM + INFO ──────────────── */}
        <section id="contact-form" style={{ padding: "0 24px 100px", position: "relative", zIndex: 1, scrollMarginTop: 40 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 36, alignItems: "start" }}>

            {/* ── FORM CARD ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              style={{
                background: T.surface,
                borderRadius: 28,
                border: `1px solid ${T.line}`,
                padding: "clamp(30px, 4vw, 42px)",
                overflow: "hidden",
              }}
            >
              <div style={{ marginBottom: 28 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: T.ink,
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    padding: "3px 12px",
                    borderRadius: 20,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  <Icon d={ICONS.sparkle} size={11} color={T.ink} />
                  Direct Message
                </span>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                  Send Us a Message
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    style={{ textAlign: "center", padding: "50px 20px" }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: T.ink,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 10px 24px rgba(12,10,9,0.15)",
                      }}
                    >
                      <Icon d={ICONS.check} size={26} color="white" />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 300, color: T.ink, letterSpacing: "-0.02em", marginBottom: 8 }}>
                      Message Sent!
                    </h3>
                    <p style={{ fontSize: 14.5, color: T.body, lineHeight: 1.7 }}>
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{
                        marginTop: 24,
                        padding: "10px 24px",
                        borderRadius: 999,
                        border: `1px solid ${T.line}`,
                        background: T.white,
                        color: T.ink,
                        fontWeight: 500,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: 14 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <Field label="Full Name" name="name" icon={ICONS.user} />
                      <Field label="Email Address" name="email" icon={ICONS.mail} type="email" />
                    </div>
                    <Field label="Subject" name="subject" icon={ICONS.subject} />
                    <Field label="Your Message" name="message" icon={ICONS.msg} textarea rows={5} />

                    <div style={{ marginTop: 6 }}>
                      <button type="submit" className="btn-ink" disabled={loading}>
                        {loading ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        ) : (
                          <>
                            Send Message
                            <Icon d={ICONS.arrow} size={15} color="white" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── INFO SIDE ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: T.ink,
                    background: T.white,
                    border: `1px solid ${T.line}`,
                    padding: "3px 12px",
                    borderRadius: 20,
                    letterSpacing: "-0.01em",
                    marginBottom: 12,
                  }}
                >
                  <Icon d={ICONS.sparkle} size={11} color={T.ink} />
                  Support Channels
                </span>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 300, color: T.ink, letterSpacing: "-0.025em" }}>
                  Other Ways to Reach Us
                </h2>
              </motion.div>

              {/* Channels List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {CONTACT_CARDS.map((c, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    style={{
                      background: T.surface,
                      borderRadius: 20,
                      border: `1px solid ${T.line}`,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      transition: "border-color 0.25s, box-shadow 0.25s",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: T.white,
                        border: `1px solid ${T.line}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon d={c.icon} size={18} color={T.ink} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em", marginBottom: 2 }}>
                        {c.title}
                      </h4>
                      <p style={{ fontSize: 13, color: T.body, marginBottom: 4, lineHeight: 1.5 }}>
                        {c.sub}
                      </p>
                      <a
                        href={c.href}
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: T.ink,
                          textDecoration: "none",
                        }}
                      >
                        {c.value}
                      </a>
                      <p style={{ fontSize: 11.5, color: T.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon d={ICONS.clock} size={11} color={T.muted} />
                        {c.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office hours card with deep black & iridescent accents */}
              <motion.div
                variants={fadeUp}
                style={{
                  marginTop: 18,
                  background: T.ink,
                  borderRadius: 24,
                  padding: "24px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Embedded decorative glow orb */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: ORBS.violet,
                    opacity: 0.35,
                    filter: "blur(30px)",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon d={ICONS.clock} size={15} color="white" />
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: "white", letterSpacing: "-0.01em" }}>
                      Support Hours
                    </p>
                  </div>

                  {[
                    ["Monday – Friday", "9:00 AM – 6:00 PM"],
                    ["Saturday", "10:00 AM – 2:00 PM"],
                    ["Sunday", "Closed"],
                  ].map(([day, time], i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 400 }}>{day}</span>
                      <span style={{ fontSize: 13, color: "white", fontWeight: 500 }}>{time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ──────────────── MAP ──────────────── */}
        <section id="map" style={{ padding: "0 24px 110px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{ maxWidth: 1100, margin: "0 auto" }}
          >
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Pill>Location</Pill>
              <WordReveal
                text={"Find Us on the Map"}
                style={{
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 300,
                  color: T.ink,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              />
              <motion.p variants={fadeUp} style={{ fontSize: 14.5, color: T.body }}>
                Visit our main office or explore our service areas.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="ct-map-card">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: T.white,
                  border: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(12,10,9,0.04)",
                }}
              >
                <Icon d={ICONS.location} size={24} color={T.ink} />
              </div>

              <p style={{ fontSize: 17, fontWeight: 400, color: T.ink, letterSpacing: "-0.01em" }}>
                123 Health St, Wellness City
              </p>
              <p style={{ fontSize: 13, color: T.muted }}>
                Replace with your Google Maps iframe
              </p>

              <div style={{ marginTop: 8 }}>
                <Magnetic>
                  <a
                    href="#"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 24px",
                      borderRadius: 999,
                      background: T.ink,
                      color: "white",
                      fontSize: 13.5,
                      fontWeight: 500,
                      textDecoration: "none",
                      boxShadow: "0 8px 24px rgba(12,10,9,0.18)",
                    }}
                  >
                    Open in Maps
                    <Icon d={ICONS.arrow} size={13} color="white" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default Contact;