import { useState, useEffect, useRef, useCallback } from "react";

// ─── DRUM PRESETS ──────────────────────────────────────────────
const DRUMS = [
  {
    id: "snare",
    name: "Snare",
    lugs: 8,
    topRange: [220, 330],
    bottomRange: [280, 420],
    color: "#E85D3A",
    accent: "#FF8C6B",
    description: "Batter & resonant head tuning",
    sizes: ['13"', '14"'],
    defaultSize: '14"',
    tips: "Tune the resonant head slightly higher than the batter for snare response.",
  },
  {
    id: "bass",
    name: "Bass Drum",
    lugs: 8,
    topRange: [55, 90],
    bottomRange: [60, 100],
    color: "#7B2FF7",
    accent: "#A66BFF",
    description: "Deep punch & resonance control",
    sizes: ['18"', '20"', '22"', '24"'],
    defaultSize: '22"',
    tips: "Tune both heads evenly for maximum sustain. Detune the batter slightly for more attack.",
  },
  {
    id: "rack-tom",
    name: "Rack Tom",
    lugs: 6,
    topRange: [140, 240],
    bottomRange: [160, 280],
    color: "#2D9CDB",
    accent: "#5BB8E8",
    description: "Clear pitch with controlled sustain",
    sizes: ['10"', '12"', '13"'],
    defaultSize: '12"',
    tips: "Tune the resonant head a minor third above the batter for melodic toms.",
  },
  {
    id: "floor-tom",
    name: "Floor Tom",
    lugs: 8,
    topRange: [80, 160],
    bottomRange: [90, 180],
    color: "#00C9A7",
    accent: "#33DBBD",
    description: "Warm low-end with body",
    sizes: ['14"', '16"', '18"'],
    defaultSize: '16"',
    tips: "Lower tuning gives more warmth. Keep lugs even to avoid warbling.",
  },
  {
    id: "hi-hat",
    name: "Hi-Hat",
    lugs: 6,
    topRange: [300, 500],
    bottomRange: [330, 550],
    color: "#F2C94C",
    accent: "#FFE082",
    description: "Chick sound & wash tuning",
    sizes: ['13"', '14"', '15"'],
    defaultSize: '14"',
    tips: "The bottom hi-hat should be slightly tighter than the top for a clean 'chick'.",
  },
];

// ─── SVG DRUM ILLUSTRATIONS ───────────────────────────────────
function SnareSVG({ color, accent, size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="snare-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Shell */}
      <ellipse cx="50" cy="65" rx="38" ry="12" fill={color} opacity="0.6" />
      <rect x="12" y="40" width="76" height="25" rx="2" fill="url(#snare-g)" />
      <ellipse cx="50" cy="40" rx="38" ry="12" fill={accent} opacity="0.7" />
      {/* Head lines */}
      <ellipse cx="50" cy="40" rx="35" ry="10" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.3" />
      <ellipse cx="50" cy="40" rx="28" ry="8" stroke="#fff" strokeWidth="0.3" fill="none" opacity="0.2" />
      {/* Lugs */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 38;
        const y = 50 + Math.sin(rad) * 8;
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#fff" opacity="0.6" />;
      })}
      {/* Snare wires */}
      {[-15, -10, -5, 0, 5, 10, 15].map((offset) => (
        <line key={offset} x1={35 + offset} y1="65" x2={35 + offset} y2="68" stroke={accent} strokeWidth="0.5" opacity="0.5" />
      ))}
      {/* Sticks */}
      <line x1="30" y1="18" x2="55" y2="38" stroke="#ddd" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="70" y1="18" x2="48" y2="36" stroke="#ddd" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="55" cy="38" r="2" fill="#fff" opacity="0.5" />
      <circle cx="48" cy="36" r="2" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function BassDrumSVG({ color, accent, size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bass-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="bass-head">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {/* Shell (side view) */}
      <ellipse cx="20" cy="50" rx="10" ry="35" fill={color} opacity="0.5" />
      <rect x="20" y="15" width="55" height="70" rx="2" fill="url(#bass-g)" />
      <ellipse cx="75" cy="50" rx="10" ry="35" fill={accent} opacity="0.4" />
      {/* Front head */}
      <ellipse cx="75" cy="50" rx="9" ry="33" fill="url(#bass-head)" stroke={accent} strokeWidth="1" opacity="0.6" />
      {/* Port hole */}
      <circle cx="75" cy="50" r="8" fill="rgba(0,0,0,0.3)" />
      <circle cx="75" cy="50" r="9" stroke={accent} strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Lugs on front */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 75 + Math.cos(rad) * 9;
        const y = 50 + Math.sin(rad) * 33;
        return <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.5" />;
      })}
      {/* Legs */}
      <line x1="35" y1="85" x2="30" y2="97" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <line x1="60" y1="85" x2="65" y2="97" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Beater */}
      <line x1="5" y1="50" x2="18" y2="50" stroke="#ddd" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="18" cy="50" r="4" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function RackTomSVG({ color, accent, size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="rack-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Mount arm */}
      <line x1="50" y1="10" x2="50" y2="28" stroke="#888" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="10" r="3" fill="#888" opacity="0.8" />
      {/* Shell (angled slightly) */}
      <ellipse cx="50" cy="70" rx="32" ry="10" fill={color} opacity="0.5" />
      <rect x="18" y="42" width="64" height="28" rx="2" fill="url(#rack-g)" />
      <ellipse cx="50" cy="42" rx="32" ry="10" fill={accent} opacity="0.6" />
      {/* Head detail */}
      <ellipse cx="50" cy="42" rx="28" ry="8" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Lugs */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 32;
        const y = 56 + Math.sin(rad) * 7;
        return <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.5" />;
      })}
    </svg>
  );
}

function FloorTomSVG({ color, accent, size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="floor-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Legs */}
      <line x1="22" y1="75" x2="18" y2="97" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="78" y1="75" x2="82" y2="97" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="78" x2="50" y2="97" stroke="#888" strokeWidth="2.5" strokeLinecap="round" />
      {/* Shell */}
      <ellipse cx="50" cy="72" rx="35" ry="10" fill={color} opacity="0.5" />
      <rect x="15" y="35" width="70" height="37" rx="2" fill="url(#floor-g)" />
      <ellipse cx="50" cy="35" rx="35" ry="10" fill={accent} opacity="0.6" />
      {/* Head detail */}
      <ellipse cx="50" cy="35" rx="30" ry="8" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.3" />
      <ellipse cx="50" cy="35" rx="22" ry="6" stroke="#fff" strokeWidth="0.3" fill="none" opacity="0.2" />
      {/* Lugs */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 35;
        const y = 54 + Math.sin(rad) * 7;
        return <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.5" />;
      })}
    </svg>
  );
}

function HiHatSVG({ color, accent, size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hh-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Stand */}
      <line x1="50" y1="42" x2="50" y2="95" stroke="#888" strokeWidth="2.5" />
      {/* Base tripod */}
      <line x1="50" y1="95" x2="35" y2="98" stroke="#888" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="95" x2="65" y2="98" stroke="#888" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="95" x2="50" y2="99" stroke="#888" strokeWidth="2" strokeLinecap="round" />
      {/* Clutch */}
      <rect x="47" y="38" width="6" height="6" rx="1" fill="#888" />
      {/* Top cymbal */}
      <ellipse cx="50" cy="38" rx="30" ry="6" fill="url(#hh-g)" />
      <ellipse cx="50" cy="37" rx="28" ry="5" stroke={accent} strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Bell */}
      <ellipse cx="50" cy="37" rx="6" ry="2.5" fill={accent} opacity="0.7" />
      {/* Gap */}
      {/* Bottom cymbal */}
      <ellipse cx="50" cy="44" rx="30" ry="6" fill="url(#hh-g)" opacity="0.8" />
      <ellipse cx="50" cy="45" rx="28" ry="5" stroke={accent} strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Edge lines for metallic look */}
      {[15, 20, 25, 30].map((r) => (
        <ellipse key={r} cx="50" cy="38" rx={r} ry={r * 0.2} stroke="#fff" strokeWidth="0.3" fill="none" opacity="0.1" />
      ))}
      {/* Pedal */}
      <rect x="42" y="92" width="16" height="3" rx="1" fill="#888" opacity="0.6" />
      <line x1="50" y1="92" x2="50" y2="85" stroke="#888" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

const DrumSVGs = {
  snare: SnareSVG,
  bass: BassDrumSVG,
  "rack-tom": RackTomSVG,
  "floor-tom": FloorTomSVG,
  "hi-hat": HiHatSVG,
};

// ─── PITCH DETECTION HELPERS ──────────────────────────────────
function autoCorrelate(buf, sampleRate) {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = size - 1;
  const thresh = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < thresh) { r1 = i; break; }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < thresh) { r2 = size - i; break; }
  }
  buf = buf.slice(r1, r2);
  size = buf.length;
  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxVal = -1, maxPos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
  }
  let t0 = maxPos;
  const x1 = c[t0 - 1], x2 = c[t0], x3 = c[t0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) t0 = t0 - b / (2 * a);
  return sampleRate / t0;
}

// ─── THEMES ───────────────────────────────────────────────────
const themes = {
  default: {
    bg: "#0a0a10",
    surface: "#121218",
    surfaceAlt: "#1a1a24",
    surfaceHover: "#222230",
    text: "#ededf0",
    textMuted: "#7a7a90",
    border: "#28283a",
    danger: "#ef4444",
    success: "#22c55e",
    warning: "#eab308",
  },
  highContrast: {
    bg: "#000000",
    surface: "#111111",
    surfaceAlt: "#222222",
    surfaceHover: "#333333",
    text: "#ffffff",
    textMuted: "#cccccc",
    border: "#ffffff",
    danger: "#ff4444",
    success: "#44ff44",
    warning: "#ffff44",
  },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function DrumCraft() {
  const [selectedDrum, setSelectedDrum] = useState(DRUMS[0]);
  const [selectedSize, setSelectedSize] = useState(DRUMS[0].defaultSize);
  const [activeHead, setActiveHead] = useState("batter");
  const [lugReadings, setLugReadings] = useState({});
  const [activeLug, setActiveLug] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [currentFreq, setCurrentFreq] = useState(null);
  const [volume, setVolume] = useState(0);
  const [targetFreq, setTargetFreq] = useState(null);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [history, setHistory] = useState([]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const theme = highContrast ? themes.highContrast : themes.default;
  const textScale = largeText ? 1.25 : 1;
  const transition = reducedMotion ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  // Initialize lug readings when drum or head changes
  useEffect(() => {
    const key = `${selectedDrum.id}-${activeHead}`;
    if (!lugReadings[key]) {
      const initial = {};
      for (let i = 0; i < selectedDrum.lugs; i++) {
        initial[i] = null;
      }
      setLugReadings((prev) => ({ ...prev, [key]: initial }));
    }
  }, [selectedDrum, activeHead, lugReadings]);

  const currentKey = `${selectedDrum.id}-${activeHead}`;
  const currentLugReadings = lugReadings[currentKey] || {};

  // Calculate tuning range
  const range = activeHead === "batter" ? selectedDrum.topRange : selectedDrum.bottomRange;
  const midFreq = (range[0] + range[1]) / 2;

  useEffect(() => {
    setTargetFreq(midFreq);
  }, [midFreq]);

  // Start / stop listening
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);

      const detect = () => {
        const buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);
        let rms = 0;
        for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / buf.length);
        setVolume(Math.min(rms * 5, 1));

        const freq = autoCorrelate(buf, audioContext.sampleRate);
        if (freq > 30 && freq < 1000) {
          setCurrentFreq(Math.round(freq * 10) / 10);
        }
        animFrameRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setCurrentFreq(null);
    setVolume(0);
  }, []);

  useEffect(() => () => stopListening(), [stopListening]);

  // Record a lug reading
  const recordLug = useCallback(() => {
    if (activeLug !== null && currentFreq) {
      setLugReadings((prev) => ({
        ...prev,
        [currentKey]: {
          ...prev[currentKey],
          [activeLug]: currentFreq,
        },
      }));
      setHistory((prev) => [
        { lug: activeLug + 1, freq: currentFreq, drum: selectedDrum.name, head: activeHead, time: new Date() },
        ...prev.slice(0, 19),
      ]);
      // Haptic feedback
      if (navigator.vibrate) {
        const diff = Math.abs(currentFreq - (targetFreq || midFreq));
        if (diff < 3) navigator.vibrate(50);
        else if (diff < 10) navigator.vibrate([30, 20, 30]);
        else navigator.vibrate([20, 10, 20, 10, 20]);
      }
      // Move to next lug
      setActiveLug((prev) => (prev + 1) % selectedDrum.lugs);
    }
  }, [activeLug, currentFreq, currentKey, selectedDrum, activeHead, targetFreq, midFreq]);

  // Clear all readings for current drum/head
  const clearReadings = () => {
    const initial = {};
    for (let i = 0; i < selectedDrum.lugs; i++) initial[i] = null;
    setLugReadings((prev) => ({ ...prev, [currentKey]: initial }));
    setActiveLug(null);
  };

  // Stats
  const readings = Object.values(currentLugReadings).filter((v) => v !== null);
  const avgFreq = readings.length > 0 ? readings.reduce((a, b) => a + b, 0) / readings.length : 0;
  const maxDiff = readings.length > 1 ? Math.max(...readings) - Math.min(...readings) : 0;
  const isEven = maxDiff < 5;

  const getDeviationColor = (freq) => {
    if (!freq || !targetFreq) return theme.textMuted;
    const diff = Math.abs(freq - targetFreq);
    if (diff < 3) return theme.success;
    if (diff < 8) return theme.warning;
    return theme.danger;
  };

  const getDeviationLabel = (freq) => {
    if (!freq || !targetFreq) return "";
    const diff = freq - targetFreq;
    if (Math.abs(diff) < 3) return "ON TARGET";
    return diff > 0 ? `+${diff.toFixed(1)} Hz HIGH` : `${diff.toFixed(1)} Hz LOW`;
  };

  const DrumIcon = DrumSVGs[selectedDrum.id];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'IBM Plex Mono', 'Fira Code', 'SF Mono', monospace",
        fontSize: `${14 * textScale}px`,
        transition,
        overflow: "auto",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.border}`,
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${selectedDrum.color}, ${selectedDrum.accent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              transition,
            }}
            aria-hidden="true"
          >
            🥁
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: `${18 * textScale}px`, fontWeight: 700, letterSpacing: "-0.02em" }}>
              DrumCraft
            </h1>
            <p style={{ margin: 0, fontSize: `${11 * textScale}px`, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Open Source Drum Tuner
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setShowTips(!showTips)}
            aria-label="Tuning tips"
            style={{
              width: 38, height: 38, borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              background: showTips ? selectedDrum.color + "22" : theme.surfaceAlt,
              color: showTips ? selectedDrum.color : theme.text,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: `${16 * textScale}px`, transition, fontFamily: "inherit",
            }}
          >
            💡
          </button>
          <button
            onClick={() => setShowAccessibility(!showAccessibility)}
            aria-label="Accessibility settings"
            aria-expanded={showAccessibility}
            style={{
              width: 38, height: 38, borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              background: showAccessibility ? selectedDrum.color + "22" : theme.surfaceAlt,
              color: showAccessibility ? selectedDrum.color : theme.text,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: `${16 * textScale}px`, transition, fontFamily: "inherit",
            }}
          >
            ♿
          </button>
        </div>
      </header>

      {/* ── TIPS PANEL ─────────────────────────────────────── */}
      {showTips && (
        <div
          role="region"
          aria-label="Tuning tips"
          style={{
            padding: "14px 20px",
            background: selectedDrum.color + "12",
            borderBottom: `1px solid ${theme.border}`,
            fontSize: `${13 * textScale}px`,
            color: selectedDrum.accent,
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span aria-hidden="true">💡</span>
          <span>{selectedDrum.tips}</span>
        </div>
      )}

      {/* ── ACCESSIBILITY PANEL ────────────────────────────── */}
      {showAccessibility && (
        <div
          role="region"
          aria-label="Accessibility settings"
          style={{
            padding: "14px 20px",
            background: theme.surfaceAlt,
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Accessibility
          </span>
          {[
            { label: "High Contrast", state: highContrast, setter: setHighContrast },
            { label: "Reduced Motion", state: reducedMotion, setter: setReducedMotion },
            { label: "Large Text", state: largeText, setter: setLargeText },
          ].map(({ label, state, setter }) => (
            <button
              key={label}
              onClick={() => setter(!state)}
              role="switch"
              aria-checked={state}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "7px 12px", borderRadius: "8px",
                border: `1px solid ${state ? selectedDrum.color : theme.border}`,
                background: state ? selectedDrum.color + "22" : "transparent",
                color: state ? selectedDrum.color : theme.text,
                cursor: "pointer", fontSize: `${12 * textScale}px`, fontFamily: "inherit", transition,
              }}
            >
              <span style={{
                width: 13, height: 13, borderRadius: 3,
                border: `2px solid ${state ? selectedDrum.color : theme.textMuted}`,
                background: state ? selectedDrum.color : "transparent",
                display: "inline-flex", alignItems: "center", justifyContent: "center", transition,
              }}>
                {state && <span style={{ color: "#fff", fontSize: "9px", lineHeight: 1 }}>✓</span>}
              </span>
              {label}
            </button>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
        {/* ── DRUM SELECTOR ──────────────────────────────────── */}
        <section aria-label="Drum selection">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(95px, 1fr))", gap: "8px", marginBottom: "20px" }}>
            {DRUMS.map((drum) => {
              const isActive = selectedDrum.id === drum.id;
              const SVG = DrumSVGs[drum.id];
              return (
                <button
                  key={drum.id}
                  onClick={() => { setSelectedDrum(drum); setSelectedSize(drum.defaultSize); setActiveLug(null); }}
                  aria-pressed={isActive}
                  aria-label={`${drum.name}: ${drum.description}`}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    padding: "12px 6px", borderRadius: "12px",
                    border: `2px solid ${isActive ? drum.color : theme.border}`,
                    background: isActive ? drum.color + "12" : theme.surface,
                    color: isActive ? drum.color : theme.text,
                    cursor: "pointer", fontFamily: "inherit", transition,
                    position: "relative",
                  }}
                >
                  {isActive && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: drum.color, borderRadius: "2px 2px 0 0" }} />
                  )}
                  <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SVG color={isActive ? drum.color : theme.textMuted} accent={isActive ? drum.accent : theme.textMuted} size={44} />
                  </div>
                  <span style={{ fontSize: `${11 * textScale}px`, fontWeight: isActive ? 700 : 500 }}>{drum.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── DRUM DETAIL + CONTROLS ─────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          {/* Left: Drum info */}
          <section
            style={{
              background: theme.surface, borderRadius: "16px",
              border: `1px solid ${theme.border}`, padding: "20px",
              display: "flex", flexDirection: "column", gap: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{
                background: selectedDrum.color + "10", borderRadius: "12px",
                padding: "8px", border: `1px solid ${selectedDrum.color}22`,
              }}>
                <DrumIcon color={selectedDrum.color} accent={selectedDrum.accent} size={72} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: `${20 * textScale}px`, fontWeight: 800, color: selectedDrum.color }}>{selectedDrum.name}</h2>
                <p style={{ margin: "2px 0 0", color: theme.textMuted, fontSize: `${12 * textScale}px` }}>{selectedDrum.description}</p>
              </div>
            </div>

            {/* Size selector */}
            <div>
              <label style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
                Drum Size
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {selectedDrum.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "6px 14px", borderRadius: "8px",
                      border: `1px solid ${selectedSize === s ? selectedDrum.color : theme.border}`,
                      background: selectedSize === s ? selectedDrum.color + "20" : "transparent",
                      color: selectedSize === s ? selectedDrum.color : theme.text,
                      cursor: "pointer", fontFamily: "inherit", fontSize: `${13 * textScale}px`, fontWeight: 600, transition,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Head selector */}
            <div>
              <label style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
                Drum Head
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {["batter", "resonant"].map((head) => (
                  <button
                    key={head}
                    onClick={() => { setActiveHead(head); setActiveLug(null); }}
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      border: `1px solid ${activeHead === head ? selectedDrum.color : theme.border}`,
                      background: activeHead === head ? selectedDrum.color + "20" : "transparent",
                      color: activeHead === head ? selectedDrum.color : theme.text,
                      cursor: "pointer", fontFamily: "inherit", fontSize: `${13 * textScale}px`,
                      fontWeight: 600, textTransform: "capitalize", transition,
                    }}
                  >
                    {head} Head
                  </button>
                ))}
              </div>
            </div>

            {/* Target frequency */}
            <div>
              <label style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
                Target Frequency: {targetFreq} Hz
              </label>
              <input
                type="range"
                min={range[0]}
                max={range[1]}
                value={targetFreq || midFreq}
                onChange={(e) => setTargetFreq(Number(e.target.value))}
                aria-label="Target frequency"
                style={{ width: "100%", accentColor: selectedDrum.color }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: `${10 * textScale}px`, color: theme.textMuted }}>
                <span>{range[0]} Hz</span>
                <span>{range[1]} Hz</span>
              </div>
            </div>
          </section>

          {/* Right: Drum head visual */}
          <section
            aria-label="Drum head lug diagram"
            style={{
              background: theme.surface, borderRadius: "16px",
              border: `1px solid ${theme.border}`, padding: "20px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}
          >
            <svg
              width="260"
              height="260"
              viewBox="0 0 260 260"
              style={{ maxWidth: "100%" }}
              role="img"
              aria-label={`${selectedDrum.name} drum head with ${selectedDrum.lugs} lug positions`}
            >
              {/* Outer rim */}
              <circle cx="130" cy="130" r="120" stroke={theme.border} strokeWidth="3" fill="none" />
              {/* Head */}
              <circle cx="130" cy="130" r="115" fill={selectedDrum.color + "08"} stroke={selectedDrum.color + "30"} strokeWidth="1" />
              {/* Inner rings */}
              <circle cx="130" cy="130" r="85" stroke={theme.border} strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="130" cy="130" r="50" stroke={theme.border} strokeWidth="0.5" fill="none" opacity="0.2" />
              {/* Center dot */}
              <circle cx="130" cy="130" r="6" fill={selectedDrum.color + "30"} />

              {/* Lug positions */}
              {Array.from({ length: selectedDrum.lugs }).map((_, i) => {
                const angle = (i * 360) / selectedDrum.lugs - 90;
                const rad = (angle * Math.PI) / 180;
                const x = 130 + Math.cos(rad) * 105;
                const y = 130 + Math.sin(rad) * 105;
                const reading = currentLugReadings[i];
                const isActive = activeLug === i;
                const color = reading ? getDeviationColor(reading) : theme.textMuted;

                return (
                  <g key={i}>
                    {/* Connection line to center */}
                    <line x1="130" y1="130" x2={x} y2={y} stroke={theme.border} strokeWidth="0.5" opacity="0.2" />
                    {/* Lug circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 22 : 18}
                      fill={isActive ? selectedDrum.color + "30" : theme.surfaceAlt}
                      stroke={isActive ? selectedDrum.color : color}
                      strokeWidth={isActive ? 3 : 2}
                      style={{ cursor: "pointer", transition: reducedMotion ? "none" : "all 0.2s" }}
                      onClick={() => setActiveLug(i)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Lug ${i + 1}${reading ? `: ${reading} Hz` : ": no reading"}`}
                    />
                    {/* Lug number */}
                    <text
                      x={x}
                      y={reading ? y - 4 : y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isActive ? selectedDrum.color : theme.text}
                      fontSize={isActive ? "12" : "11"}
                      fontWeight="700"
                      fontFamily="inherit"
                      style={{ pointerEvents: "none" }}
                    >
                      {i + 1}
                    </text>
                    {/* Frequency reading */}
                    {reading && (
                      <text
                        x={x}
                        y={y + 9}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={color}
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="inherit"
                        style={{ pointerEvents: "none" }}
                      >
                        {reading}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Evenness indicator in center */}
              {readings.length > 1 && (
                <>
                  <text x="130" y="122" textAnchor="middle" fill={isEven ? theme.success : theme.warning} fontSize="10" fontWeight="700" fontFamily="inherit">
                    {isEven ? "EVEN" : "UNEVEN"}
                  </text>
                  <text x="130" y="138" textAnchor="middle" fill={theme.textMuted} fontSize="9" fontFamily="inherit">
                    Δ {maxDiff.toFixed(1)} Hz
                  </text>
                </>
              )}
            </svg>
          </section>
        </div>

        {/* ── TUNER DISPLAY ──────────────────────────────────── */}
        <section
          aria-label="Tuner"
          aria-live="polite"
          style={{
            background: theme.surface, borderRadius: "16px",
            border: `1px solid ${theme.border}`, padding: "24px",
            textAlign: "center", marginBottom: "16px",
          }}
        >
          {/* Deviation bar */}
          <div
            style={{
              position: "relative", height: 10, borderRadius: 5,
              background: theme.surfaceAlt, overflow: "hidden", marginBottom: "20px",
              border: `1px solid ${theme.border}`,
            }}
            role="meter"
            aria-label={currentFreq && targetFreq ? `Deviation: ${(currentFreq - targetFreq).toFixed(1)} Hz` : "Waiting for input"}
            aria-valuemin={-30}
            aria-valuemax={30}
            aria-valuenow={currentFreq && targetFreq ? currentFreq - targetFreq : 0}
          >
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: theme.success, transform: "translateX(-50%)", zIndex: 2 }} />
            <div style={{ position: "absolute", left: "45%", width: "10%", top: 0, bottom: 0, background: theme.success + "20", zIndex: 1 }} />
            {currentFreq && targetFreq && (
              <div
                style={{
                  position: "absolute",
                  left: `${Math.max(5, Math.min(95, 50 + (currentFreq - targetFreq) * 2))}%`,
                  top: -1, bottom: -1, width: 8, borderRadius: 4,
                  background: getDeviationColor(currentFreq),
                  transform: "translateX(-50%)", zIndex: 3,
                  boxShadow: `0 0 10px ${getDeviationColor(currentFreq)}66`,
                  transition: reducedMotion ? "none" : "left 0.1s ease",
                }}
              />
            )}
          </div>

          {/* Frequency display */}
          <div style={{ marginBottom: "6px" }}>
            <span style={{
              fontSize: `${56 * textScale}px`, fontWeight: 900,
              color: currentFreq ? getDeviationColor(currentFreq) : theme.textMuted + "33",
              letterSpacing: "-0.04em", lineHeight: 1, transition,
            }}>
              {currentFreq || "—"}
            </span>
            <span style={{ fontSize: `${20 * textScale}px`, color: theme.textMuted, fontWeight: 600, marginLeft: "4px" }}>
              {currentFreq ? "Hz" : ""}
            </span>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "4px" }}>
            <span style={{
              fontSize: `${13 * textScale}px`, fontWeight: 700,
              color: currentFreq ? getDeviationColor(currentFreq) : "transparent",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {currentFreq ? getDeviationLabel(currentFreq) : "."}
            </span>
          </div>
          <div style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted, marginBottom: "4px" }}>
            {activeLug !== null ? `Recording → Lug ${activeLug + 1}` : "Select a lug on the drum head, then tap near it"}
          </div>
          <div style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted + "88" }}>
            Target: {targetFreq} Hz
          </div>

          {/* Volume indicator */}
          {isListening && (
            <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginTop: "16px", alignItems: "flex-end", height: 18 }} aria-label={`Volume: ${Math.round(volume * 100)}%`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: `${Math.max(3, (i < volume * 12 ? (i + 1) / 12 : 0.12) * 18)}px`,
                    borderRadius: 2,
                    background: i < volume * 12 ? selectedDrum.color : theme.surfaceAlt,
                    transition: reducedMotion ? "none" : "height 0.1s, background 0.1s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? "Stop tuner" : "Start tuner"}
              style={{
                padding: "12px 32px", borderRadius: "12px", border: "none",
                background: isListening ? theme.danger : `linear-gradient(135deg, ${selectedDrum.color}, ${selectedDrum.accent})`,
                color: "#fff", fontSize: `${15 * textScale}px`, fontWeight: 700, fontFamily: "inherit",
                cursor: "pointer", letterSpacing: "0.04em",
                boxShadow: isListening ? `0 4px 20px ${theme.danger}44` : `0 4px 20px ${selectedDrum.color}44`,
                transition,
              }}
            >
              {isListening ? "■  STOP" : "●  START"}
            </button>

            {isListening && activeLug !== null && (
              <button
                onClick={recordLug}
                style={{
                  padding: "12px 24px", borderRadius: "12px",
                  border: `2px solid ${selectedDrum.color}`,
                  background: selectedDrum.color + "15",
                  color: selectedDrum.color,
                  fontSize: `${15 * textScale}px`, fontWeight: 700, fontFamily: "inherit",
                  cursor: "pointer", letterSpacing: "0.04em", transition,
                }}
              >
                ✓ RECORD LUG {activeLug + 1}
              </button>
            )}

            {readings.length > 0 && (
              <button
                onClick={clearReadings}
                style={{
                  padding: "12px 20px", borderRadius: "12px",
                  border: `1px solid ${theme.border}`,
                  background: "transparent", color: theme.textMuted,
                  fontSize: `${13 * textScale}px`, fontWeight: 600, fontFamily: "inherit",
                  cursor: "pointer", transition,
                }}
              >
                CLEAR
              </button>
            )}
          </div>
        </section>

        {/* ── STATS ──────────────────────────────────────────── */}
        {readings.length > 0 && (
          <section
            aria-label="Tuning statistics"
            style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "10px", marginBottom: "16px",
            }}
          >
            {[
              { label: "Average", value: `${avgFreq.toFixed(1)} Hz`, color: selectedDrum.color },
              { label: "Max Spread", value: `${maxDiff.toFixed(1)} Hz`, color: isEven ? theme.success : theme.warning },
              { label: "Lugs Recorded", value: `${readings.length} / ${selectedDrum.lugs}`, color: readings.length === selectedDrum.lugs ? theme.success : theme.textMuted },
              { label: "Evenness", value: isEven ? "GOOD" : "ADJUST", color: isEven ? theme.success : theme.warning },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  background: theme.surface, borderRadius: "12px",
                  border: `1px solid ${theme.border}`, padding: "14px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: `${10 * textScale}px`, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                  {label}
                </div>
                <div style={{ fontSize: `${18 * textScale}px`, fontWeight: 800, color }}>
                  {value}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── HOW TO USE ─────────────────────────────────────── */}
        <section
          aria-label="How to use"
          style={{
            background: theme.surface, borderRadius: "14px",
            border: `1px solid ${theme.border}`, padding: "18px 20px",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontSize: `${12 * textScale}px`, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            How to Tune
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
            {[
              { icon: "🥁", text: "Select your drum type and size" },
              { icon: "🎯", text: "Set your target frequency with the slider" },
              { icon: "1️⃣", text: "Tap a lug on the diagram to select it" },
              { icon: "🔊", text: "Hit Start, then tap near that lug on your drum" },
              { icon: "✓", text: "Press Record to save the reading" },
              { icon: "🔄", text: "Work around the head using opposite lugs (star pattern)" },
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "8px", borderRadius: "8px", background: theme.surfaceAlt }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }} aria-hidden="true">{tip.icon}</span>
                <span style={{ fontSize: `${11 * textScale}px`, color: theme.textMuted, lineHeight: 1.5 }}>{tip.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── RECENT HISTORY ─────────────────────────────────── */}
        {history.length > 0 && (
          <section
            aria-label="Recent readings"
            style={{
              background: theme.surface, borderRadius: "14px",
              border: `1px solid ${theme.border}`, padding: "18px 20px",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontSize: `${12 * textScale}px`, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Recent Readings
            </h3>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {history.slice(0, 12).map((entry, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 10px", borderRadius: "8px", background: theme.surfaceAlt,
                    fontSize: `${11 * textScale}px`, color: theme.textMuted,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <span style={{ color: selectedDrum.color, fontWeight: 700 }}>L{entry.lug}</span>
                  {" "}
                  <span style={{ color: theme.text }}>{entry.freq} Hz</span>
                  {" "}
                  <span style={{ opacity: 0.5 }}>{entry.head}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer style={{ textAlign: "center", padding: "16px 0 32px", color: theme.textMuted, fontSize: `${11 * textScale}px`, letterSpacing: "0.06em" }}>
          <p style={{ margin: 0 }}>DrumCraft — Open Source Drum Tuner · MIT License</p>
          <p style={{ margin: "4px 0 0", opacity: 0.6 }}>Built with accessibility in mind · Keyboard navigable · Screen reader compatible · Haptic feedback</p>
        </footer>
      </div>
    </div>
  );
}
