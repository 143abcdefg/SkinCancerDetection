import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, Cpu, Microscope, ShieldCheck, X, Activity, Sliders, Sparkles } from "lucide-react";
import { usePrediction } from "../context/PredictionContext";

function HomePage() {
  const [showModelPicker, setShowModelPicker] = useState(false);
  const navigate = useNavigate();
  const { setSelectedModel } = usePrediction();

  const handleModelSelect = (modelType) => {
    setSelectedModel(modelType);
    setShowModelPicker(false);
    navigate("/detect", { state: { model: modelType } });
  };

  return (
    <section className="fade-in mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12 relative z-10">
      
      {/* Hero Section */}
      <div className="grid items-center gap-8 md:grid-cols-12 min-h-[480px]">
        {/* Left Column: Hero Text */}
        <div className="md:col-span-6 flex flex-col justify-center relative z-10">
          <p className="mb-4 self-start inline-flex items-center gap-1.5 rounded-full bg-teal-950/40 border border-teal-850 px-3 py-1 text-xs font-semibold tracking-wide text-teal-400">
            <Microscope className="h-3.5 w-3.5" />
            Advanced Screening Suite
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5.5xl leading-tight font-display">
            SKIN CANCER <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DETECTION
            </span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-slate-450 max-w-lg font-sans">
            A high-precision neural screening workspace for melanoma awareness. Leverages hybrid CNN+XGBoost and ViT+XGBoost pipelines for morphological skin analysis.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowModelPicker(true)}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5"
            >
              Start Detection
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0e101b]/40 px-6 py-3 text-sm font-semibold text-slate-350 transition hover:bg-slate-800 hover:text-white"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Column: Rotating 3D Neural Sphere */}
        <div className="md:col-span-6 flex items-center justify-center relative overflow-hidden p-4 min-h-[320px]">
          
          {/* Glowing background light rings */}
          <div className="absolute h-64 w-64 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
          <div className="absolute h-64 w-64 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

          {/* Interactive Sphere Canvas */}
          <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
            
            {/* Concentric scan rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/10 flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="absolute inset-4 rounded-full border border-dashed border-purple-500/10 flex items-center justify-center" />
            </div>

            {/* Neural Net SVG Sphere */}
            <svg className="w-full h-full text-cyan-400/80 animate-[spin_40s_linear_infinite]" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Glow background */}
              <circle cx="100" cy="100" r="80" fill="url(#sphereGlow)" />
              
              {/* Outer wireframe rings */}
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="3 3" fill="none" />
              
              {/* Rotating inner ellipses to give 3D spherical look */}
              <ellipse cx="100" cy="100" rx="70" ry="22" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" fill="none" className="animate-[pulse_3s_ease-in-out_infinite]" />
              <ellipse cx="100" cy="100" rx="22" ry="70" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" fill="none" className="animate-[pulse_3s_ease-in-out_infinite]" />
              <ellipse cx="100" cy="100" rx="70" ry="35" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" fill="none" transform="rotate(45 100 100)" />
              <ellipse cx="100" cy="100" rx="70" ry="35" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" fill="none" transform="rotate(-45 100 100)" />
              
              {/* Connected network nodes (particles) */}
              <g className="animate-[spin_15s_linear_infinite_reverse] origin-[100px_100px]">
                {/* Lines connecting nodes */}
                <line x1="50" y1="50" x2="150" y2="50" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <line x1="50" y1="50" x2="100" y2="150" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <line x1="150" y1="50" x2="100" y2="150" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                
                <line x1="100" y1="30" x2="50" y2="120" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <line x1="100" y1="30" x2="150" y2="120" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <line x1="50" y1="120" x2="150" y2="120" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                
                {/* Nodes */}
                <circle cx="50" cy="50" r="3" fill="#2dd4bf" className="shadow-[0_0_8px_#2dd4bf]" />
                <circle cx="150" cy="50" r="3" fill="#a855f7" />
                <circle cx="100" cy="150" r="3.5" fill="#06b6d4" />
                <circle cx="100" cy="30" r="3.5" fill="#2dd4bf" />
                <circle cx="50" cy="120" r="3" fill="#06b6d4" />
                <circle cx="150" cy="120" r="3" fill="#a855f7" />
              </g>
            </svg>

            {/* Scanning radar sweep element */}
            <div className="absolute inset-0 origin-center animate-[spin_10s_linear_infinite] pointer-events-none" style={{
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.08) 0deg, rgba(6, 182, 212, 0) 120deg)',
              borderRadius: '50%'
            }} />
          </div>
        </div>
      </div>

      {/* Feature grid cards (exactly matching the mockup) */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {/* Item 1 */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="h-10 w-10 rounded-full bg-teal-950/40 border border-teal-850 flex items-center justify-center text-teal-400 mb-4">
            <Sliders className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Early Detection</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
            Harnessing advanced artificial intelligence for early and accurate skin cancer anomaly detection.
          </p>
        </div>

        {/* Item 2 */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="h-10 w-10 rounded-full bg-cyan-950/40 border border-cyan-850 flex items-center justify-center text-cyan-400 mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">High Accuracy</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
            Improves the diagnostic confidence with ensemble voting across convolutional and transformer layers.
          </p>
        </div>

        {/* Item 3 */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="h-10 w-10 rounded-full bg-purple-950/40 border border-purple-850 flex items-center justify-center text-purple-400 mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">User-Friendly</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
            Easy, clear, and intuitive workspace designed to promote user confidence and medical anomaly detection.
          </p>
        </div>
      </div>

      {/* Model Picker Modal */}
      {showModelPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0c0d16]/95 p-6 shadow-2xl shadow-black/80 transition-all duration-300">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3.5">
              <div>
                <h2 className="text-lg font-extrabold text-white tracking-tight font-display">Select Diagnostic Pipeline</h2>
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
                <p className="font-extrabold text-white text-base tracking-tight font-display">CNN+XGBOOST MODEL</p>
                <span className="mt-1 inline-block rounded-full bg-slate-900 border border-white/5 px-2.5 py-0.5 text-[9px] font-bold text-slate-400 group-hover:bg-teal-900/40 group-hover:text-teal-300">
                  Recommended for general screening
                </span>
                <p className="mt-3 text-xs leading-relaxed text-slate-400 font-sans">
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
                <p className="font-extrabold text-white text-base tracking-tight font-display">VIT+XGBOOST MODEL</p>
                <span className="mt-1 inline-block rounded-full bg-slate-900 border border-white/5 px-2.5 py-0.5 text-[9px] font-bold text-slate-400 group-hover:bg-purple-900/40 group-hover:text-purple-300">
                  Advanced morphological analysis
                </span>
                <p className="mt-3 text-xs leading-relaxed text-slate-400 font-sans">
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
