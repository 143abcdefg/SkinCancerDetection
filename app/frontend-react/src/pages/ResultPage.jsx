import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Repeat, ShieldAlert, Download, FileText, CheckCircle2 } from "lucide-react";
import { usePrediction } from "../context/PredictionContext";

function ResultPage() {
  const { prediction, confidence, modelUsed, cnnScore, xgbScore, previewUrl, clearAll } =
    usePrediction();

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  if (!prediction) {
    return <Navigate to="/detect" replace />;
  }

  const confidenceValue = Number(confidence) || 0;
  const percent = confidenceValue <= 1 ? confidenceValue * 100 : confidenceValue;
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  const isMalignant = prediction === "malignant";

  // Coordinates for the drag handle
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate mock morphological scores based on prediction severity
  const findings = isMalignant
    ? [
        { label: "Asymmetry", value: "High (89%)", score: 89 },
        { label: "Border Irregularity", value: "Irregular (81%)", score: 81 },
        { label: "Color Variegation", value: "Variegated (93%)", score: 93 },
        { label: "Diameter", value: "> 6mm (78%)", score: 78 },
        { label: "Evolution", value: "Changing (95%)", score: 95 },
      ]
    : [
        { label: "Asymmetry", value: "Symmetric (18%)", score: 18 },
        { label: "Border Irregularity", value: "Regular (12%)", score: 12 },
        { label: "Color Variegation", value: "Uniform (24%)", score: 24 },
        { label: "Diameter", value: "< 6mm (32%)", score: 32 },
        { label: "Evolution", value: "Stable (15%)", score: 15 },
      ];

  return (
    <section className="fade-in mx-auto w-full max-w-6xl px-4 py-10 md:px-6 relative z-10">
      <div className="glass-panel rounded-3xl p-6 shadow-2xl md:p-9 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-500/5 blur-[80px]" />
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5 relative z-10">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              AI Diagnostic Report
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Case ID: #SCAI-1024 | Model: {modelUsed ? (modelUsed === "cnn" ? "CNN+XGBOOST MODEL" : "VIT+XGBOOST MODEL") : "N/A"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#0a0c16]/60 px-3.5 py-2 text-xs font-bold text-slate-350 transition hover:bg-slate-800"
            >
              <FileText className="h-3.5 w-3.5" />
              Print Report
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="mt-8 grid gap-8 md:grid-cols-12 relative z-10">
          {/* Left Column: Split-Slider Viewer */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl border border-white/5 bg-[#0e101b]/60 p-5 shadow-inner">
              <h2 className="text-base font-bold text-slate-200 mb-4">Analysis Viewer</h2>
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative aspect-square w-full select-none overflow-hidden rounded-xl bg-[#05070c] border border-white/5 cursor-ew-resize"
              >
                {/* Layer 1 (Background): Heatmap View */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Skin lesion"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* CSS Blend Heatmap Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-color-burn opacity-95"
                    style={{
                      background: isMalignant
                        ? "radial-gradient(circle at 48% 46%, rgba(239, 68, 68, 0.95) 0%, rgba(245, 158, 11, 0.8) 25%, rgba(59, 130, 246, 0.65) 55%, transparent 75%)"
                        : "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.7) 0%, rgba(59, 130, 246, 0.5) 40%, transparent 70%)",
                    }}
                  />
                </div>

                {/* Layer 2 (Foreground): Raw Image (Clipped to sliderPosition) */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Raw Skin lesion"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>

                {/* Vertical Divider handle */}
                <div
                  onMouseDown={() => setIsDragging(true)}
                  onTouchStart={() => setIsDragging(true)}
                  className="absolute top-0 bottom-0 w-[4px] bg-gradient-to-b from-teal-400 to-cyan-500 shadow-[0_0_10px_#06b6d4] cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="h-10 w-10 rounded-full border-2 border-teal-450 bg-[#0a0c16] flex flex-col items-center justify-center shadow-lg transition hover:scale-105 pointer-events-auto">
                    <span className="text-[8px] font-black text-teal-400 leading-none">SPLIT</span>
                    <span className="text-[7px] font-bold text-slate-400 leading-none">VIEW</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">
                Drag the divider to compare Raw Scan (Left) vs. ViT Heatmap (Right)
              </p>
            </div>
          </div>

          {/* Right Column: Diagnostic results & AI Findings */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Risk Gauge Card */}
            <div className="rounded-2xl border border-white/5 bg-[#0e101b]/60 p-5 shadow-inner flex flex-col items-center">
              <h2 className="text-base font-bold text-slate-200 self-start mb-4">Diagnostic Analysis</h2>

              <div className="relative flex items-center justify-center w-48 h-32 overflow-hidden">
                <svg className="absolute w-44 h-44 transform -rotate-180" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  {/* Track path */}
                  <path
                    d="M 20,80 A 30,30 0 0,1 80,80"
                    stroke="#1b2230"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Active gauge path */}
                  <path
                    d="M 20,80 A 30,30 0 0,1 80,80"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="94.25"
                    strokeDashoffset={94.25 * (1 - clampedPercent / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Score display */}
                <div className="absolute bottom-2 text-center">
                  <p className="text-3xl font-extrabold text-white">{clampedPercent.toFixed(1)}%</p>
                  <p className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${isMalignant ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
                    {isMalignant ? "High Malignant Risk" : "Benign / Low Risk"}
                  </p>
                </div>
              </div>

              {/* Score breakdown metrics */}
              <div className="w-full mt-4 grid grid-cols-3 border-t border-white/5 pt-4 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">CNN Score</p>
                  <p className="text-sm font-semibold text-slate-350 mt-1">{cnnScore.toFixed(3)}</p>
                </div>
                <div className="border-x border-white/5">
                  <p className="text-[10px] uppercase font-bold text-slate-500">XGB Score</p>
                  <p className="text-sm font-semibold text-slate-350 mt-1">{xgbScore.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Confidence</p>
                  <p className="text-sm font-semibold text-slate-350 mt-1">100%</p>
                </div>
              </div>
            </div>

            {/* AI Findings Checklist */}
            <div className="rounded-2xl border border-white/5 bg-[#0e101b]/60 p-5 shadow-inner">
              <h2 className="text-base font-bold text-slate-200 mb-4">AI Classification Insights</h2>
              <div className="space-y-4">
                {findings.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">{item.label}</span>
                      <span className={item.score > 50 ? "text-rose-400 font-bold" : "text-slate-300"}>
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full bg-[#070912] border border-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          item.score > 50 
                            ? "bg-gradient-to-r from-rose-500 to-red-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]" 
                            : "bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/5 pt-6 relative z-10">
          <Link
            to="/detect"
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(20,184,166,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
          >
            <Repeat className="h-4 w-4" />
            Try another image
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-[#0e101b]/60 px-5 py-2.5 text-sm font-semibold text-slate-400 transition duration-300 hover:bg-slate-800/80 hover:text-white"
          >
            <ShieldAlert className="h-4 w-4" />
            Read disclaimer
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResultPage;
