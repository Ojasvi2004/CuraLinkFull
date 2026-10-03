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

// ─── THEME TOKENS (identical to the patient side) ────────────────────────────
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

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const I = {
  cross:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 12h8M12 8v8"],
  arrow:    "M17 8l4 4m0 0l-4 4m4-4H3",
  check:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  video:    ["M23 7l-7 5 7 5V7z", "M3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
};

const STATS = [
  { to: 12000, decimals: 0, suffix: "+",  label: "Doctors onboarded" },
  { to: 4.9,   decimals: 1, suffix: " ★", label: "Doctor rating" },
  { to: 40,    decimals: 0, suffix: "%",  label: "Less admin time" },
];

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger    = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const wordParent = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const wordChild  = {
  hidden:  { y: "115%", rotate: 4 },
  visible: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
};

// ─── SMALL UI HELPERS (same behaviour as the patient hero) ───────────────────
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
        background: "rgba(245,244,242,0.85)", backdropFilter: "blur(8px)",
        border: `1px solid ${T.line}`, borderRadius: 18, padding: "12px 22px",
        display: "flex", flexDirection: "column", alignItems: "center", minWidth: 124,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </span>
      <span style={{ fontSize: 12, fontWeight: 400, color: T.muted, marginTop: 2 }}>{label}</span>
    </motion.div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// NEURAL BRAIN  —  real-time WebGL, zero dependencies
//
// ~900 glass-bead neurons are scattered over a procedurally folded human brain
// (two hemispheres with a fissure, temporal lobes, cerebellum, brain stem) and
// joined by curved axons plus long-range arcs and a corpus-callosum bridge.
// Signals travel along the axons as comet pulses and chain-react across the
// network. The cortex breathes and slowly drifts through a field of floating
// spores.
//
//   HOVER  → neurons under the cursor swell outward and fire cascades
//   CLICK  → a shockwave races hop-by-hop through the whole network
//   IDLE   → the brain thinks on its own
// ═════════════════════════════════════════════════════════════════════════════

// Shared layout for every vertex: x y z | energy | hue | size
const STRIDE = 6;

const NODE_VS = `
attribute vec3 aPos;
attribute float aE;
attribute float aH;
attribute float aS;
uniform mat4 uMVP;
uniform vec2 uOff;
uniform float uPx;
uniform float uT;
uniform float uD;
uniform float uDrift;
varying float vE;
varying float vH;
varying float vF;
void main(){
  vec3 p = aPos;
  float e = aE;
  if (uDrift > 0.5){
    p += vec3(sin(uT*0.31 + aH*40.0), cos(uT*0.23 + aH*31.0), sin(uT*0.19 + aH*17.0)) * 0.22;
    e = 0.25 + 0.25 * sin(uT*1.4 + aH*50.0);
  }
  vec4 c = uMVP * vec4(p, 1.0);
  gl_Position = vec4(c.xy + uOff * c.w, c.zw);
  float size = aS * (1.0 + e * 2.2);
  gl_PointSize = max(1.5, uPx * size / c.w);
  vE = e;
  vH = aH;
  vF = mix(1.0, 0.32, clamp((c.w - uD) / 1.3 * 0.5 + 0.5, 0.0, 1.0));
}
`;

const NODE_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying float vE;
varying float vH;
varying float vF;
uniform float uT;
uniform float uDrift;
vec3 pal(float t){ return vec3(0.58) + 0.42 * cos(6.28318 * (vec3(t) + vec3(0.0, 0.33, 0.67))); }
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = length(q);
  if (d > 1.0) discard;
  float e = clamp(vE, 0.0, 1.6);
  float ea = clamp(e, 0.0, 1.0);

  vec3 irid = pal(vH + e * 0.35 + uT * 0.02);
  vec3 base = mix(vec3(0.50, 0.46, 0.88), irid, 0.55);
  vec3 hot  = mix(irid, vec3(1.0, 0.40, 0.62), 0.38);
  vec3 col  = mix(base, hot, ea);

  // glass bead: soft rim, specular glint, glowing core when excited
  float r0 = 0.42;
  vec2 qb = q / r0;
  float bead = smoothstep(r0, r0 - 0.07, d);
  float rim  = smoothstep(0.5, 1.0, length(qb));
  float spec = smoothstep(0.42, 0.0, length(qb - vec2(-0.38, -0.42)));
  vec3 beadCol = col * (0.78 + 0.32 * rim);
  beadCol = mix(beadCol, vec3(1.0), ea * 0.32 * (1.0 - length(qb)));
  beadCol += vec3(1.0) * spec * 0.85;

  // halo that grows with energy
  float halo = exp(-d * d * 5.0) * (0.10 + 0.55 * e);
  vec3 haloCol = mix(irid, hot, ea);

  float aB = bead * 0.95;
  float aH2 = halo * (1.0 - aB);
  float fade = vF * (uDrift > 0.5 ? 0.55 : 1.0);
  gl_FragColor = vec4((beadCol * aB + haloCol * aH2) * fade, (aB + aH2) * fade);
}
`;

const EDGE_VS = `
attribute vec3 aPos;
attribute float aE;
attribute float aH;
uniform mat4 uMVP;
uniform vec2 uOff;
uniform float uD;
varying float vE;
varying float vH;
varying float vF;
void main(){
  vec4 c = uMVP * vec4(aPos, 1.0);
  gl_Position = vec4(c.xy + uOff * c.w, c.zw);
  vE = aE;
  vH = aH;
  vF = mix(1.0, 0.3, clamp((c.w - uD) / 1.3 * 0.5 + 0.5, 0.0, 1.0));
}
`;

const EDGE_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying float vE;
varying float vH;
varying float vF;
uniform float uT;
vec3 pal(float t){ return vec3(0.58) + 0.42 * cos(6.28318 * (vec3(t) + vec3(0.0, 0.33, 0.67))); }
void main(){
  float e = clamp(vE, 0.0, 1.4);
  vec3 irid = pal(vH + e * 0.3 + uT * 0.02);
  vec3 col = mix(vec3(0.45, 0.40, 0.82), irid, 0.30 + 0.55 * min(e, 1.0));
  float a = (0.15 + 0.65 * e) * vF;
  gl_FragColor = vec4(col * a, a);
}
`;

// ── tiny matrix toolkit (column-major) ──
const persp = (f, a, n, fa) => [f / a, 0, 0, 0, 0, f, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0];
const mul = (a, b) => {
  const o = new Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
};
const rotY = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; };
const rotX = (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; };
const trans = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];

const mulberry = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ── procedural brain: neurons + axons ──
function buildBrain() {
  const rnd = mulberry(11);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(6.28318 * rnd());
  const pts = [];
  const DMIN2 = 0.072 * 0.072;

  const tryAdd = (x, y, z, ox, oy, oz, part) => {
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const dx = p.x - x, dy = p.y - y, dz = p.z - z;
      if (dx * dx + dy * dy + dz * dz < DMIN2) return false;
    }
    const l = Math.hypot(ox, oy, oz) || 1;
    pts.push({ x, y, z, ox: ox / l, oy: oy / l, oz: oz / l, part });
    return true;
  };

  // folded ellipsoid shell: gyri come from layered sine ridges
  const lobe = (cx, cy, cz, rx, ry, rz, n, fold, part, sx) => {
    let placed = 0, guard = 0;
    while (placed < n && guard < n * 40) {
      guard++;
      let dx = gauss(), dy = gauss(), dz = gauss();
      const l = Math.hypot(dx, dy, dz) || 1;
      dx /= l; dy /= l; dz /= l;
      const g = Math.sin(dx * 9 + dy * 6) * Math.sin(dz * 10 - dy * 5)
              + 0.55 * Math.sin(dx * 17 + dz * 13) * Math.sin(dy * 15 + 1.3)
              + 0.3 * Math.sin(dz * 24 + dx * 7);
      const inner = rnd() < 0.14 ? 0.35 + rnd() * 0.5 : 1 - rnd() * rnd() * 0.14;
      const k = (1 + fold * g) * inner;
      let y = dy * ry * k; if (dy < 0) y *= 0.72;
      const x = dx * rx * k, z = dz * rz * k;
      const X = sx ? sx * Math.max(cx + x, 0.05) : cx + x;
      if (tryAdd(X, cy + y, cz + z, (sx || 1) * dx / rx, dy / ry, dz / rz, part)) placed++;
    }
  };

  for (const s of [-1, 1]) {
    lobe(0.42, 0.08, 0.02, 0.46, 0.58, 0.98, 300, 0.07, s < 0 ? 0 : 1, s);   // cerebral hemisphere
    lobe(0.5, -0.3, 0.2, 0.3, 0.26, 0.55, 70, 0.05, 2, s);                     // temporal lobe
  }
  lobe(0, -0.48, -0.82, 0.52, 0.27, 0.34, 110, 0.035, 3, 0);                   // cerebellum

  let placed = 0, guard = 0;                                                    // brain stem
  while (placed < 42 && guard < 2000) {
    guard++;
    const u = rnd(), a = rnd() * 6.28318;
    const r = 0.11 * (1 - 0.3 * u) * (0.8 + 0.2 * rnd());
    if (tryAdd(Math.cos(a) * r, -0.38 - 0.62 * u, -0.3 - 0.14 * u + Math.sin(a) * r, Math.cos(a), 0, Math.sin(a), 4)) placed++;
  }

  const N = pts.length;
  const bp = new Float32Array(N * 3), out = new Float32Array(N * 3);
  const hue = new Float32Array(N), ph = new Float32Array(N);
  pts.forEach((p, i) => {
    bp.set([p.x, p.y, p.z], i * 3);
    out.set([p.ox, p.oy, p.oz], i * 3);
    hue[i] = 0.55 + 0.32 * p.z + 0.12 * p.x + 0.05 * rnd();
    ph[i] = rnd() * 6.28318;
  });

  // axons
  const nb = Array.from({ length: N }, () => []);
  const adj = Array.from({ length: N }, () => []);
  const ea = [], eb = [], eoff = [];
  const seen = new Set();
  const dist2 = (a, b) => {
    const dx = bp[a * 3] - bp[b * 3], dy = bp[a * 3 + 1] - bp[b * 3 + 1], dz = bp[a * 3 + 2] - bp[b * 3 + 2];
    return dx * dx + dy * dy + dz * dz;
  };
  const addEdge = (a, b, bulge) => {
    if (a === b) return;
    const key = a < b ? a * 4096 + b : b * 4096 + a;
    if (seen.has(key)) return;
    seen.add(key);
    const id = ea.length;
    ea.push(a); eb.push(b);
    nb[a].push(b); nb[b].push(a);
    adj[a].push(id); adj[b].push(id);
    const d = Math.sqrt(dist2(a, b));
    let ox = out[a * 3] + out[b * 3], oy = out[a * 3 + 1] + out[b * 3 + 1], oz = out[a * 3 + 2] + out[b * 3 + 2];
    const l = Math.hypot(ox, oy, oz) || 1;
    const m = d * bulge;
    eoff.push((ox / l) * m + (rnd() - 0.5) * 0.02, (oy / l) * m + (rnd() - 0.5) * 0.02, (oz / l) * m + (rnd() - 0.5) * 0.02);
  };

  for (let i = 0; i < N; i++) {                      // local neighbours
    const c = [];
    for (let j = 0; j < N; j++) { if (j === i) continue; const d2 = dist2(i, j); if (d2 < 0.0484) c.push([d2, j]); }
    c.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < Math.min(3, c.length); k++) addEdge(i, c[k][1], 0.18);
  }
  const bridge = (A, B, count, maxD2, bulge) => {  // lobe-to-lobe connections
    const ia = pts.map((p, i) => (A.includes(p.part) ? i : -1)).filter((i) => i >= 0);
    for (let n = 0, made = 0; n < count * 4 && made < count; n++) {
      const i = ia[(rnd() * ia.length) | 0];
      let best = -1, bd = 1e9;
      for (let j = 0; j < N; j++) if (B.includes(pts[j].part)) { const d2 = dist2(i, j); if (d2 < bd) { bd = d2; best = j; } }
      if (best >= 0 && bd < maxD2) { addEdge(i, best, bulge); made++; }
    }
  };
  bridge([0], [1], 34, 0.25, 0.1);                    // corpus callosum
  bridge([3], [0, 1, 2], 24, 0.2, 0.15);
  bridge([4], [3, 0, 1, 2], 14, 0.3, 0.15);
  for (let n = 0, made = 0; n < 600 && made < 34; n++) { // long fantasy arcs
    const i = (rnd() * N) | 0, j = (rnd() * N) | 0;
    const d2 = dist2(i, j);
    if (d2 > 0.12 && d2 < 0.65) { addEdge(i, j, 0.34); made++; }
  }

  // spores
  const M = 150;
  const motes = new Float32Array(M * STRIDE);
  for (let i = 0; i < M; i++) {
    let dx = gauss(), dy = gauss(), dz = gauss();
    const l = Math.hypot(dx, dy, dz) || 1, r = 1.25 + rnd() * 1.7;
    motes.set([(dx / l) * r, (dy / l) * r * 0.8, (dz / l) * r, 0, rnd(), 0.03 + rnd() * 0.03], i * STRIDE);
  }

  return { N, bp, out, hue, ph, ea, eb, eoff, nb, adj, motes, M };
}

const BrainScene = ({ onUnsupported }) => {
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // fresh canvas per run (StrictMode-safe, see patient hero)
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
    wrap.appendChild(canvas);
    const bail = () => { if (canvas.parentNode) canvas.parentNode.removeChild(canvas); onUnsupported && onUnsupported(); };

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
    if (!gl) { bail(); return; }

    const makeProg = (vsSrc, fsSrc) => {
      const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
        return s;
      };
      const v = sh(gl.VERTEX_SHADER, vsSrc), f = sh(gl.FRAGMENT_SHADER, fsSrc);
      if (!v || !f) return null;
      const p = gl.createProgram();
      gl.attachShader(p, v); gl.attachShader(p, f);
      ["aPos", "aE", "aH", "aS"].forEach((n, i) => gl.bindAttribLocation(p, i, n));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
      const u = {};
      ["uMVP", "uOff", "uPx", "uT", "uD", "uDrift"].forEach((n) => (u[n] = gl.getUniformLocation(p, n)));
      return { p, u };
    };
    const nodeProg = makeProg(NODE_VS, NODE_FS);
    const edgeProg = makeProg(EDGE_VS, EDGE_FS);
    if (!nodeProg || !edgeProg) { bail(); return; }

    // ── world ──
    const B = buildBrain();
    const { N, bp, out, hue, ph, ea, eb, eoff, nb, adj } = B;
    const E = ea.length;
    const SEG = 4;

    const mkBuf = (data, usage) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      return b;
    };
    const MAXP = 90;
    const nodeData  = new Float32Array(N * STRIDE);
    const edgeData  = new Float32Array(E * SEG * 2 * STRIDE);
    const pulseData = new Float32Array(MAXP * 3 * STRIDE);
    const nodeBuf  = mkBuf(nodeData, gl.DYNAMIC_DRAW);
    const edgeBuf  = mkBuf(edgeData, gl.DYNAMIC_DRAW);
    const pulseBuf = mkBuf(pulseData, gl.DYNAMIC_DRAW);
    const moteBuf  = mkBuf(B.motes, gl.STATIC_DRAW);

    const bindLayout = (buf) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      const f = 4;
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, STRIDE * f, 0);
      gl.vertexAttribPointer(1, 1, gl.FLOAT, false, STRIDE * f, 12);
      gl.vertexAttribPointer(2, 1, gl.FLOAT, false, STRIDE * f, 16);
      gl.vertexAttribPointer(3, 1, gl.FLOAT, false, STRIDE * f, 20);
      for (let i = 0; i < 4; i++) gl.enableVertexAttribArray(i);
    };

    // ── state ──
    const en = new Float32Array(N);        // neuron energy (0 calm → 1.5 blazing)
    const cool = new Float32Array(N);      // refractory timer
    const dp = new Float32Array(N * 3);    // displayed positions
    const sx = new Float32Array(N), sy = new Float32Array(N), sw = new Float32Array(N);
    let pulses = [];
    let waves = [];
    const ptr = { x: 0, y: 0, active: false };
    const sm = { x: 0, y: 0 };
    let mvp = mul(persp(1 / Math.tan(0.332), 1.6, 0.1, 30), trans(0, 0, -4.2));
    let off = [0, 0], camD = 4.2, aspect = 1.6;
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;
    const F = 1 / Math.tan(0.332);          // 38° vertical fov
    const TANH = Math.tan(0.332);

    const fire = (i, n, skipEdge = -1) => {
      cool[i] = 1.4;
      en[i] = Math.max(en[i], 0.9);
      const list = adj[i];
      for (let k = 0; k < n && pulses.length < MAXP; k++) {
        const e = list[(Math.random() * list.length) | 0];
        if (e === undefined || e === skipEdge) continue;
        pulses.push({ e, dir: ea[e] === i ? 1 : -1, t: 0, sp: 2.6 + Math.random() * 1.6 });
      }
    };

    const project = (x, y, z) => {
      const w = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15];
      return [(mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12]) / w + off[0], (mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13]) / w + off[1], w];
    };

    const updateCamera = (t, dt) => {
      const k = 1 - Math.exp(-dt * 3);
      sm.x += ((ptr.active ? ptr.x : 0) - sm.x) * k;
      sm.y += ((ptr.active ? ptr.y : 0) - sm.y) * k;
      const yaw = reduce ? -0.7 : -0.75 + 0.55 * Math.sin(t * 0.13) + sm.x * 0.5;
      const pitch = reduce ? 0.14 : 0.14 - sm.y * 0.22;
      camD = Math.max(4.0, 1.3 / (TANH * aspect));
      off = aspect > 1.25 ? [0.36, 0] : [0, 0];
      mvp = mul(persp(F, aspect, 0.1, 30), mul(trans(0, 0, -camD), mul(rotX(pitch), rotY(yaw))));
    };

    const bez = (a, b, e, u, o) => {
      const iu = 1 - u;
      for (let c = 0; c < 3; c++) {
        const A = dp[a * 3 + c], Bv = dp[b * 3 + c];
        const C = (A + Bv) / 2 + eoff[e * 3 + c] * 2;
        o[c] = iu * iu * A + 2 * iu * u * C + u * u * Bv;
      }
    };

    let nextIdle = 0.4;
    const tmp = [0, 0, 0];

    const step = (t, dt) => {
      updateCamera(t, dt);

      // displaced neuron positions: breathing + energy-driven swelling
      const br = 0.012 * Math.sin(t * 0.9);
      for (let i = 0; i < N; i++) {
        const k = en[i] * 0.17 + br + 0.01 * Math.sin(t * 0.6 + ph[i]);
        const x = bp[i * 3] + out[i * 3] * k, y = bp[i * 3 + 1] + out[i * 3 + 1] * k + 0.006 * Math.sin(t * 0.8 + ph[i] * 3), z = bp[i * 3 + 2] + out[i * 3 + 2] * k;
        dp[i * 3] = x; dp[i * 3 + 1] = y; dp[i * 3 + 2] = z;
        const p = project(x, y, z);
        sx[i] = p[0]; sy[i] = p[1]; sw[i] = p[2];
      }

      // decay, then cursor + shockwave energy
      const dec = Math.exp(-dt * 1.5), grab = 1 - Math.exp(-dt * 12);
      const R = 0.24;
      for (let i = 0; i < N; i++) {
        en[i] *= dec; cool[i] -= dt;
        if (ptr.active) {
          const dx = (sx[i] - ptr.x) * aspect, dy = sy[i] - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const v = 1 - d / R;
            let tg = v * v * (3 - 2 * v) * 1.1;
            if (sw[i] > camD + 0.35) tg *= 0.6;
            if (tg > en[i]) en[i] += (tg - en[i]) * grab;
            if (tg > 0.5 && cool[i] <= 0) fire(i, 2);
          }
        }
      }
      waves = waves.filter((w) => t - w.t0 < 5);
      for (const w of waves) {
        const age = t - w.t0, fade = Math.exp(-age * 0.4) * 1.3;
        for (let i = 0; i < N; i++) {
          const h = w.hops[i];
          if (h > 900) continue;
          const x = age * 9 - h;
          if (x > -2.2 && x < 2.2) en[i] = Math.max(en[i], Math.exp((-x * x) / 1.6) * fade);
        }
      }
      if (t > nextIdle) { fire((Math.random() * N) | 0, 2); nextIdle = t + 0.35 + Math.random() * 0.5; }

      // signals travelling along axons
      for (let p = pulses.length - 1; p >= 0; p--) {
        const q = pulses[p];
        q.t += dt * q.sp;
        if (q.t >= 1) {
          const dst = q.dir > 0 ? eb[q.e] : ea[q.e];
          en[dst] = Math.min(1.4, en[dst] + 0.65);
          if (cool[dst] <= 0 && Math.random() < 0.62) fire(dst, Math.random() < 0.4 ? 2 : 1, q.e);
          pulses.splice(p, 1);
        }
      }
    };

    let moteLoc;
    const setU = (pr, t, drift) => {
      gl.useProgram(pr.p);
      gl.uniformMatrix4fv(pr.u.uMVP, false, mvp);
      gl.uniform2f(pr.u.uOff, off[0], off[1]);
      gl.uniform1f(pr.u.uPx, 0.5 * canvas.height * F);
      gl.uniform1f(pr.u.uT, t);
      gl.uniform1f(pr.u.uD, camD);
      gl.uniform1f(pr.u.uDrift, drift);
    };

    const draw = (t) => {
      // node buffer
      for (let i = 0; i < N; i++) {
        const o = i * STRIDE;
        nodeData[o] = dp[i * 3]; nodeData[o + 1] = dp[i * 3 + 1]; nodeData[o + 2] = dp[i * 3 + 2];
        nodeData[o + 3] = en[i]; nodeData[o + 4] = hue[i]; nodeData[o + 5] = 0.05;
      }
      // axon buffer (curved, 4 segments each)
      let o = 0;
      for (let e = 0; e < E; e++) {
        const a = ea[e], b = eb[e];
        let px = dp[a * 3], py = dp[a * 3 + 1], pz = dp[a * 3 + 2], pe = en[a], phh = hue[a];
        for (let s = 1; s <= SEG; s++) {
          const u = s / SEG;
          bez(a, b, e, u, tmp);
          const qe = en[a] + (en[b] - en[a]) * u, qh = hue[a] + (hue[b] - hue[a]) * u;
          edgeData[o++] = px; edgeData[o++] = py; edgeData[o++] = pz; edgeData[o++] = pe; edgeData[o++] = phh; edgeData[o++] = 0;
          edgeData[o++] = tmp[0]; edgeData[o++] = tmp[1]; edgeData[o++] = tmp[2]; edgeData[o++] = qe; edgeData[o++] = qh; edgeData[o++] = 0;
          px = tmp[0]; py = tmp[1]; pz = tmp[2]; pe = qe; phh = qh;
        }
      }
      // comet pulses (head + 2 trailing beads)
      let pc = 0, po = 0;
      const trail = [[0, 1.1, 0.02], [0.07, 0.75, 0.016], [0.14, 0.45, 0.012]];
      for (const q of pulses) {
        const a = q.dir > 0 ? ea[q.e] : eb[q.e], b = q.dir > 0 ? eb[q.e] : ea[q.e];
        for (const [lag, e, s] of trail) {
          bez(a, b, q.e, Math.max(0, q.t - lag), tmp);
          pulseData[po++] = tmp[0]; pulseData[po++] = tmp[1]; pulseData[po++] = tmp[2];
          pulseData[po++] = e; pulseData[po++] = hue[a]; pulseData[po++] = s;
          pc++;
        }
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);

      setU(nodeProg, t, 1);                                  // spores
      bindLayout(moteBuf);
      gl.drawArrays(gl.POINTS, 0, B.M);

      setU(edgeProg, t, 0);                                  // axons
      bindLayout(edgeBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, edgeData);
      gl.drawArrays(gl.LINES, 0, E * SEG * 2);

      setU(nodeProg, t, 0);                                  // neurons
      bindLayout(nodeBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, nodeData);
      gl.drawArrays(gl.POINTS, 0, N);

      if (pc) {                                              // signals
        bindLayout(pulseBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, pulseData.subarray(0, pc * STRIDE));
        gl.drawArrays(gl.POINTS, 0, pc);
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      let s = Math.min(window.devicePixelRatio || 1, 1.8);
      const px = r.width * r.height * s * s;
      if (px > 2.6e6) s *= Math.sqrt(2.6e6 / px);
      canvas.width = Math.max(2, Math.floor(r.width * s));
      canvas.height = Math.max(2, Math.floor(r.height * s));
      aspect = r.width / Math.max(1, r.height);
    };

    let raf = 0, last = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = now(), dt = Math.min(0.05, t - last);
      last = t;
      step(t, dt);
      draw(t);
    };
    const start = () => { if (!raf && !reduce) { last = now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const onContextLost = (e) => { e.preventDefault(); stop(); onUnsupported && onUnsupported(); };
    canvas.addEventListener("webglcontextlost", onContextLost);

    resize();
    const still = () => {            // reduced motion: one calm, lit frame
      for (let k = 0; k < 14; k++) en[(Math.random() * N) | 0] = 0.8;
      step(3, 0.016); draw(3);
    };
    if (reduce) still();

    const ro = new ResizeObserver(() => { resize(); if (reduce) still(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    // ── interaction (listens on the whole hero) ──
    const host = wrap.parentElement;
    const toNdc = (cx, cy) => {
      const r = canvas.getBoundingClientRect();
      return [((cx - r.left) / r.width) * 2 - 1, -(((cy - r.top) / r.height) * 2 - 1)];
    };
    const onMove = (e) => {
      if (reduce) return;
      const [x, y] = toNdc(e.clientX, e.clientY);
      ptr.x = x; ptr.y = y; ptr.active = true;
    };
    const onLeave = () => { ptr.active = false; };
    const onDown = (e) => {
      if (reduce || (e.target.closest && e.target.closest("a,button,input"))) return;
      const [x, y] = toNdc(e.clientX, e.clientY);
      ptr.x = x; ptr.y = y; ptr.active = true;
      let best = 0, bd = 1e9;
      for (let i = 0; i < N; i++) {
        const d = Math.hypot((sx[i] - x) * aspect, sy[i] - y) + (sw[i] > camD ? 0.05 : 0);
        if (d < bd) { bd = d; best = i; }
      }
      const hops = new Float32Array(N).fill(999);   // BFS across the axon graph
      hops[best] = 0;
      const queue = [best];
      for (let qi = 0; qi < queue.length; qi++) {
        const v = queue[qi];
        for (const n of nb[v]) if (hops[n] === 999) { hops[n] = hops[v] + 1; queue.push(n); }
      }
      waves.push({ t0: now(), hops });
      if (waves.length > 3) waves.shift();
      en[best] = 1.5;
      fire(best, 3);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [reduce, onUnsupported]);

  return <div ref={wrapRef} aria-hidden style={{ position: "absolute", inset: 0 }} />;
};

// Soft fallback when WebGL is unavailable
const FallbackGlow = () => (
  <>
    {[
      { s: 460, c: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, #C9B8FF 22%, #7C8CFF 48%, #F6A5D8 78%, #FFD9B8 100%)", p: { top: "12%", right: "6%" }, d: 11 },
      { s: 300, c: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #A5D8FF 26%, #5B8CFF 56%, #C2A6FF 100%)", p: { bottom: "6%", left: "4%" }, d: 13 },
    ].map((o, i) => (
      <motion.div key={i} aria-hidden
        animate={{ y: [0, -22, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: o.d, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", width: o.s, height: o.s, borderRadius: "50%", background: o.c, opacity: 0.38, filter: "blur(50px)", pointerEvents: "none", ...o.p }} />
    ))}
  </>
);

// ─── HERO ────────────────────────────────────────────────────────────────────
const DoctorHero = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [glOk, setGlOk] = useState(true);
  const onUnsupported = useCallback(() => setGlOk(false), []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .dl-root { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:${T.white}; color:${T.body}; -webkit-font-smoothing:antialiased; touch-action:pan-y; }
        .dl-root ::selection { background:${T.ink}; color:${T.white}; }

        .dl-aura {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 38% 56% at 68% 50%, rgba(201,184,255,0.55) 0%, rgba(165,216,255,0.26) 48%, rgba(255,255,255,0) 72%),
            radial-gradient(ellipse 34% 40% at 18% 92%, rgba(255,217,184,0.38) 0%, rgba(255,255,255,0) 70%),
            radial-gradient(ellipse 30% 36% at 92% 8%, rgba(246,165,216,0.26) 0%, rgba(255,255,255,0) 70%),
            ${T.white};
        }
        .dl-veil {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 46% 62% at 26% 50%, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0.34) 58%, rgba(255,255,255,0) 100%),
            linear-gradient(to bottom, rgba(255,255,255,0) 72%, #FFFFFF 100%);
        }

        .dl-hero-grid { display:grid; grid-template-columns:1.05fr 0.95fr; gap:48px; align-items:center; }
        .dl-copy { text-align:left; }
        .dl-row { display:flex; flex-wrap:wrap; gap:14px; }
        .dl-sub { max-width:500px; }

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
        .btn-ink:focus-visible, .btn-outline:focus-visible { outline:2px solid ${T.ink}; outline-offset:3px; }

        .floating-status-card {
          position:absolute; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px);
          border-radius:20px; border:1px solid ${T.line}; box-shadow:0 18px 40px rgba(12,10,9,0.06);
          padding:12px 18px; display:flex; align-items:center; gap:12px; z-index:2; pointer-events:none;
        }
        .dl-hint {
          position:absolute; right:5%; bottom:30px; z-index:2; pointer-events:none;
          background:rgba(255,255,255,0.8); backdrop-filter:blur(10px); border:1px solid ${T.line};
          border-radius:40px; padding:8px 16px; font-size:12.5px; font-weight:400; color:${T.body};
        }

        @media (max-width: 1200px) { .floating-status-card { display:none !important; } }
        @media (max-width: 900px) {
          .dl-hero-grid { grid-template-columns:1fr; }
          .dl-hide-m { display:none; }
          .dl-copy { text-align:center; }
          .dl-row { justify-content:center; }
          .dl-sub { margin-left:auto; margin-right:auto; }
          .dl-aura { background:
            radial-gradient(ellipse 80% 50% at 50% 48%, rgba(201,184,255,0.5) 0%, rgba(165,216,255,0.22) 52%, rgba(255,255,255,0) 78%),
            ${T.white}; }
          .dl-veil { background:
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.42) 60%, rgba(255,255,255,0.1) 100%),
            linear-gradient(to bottom, rgba(255,255,255,0) 72%, #FFFFFF 100%); }
          .dl-hint { display:none; }
        }
      `}</style>

      <section ref={ref} className="dl-root"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

        <div className="dl-aura" aria-hidden />
        {glOk ? <BrainScene onUnsupported={onUnsupported} /> : <FallbackGlow />}
        <div className="dl-veil" aria-hidden />

        {/* floating glass cards over the brain */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          style={{ top: "20%", right: "5%" }} className="floating-status-card">
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={I.activity} size={18} color={T.ink} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Smart triage</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>3 patients flagged</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
          style={{ bottom: "19%", left: "52%" }} className="floating-status-card">
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={I.video} size={18} color={T.ink} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>Next visit</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 1 }}>Video call in 12 min</p>
          </div>
        </motion.div>

        {!reduce && glOk && (
          <motion.div className="dl-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}>
            Hover to light up neurons. Click to fire a thought.
          </motion.div>
        )}

        {/* ── content ── */}
        <motion.div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%", position: "relative", zIndex: 1, y: contentY, opacity: contentOpacity }}>
          <div className="dl-hero-grid">
            <motion.div className="dl-copy" initial="hidden" animate="visible" variants={stagger}>

              <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: `1px solid ${T.line}`, borderRadius: 40, padding: "6px 16px 6px 8px" }}>
                  <span style={{ position: "relative", width: 26, height: 26 }}>
                    <motion.span animate={{ scale: [1, 1.9], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.ink }} />
                    <span style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={I.cross} size={13} color="white" />
                    </span>
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: T.ink, letterSpacing: "-0.01em" }}>Built for practising doctors</span>
                </span>
              </motion.div>

              <WordReveal as="h1" text={"Run your practice\nwith less friction."}
                style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 300, color: T.ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }} />

              <motion.p className="dl-sub" variants={fadeUp}
                style={{ fontSize: "clamp(15px,2vw,18px)", color: T.body, lineHeight: 1.7, marginBottom: 36 }}>
                CuraLink handles appointments, queues and video visits for 12,000+ doctors, so your attention stays on patients.
              </motion.p>

              <motion.div className="dl-row" variants={fadeUp} style={{ marginBottom: 44 }}>
                <Magnetic>
                  <Link to="/doctor/register" className="btn-ink">
                    Register your clinic <Icon d={I.arrow} size={15} color="white" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link to="/doctor/login" className="btn-outline">Doctor login</Link>
                </Magnetic>
              </motion.div>

              <motion.div className="dl-row" variants={fadeUp} style={{ gap: 12 }}>
                {STATS.map((s, i) => <Stat key={i} {...s} delay={0.6 + i * 0.1} />)}
              </motion.div>
            </motion.div>

            {/* right column is intentionally empty: the brain lives behind it */}
            <div className="dl-hide-m" aria-hidden style={{ minHeight: 420 }} />
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div style={{ position: "absolute", bottom: 26, left: "50%", x: "-50%", opacity: contentOpacity }} aria-hidden>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>
            <div style={{ width: 22, height: 36, borderRadius: 14, border: `1.5px solid ${T.muted}`, display: "flex", justifyContent: "center", paddingTop: 7 }}>
              <motion.span animate={{ y: [0, 11, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 3, height: 7, borderRadius: 3, background: T.ink }} />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default DoctorHero;