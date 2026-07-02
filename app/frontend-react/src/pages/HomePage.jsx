import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, Cpu, Microscope, ShieldCheck, X, Activity, Eye, Sliders, Sparkles, Camera } from "lucide-react";
import { usePrediction } from "../context/PredictionContext";

function HomePage() {
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const navigate = useNavigate();
  const { setSelectedModel } = usePrediction();

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleModelSelect = (modelType) => {
    setSelectedModel(modelType);
    setShowModelPicker(false);
    navigate("/detect", { state: { model: modelType } });
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Dynamic heartbeat path simulation
  const pulsePath = `M 0,25 Q 10,25 20,25 T 30,25 Q 35,5 40,45 T 45,25 Q 55,25 65,25 T 75,25 L 120,25`;

  return (
    <section className="fade-in mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12 relative z-10">
      <div className="grid items-stretch gap-8 md:grid-cols-12">
        {/* Left Column: Hero Text */}
        <div className="md:col-span-5 flex flex-col justify-center glass-panel rounded-3xl p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-teal-500/10 blur-[80px]" />
          
          <div className="relative z-10">
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-teal-950/40 border border-teal-850 px-3 py-1 text-xs font-semibold tracking-wide text-teal-400">
              <Microscope className="h-3.5 w-3.5" />
              HUD Diagnostic Suite
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4.5xl leading-tight">
              AI Skin Cancer <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Detection
              </span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              A high-precision neural screening workspace for melanoma awareness. Leverages hybrid `cnn+xgboost model` and `vit+xgboost model` pipelines for morphological skin analysis.
            </p>
            
            <button
              type="button"
              onClick={() => setShowModelPicker(true)}
              className="mt-8 group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5"
            >
              Start Detection
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Holographic HUD Preview */}
        <div className="md:col-span-7 glass-panel rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Neon background light grids */}
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-purple-500/5 blur-[80px]" />
          
          {/* HUD Top Bar */}
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">TELEMETRY: ACTIVE</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-teal-400 bg-teal-950/20 border border-teal-900/40 px-2.5 py-0.5 rounded shadow-[0_0_8px_rgba(45,212,191,0.1)]">
              SYS.CALIBRATION: {formattedDate}
            </span>
          </div>

          {/* Grid Layout of Vitals and 3D Scanner */}
          <div className="grid gap-4 md:grid-cols-12 items-stretch">
            {/* Lesion Scan Telemetry Sidebar */}
            <div className="md:col-span-4 flex flex-col gap-3">
              {/* Scan Info Item 1: Optical Quality */}
              <div className="rounded-xl border border-white/5 bg-[#0a0c16]/60 p-3 flex flex-col justify-between h-24 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[9px] font-bold tracking-wider uppercase">Optical Quality</span>
                  <Camera className="h-3.5 w-3.5 text-teal-400" />
                </div>
                <div className="mt-1 flex flex-col">
                  <span className="text-lg font-black text-white leading-tight">SHARP</span>
                  <span className="text-[9px] text-slate-500">Focus: Sharp | Exposure: OK</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[8px] font-semibold text-teal-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Clarity Index: 99.4%
                </div>
              </div>

              {/* Scan Info Item 2: Dermoscopy Setup */}
              <div className="rounded-xl border border-white/5 bg-[#0a0c16]/60 p-3 flex flex-col justify-between h-24">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[9px] font-bold tracking-wider uppercase">Dermoscopy Lens</span>
                  <Sliders className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <div className="mt-1 flex flex-col">
                  <span className="text-lg font-black text-white leading-tight">POLARIZED</span>
                  <span className="text-[9px] text-slate-500">Lens: DermLite IV | Zoom: 10x</span>
                </div>
                <div className="w-full bg-[#070912] border border-white/5 rounded-full h-1 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full w-[80%]" />
                </div>
              </div>

              {/* Scan Info Item 3: Dermal AI Focus */}
              <div className="rounded-xl border border-white/5 bg-[#0a0c16]/60 p-3 flex flex-col justify-between h-24">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[9px] font-bold tracking-wider uppercase">Dermal AI Focus</span>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                </div>
                <div className="mt-1 flex flex-col">
                  <span className="text-lg font-black text-white leading-tight">HEATMAP</span>
                  <span className="text-[9px] text-slate-500">Active attention networks ready</span>
                </div>
                <div className="flex gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/30" />
                </div>
              </div>
            </div>

            {/* Central 3D Scanning HUD */}
            <div className="md:col-span-8 relative rounded-xl border border-white/5 bg-[#070912] hud-grid flex items-center justify-center p-4 min-h-[220px]">
              {/* HUD corner brackets */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-teal-500/40" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-teal-500/40" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-teal-500/40" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-teal-500/40" />

              {/* Concentric scan rings */}
              <div className="relative h-44 w-44 rounded-full border border-teal-500/15 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full border border-dashed border-teal-500/10 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full border border-teal-500/5 flex items-center justify-center" />
                </div>

                {/* Sweep scan gradient */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 origin-center animate-radar-sweep" style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.15) 0deg, rgba(6, 182, 212, 0) 100deg)',
                    borderRadius: '50%'
                  }} />
                </div>

                {/* Crosshairs */}
                <div className="absolute h-full w-[1px] bg-teal-500/10" />
                <div className="absolute w-full h-[1px] bg-teal-500/10" />

                {/* 3D Wireframe Hand Mesh drawing */}
                <svg className="absolute w-24 h-24 text-teal-400/20 fill-none" viewBox="0 0 120 120" stroke="currentColor" strokeWidth="1">
                  {/* Outer wrist contours */}
                  <path d="M 40,110 C 42,95 38,80 43,65 C 47,55 49,45 42,32 C 41,30 43,28 45,30 C 50,38 52,48 54,60" />
                  <path d="M 53,60 C 55,50 56,38 60,25 C 61,23 63,23 64,25 C 66,38 65,50 64,62" />
                  <path d="M 64,62 C 67,52 70,40 76,28 C 77,26 79,27 79,29 C 79,42 77,54 73,66" />
                  <path d="M 73,66 C 77,58 82,49 89,41 C 90,39 92,41 91,43 C 87,55 81,66 75,76" />
                  <path d="M 75,76 C 82,74 90,70 98,67 C 100,66 101,68 99,70 C 92,78 84,83 76,87" />
                  {/* Wrist base */}
                  <path d="M 40,110 C 55,115 65,115 80,105 C 80,105 78,95 76,87" />
                  {/* Cross-mesh curves */}
                  <path d="M 41,90 C 53,95 68,92 78,85" strokeDasharray="2 2" />
                  <path d="M 44,75 C 55,80 68,76 74,71" strokeDasharray="3 2" />
                  {/* Telemetry points */}
                  <circle cx="53" cy="60" r="2" className="fill-cyan-400 stroke-none animate-ping" />
                  <circle cx="73" cy="66" r="2" className="fill-purple-400 stroke-none" />
                </svg>

                {/* Target overlay */}
                <div className="absolute top-1/3 left-1/3 w-4 h-4 border border-rose-500/50 rounded-full animate-ping pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 text-[7px] font-bold text-rose-500 bg-rose-950/50 border border-rose-900/60 px-1 py-0.2 rounded mt-4">
                  LESION_FLAG
                </div>
              </div>

              {/* Technical Telemetry readings */}
              <div className="absolute bottom-2 left-3 text-[7px] font-semibold text-slate-500 tracking-wider space-y-0.5 uppercase">
                <div>SENSOR_FEED: OPTICAL_CMOS</div>
                <div>BANDWIDTH: 1.2 GB/S</div>
              </div>
              <div className="absolute bottom-2 right-3 text-[7px] font-semibold text-slate-500 tracking-wider text-right space-y-0.5 uppercase">
                <div>FREQ: 2.4 GHZ</div>
                <div>GRID_RESOL: 0.12 MM</div>
              </div>
            </div>
          </div>

          {/* HUD Footer Details */}
          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/5 pt-3.5 text-xs text-slate-400 gap-2">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              HIPAA & GDPR Secure Encryption
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WORKSPACE_ID: Derma-AI_1.0.0</span>
          </div>
        </div>
      </div>

      {/* Model Picker Modal */}
      {showModelPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0c0d16]/95 p-6 shadow-2xl shadow-black/80 transition-all duration-300">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3.5">
              <div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">Select Diagnostic Pipeline</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Select the ML pipeline configuration for lesion classification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModelPicker(false)}
                className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:bg-slate-800/80 hover:text-white"
                aria-label="Close model selection modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Option 1: CNN */}
              <button
                type="button"
                onClick={() => handleModelSelect("cnn")}
                className="group relative rounded-xl border border-white/5 bg-[#0f121d]/40 p-5 text-left transition duration-300 hover:border-teal-500/35 hover:bg-teal-950/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]"
              >
                <div className="mb-3.5 inline-flex items-center justify-center rounded-lg bg-teal-950/60 border border-teal-850 p-2.5 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                  <Cpu className="h-5 w-5" />
                </div>
                <p className="font-extrabold text-white text-base tracking-tight">CNN+XGBOOST MODEL</p>
                <span className="mt-1 inline-block rounded-full bg-slate-900 border border-white/5 px-2.5 py-0.5 text-[9px] font-bold text-slate-400 group-hover:bg-teal-900/40 group-hover:text-teal-300">
                  Recommended for general screening
                </span>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  Combines Deep Convolutional Features with a gradient-boosted decision tree layer for high-speed skin lesion classifications.
                </p>
              </button>

              {/* Option 2: ViT */}
              <button
                type="button"
                onClick={() => handleModelSelect("vit")}
                className="group relative rounded-xl border border-white/5 bg-[#0f121d]/40 p-5 text-left transition duration-300 hover:border-purple-500/35 hover:bg-purple-950/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
              >
                <div className="mb-3.5 inline-flex items-center justify-center rounded-lg bg-purple-950/60 border border-purple-850 p-2.5 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <p className="font-extrabold text-white text-base tracking-tight">VIT+XGBOOST MODEL</p>
                <span className="mt-1 inline-block rounded-full bg-slate-900 border border-white/5 px-2.5 py-0.5 text-[9px] font-bold text-slate-400 group-hover:bg-purple-900/40 group-hover:text-purple-300">
                  Advanced morphological analysis
                </span>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  Applies visual transformer attention layers to extract patch dependencies across the lesion surface. Optimized for complex textures.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HomePage;
