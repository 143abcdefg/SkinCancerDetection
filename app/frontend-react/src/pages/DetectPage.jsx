import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Upload, CheckCircle2, Loader2, Hourglass, Settings, ShieldCheck, Activity, Sliders, Sparkles } from "lucide-react";
import { usePrediction } from "../context/PredictionContext";

const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.includes(".local") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
  ) {
    return `http://${hostname}:8000/predict`;
  }
  return "https://skin-cancer-api-4r3k.onrender.com/predict";
};

const API_URL = getApiUrl();
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE_MB = 10;

function DetectPage() {
  const {
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    selectedModel,
    setSelectedModel,
    setPrediction,
    setConfidence,
    setModelUsed,
    setCnnScore,
    setXgbScore,
    clearPrediction,
  } = usePrediction();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Connected");
  const [dragActive, setDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [customApiUrl, setCustomApiUrl] = useState(API_URL);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let interval;
    if (loading) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev < 85) return prev + Math.floor(Math.random() * 8) + 3;
          if (prev < 97) return prev + 1;
          return prev;
        });
      }, 150);
    } else {
      setScanProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const stateModel = String(location.state?.model || "")
    .trim()
    .toLowerCase();
  const modelFromState = stateModel === "cnn" || stateModel === "vit" ? stateModel : "";
  const activeModel = modelFromState || selectedModel || "vit";

  const canPredict = useMemo(
    () => selectedFile && activeModel && !loading,
    [selectedFile, activeModel, loading]
  );

  const normalizePrediction = (rawPrediction) => {
    const value = String(rawPrediction || "").trim().toLowerCase();
    if (value.includes("malignant")) return "malignant";
    if (value.includes("benign")) return "benign";
    return "unknown";
  };

  useEffect(() => {
    if (activeModel && activeModel !== selectedModel) {
      setSelectedModel(activeModel);
    }
  }, [activeModel, selectedModel, setSelectedModel]);

  const validateImageFile = (file) => {
    if (!file) return "No file selected.";
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please use JPG or PNG image files.";
    }
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `Image is too large. Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`;
    }
    return "";
  };

  const setNewSelectedFile = (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    clearPrediction();
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setNewSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    setNewSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const parseApiError = async (response) => {
    try {
      const data = await response.json();
      return data.detail || data.error || "Prediction request failed.";
    } catch {
      return "Server returned an invalid response.";
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }
    if (!activeModel) {
      setError("Please choose a model first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile, selectedFile.name || "skin-image.jpg");
      formData.append("model_type", activeModel);

      const response = await fetch(customApiUrl, {
        method: "POST",
        body: formData,
        headers: {
          "bypass-tunnel-reminder": "true",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        const apiError = await parseApiError(response);
        throw new Error(apiError);
      }

      const data = await response.json();
      setPrediction(normalizePrediction(data.prediction));
      setConfidence(Number(data.confidence || 0));
      setModelUsed(String(data.model_used || activeModel).toLowerCase());
      setCnnScore(Number(data.cnn_score || 0));
      setXgbScore(Number(data.xgb_score || 0));
      navigate("/result");
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Cannot connect to server. Make sure FastAPI backend is running on port 8000.");
      } else {
        setError(err.message || "Unexpected error while predicting.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fade-in mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <div className="flex flex-col gap-6">
        
        {/* Title Banner */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white font-display">
              Detection Workspace
            </h1>
            <p className="mt-1 text-xs text-slate-400 font-sans">
              Outfit: 36px, weight 700
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-950/20 border border-emerald-500/35 px-4 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active, Connected
          </div>
        </div>

        {/* main grid */}
        <div className="grid gap-6 md:grid-cols-12 items-stretch">
          
          {/* Left Column: Upload slot & Instructions */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Upload Zone */}
            <div className="glass-panel rounded-2xl p-5 shadow-inner transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight font-display text-center">
                  Upload Skin Lesion Photo
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 text-center font-sans">
                  Inter: 20px, weight 400
                </p>
              </div>

              {/* Dashed Drag/Drop Box */}
              <div
                className={`mt-4 rounded-xl border-2 border-dashed p-4 text-center transition-all flex flex-col items-center justify-center relative min-h-[220px] ${
                  dragActive
                    ? "border-teal-500 bg-teal-950/20"
                    : "border-cyan-500/40 bg-[#070912]/80 hover:border-cyan-400 hover:bg-[#0f121d]/20"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {previewUrl ? (
                  <div className="relative mx-auto max-h-60 w-full rounded-lg flex items-center justify-center bg-[#05070c] p-2">
                    
                    {/* Measurement arrows overlay (mockup visual detail) */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[8px] font-bold text-cyan-400/80">
                      <span className="h-6 w-[1px] bg-cyan-400/60" />
                      <span>6.2mm</span>
                      <span className="h-6 w-[1px] bg-cyan-400/60" />
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[8px] font-bold text-cyan-400/80">
                      <span className="w-10 h-[1px] bg-cyan-400/60" />
                      <span>6.2mm x 4.8mm</span>
                      <span className="w-10 h-[1px] bg-cyan-400/60" />
                    </div>

                    <img
                      src={previewUrl}
                      alt="Skin lesion preview"
                      className="max-h-56 max-w-[80%] object-contain rounded-md"
                    />

                    {loading && (
                      <div className="absolute left-0 w-full h-[2px] bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-scan pointer-events-none" />
                    )}
                  </div>
                ) : (
                  <label className="cursor-pointer py-10 flex flex-col items-center justify-center gap-3">
                    <Upload className="h-10 w-10 text-cyan-400 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-400">
                      Drop JPG or PNG image here (up to 10MB)
                    </span>
                    <span className="rounded-lg bg-slate-900 border border-white/5 px-3 py-1.5 text-xs text-slate-500 hover:text-white transition mt-2">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {selectedFile && (
                <div className="mt-3 text-center">
                  <p className="text-xs font-semibold text-teal-400">
                    Photo uploaded: {selectedFile.name} | Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-[10px] text-slate-500">Inter font, 14px</p>
                </div>
              )}
            </div>

            {/* Scan Instructions */}
            <div className="glass-panel rounded-2xl p-5 shadow-inner">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
                Scan Instructions
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-white/5 bg-[#0a0c16]/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-teal-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">Ensure clear lighting</p>
                  <p className="mt-1 text-[10px] text-slate-500">Inter, 12px</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-[#0a0c16]/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-purple-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">Focus on lesion</p>
                  <p className="mt-1 text-[10px] text-slate-500">Inter, 12px</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-[#0a0c16]/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">JPG/PNG, Max 10MB</p>
                  <p className="mt-1 text-[10px] text-slate-500">Inter, 12px</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Model selector & Analyze action */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Analysis Configuration */}
            <div className="glass-panel rounded-2xl p-6 shadow-inner flex flex-col justify-between h-full">
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight font-display">
                    Analysis Configuration
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400 font-sans">
                    Configure the classification pipeline
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Model Selection
                  </label>
                  <select
                    value={activeModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="vit">ViT + XGBoost Pipeline</option>
                    <option value="cnn">CNN + XGBoost Pipeline</option>
                  </select>
                  <p className="text-[10px] text-slate-500">Inter: 16px, weight 500</p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#070912]/80 p-3 text-xs leading-relaxed text-slate-400 space-y-1">
                  <p className="font-bold text-slate-300">
                    {activeModel === "cnn" ? "CNN + XGBOOST Pipeline" : "ViT + XGBOOST Pipeline"}
                  </p>
                  <p>
                    {activeModel === "cnn" 
                      ? "Extracts deep spatial convolutional maps combined with XGBoost booster. Ideal for general screening."
                      : "Leverages Vision Transformer self-attention modules combined with XGBoost tree structure."}
                  </p>
                </div>
              </div>

              {/* Action Analyze button */}
              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={!canPredict}
                  className="group w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-500 to-purple-500 px-6 py-4 text-sm font-bold text-white shadow-[0_0_15px_rgba(20,184,166,0.25)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Activity className="h-4.5 w-4.5 animate-pulse" />
                  Analyze Image
                </button>
                <p className="text-center text-[10px] text-slate-500">Outfit: 18px, weight 600</p>
                
                {error && (
                  <p role="alert" className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-xs text-rose-400">
                    {error}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Loading overlay panel when predicting */}
        {loading && (
          <div className="glass-panel rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <h3 className="text-base font-bold text-white mb-4 font-display">Neural Diagnostics Running</h3>
            <div className="flex flex-col items-center justify-center p-6 border border-white/5 bg-[#070912]/80 rounded-xl">
              <Loader2 className="h-10 w-10 text-teal-400 animate-spin" />
              <div className="mt-4 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-bold text-teal-400">{scanProgress}% Processing</p>
            </div>
          </div>
        )}

        {/* Server Connection Settings (Bottom Row) */}
        <div className="glass-panel rounded-2xl p-5 shadow-inner">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3.5 font-display">
            Server Connection Settings
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-xs">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="text-slate-500">API Server:</span>{" "}
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="bg-transparent border-b border-white/10 text-slate-300 focus:outline-none focus:border-teal-500 px-1 py-0.5 ml-1.5 w-60"
                />
              </div>
              <div>
                <span className="text-slate-500">Status:</span>{" "}
                <span className="text-emerald-400 font-bold ml-1">Connected</span>
              </div>
              <div>
                <span className="text-slate-500">Latency:</span>{" "}
                <span className="text-slate-350 ml-1">42ms</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500">
              Inter font, 14px | Last Sync: 1 minute ago
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default DetectPage;
