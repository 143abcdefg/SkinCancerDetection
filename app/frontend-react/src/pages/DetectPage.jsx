import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Upload, CheckCircle2, Loader2, Hourglass, Settings } from "lucide-react";
import Loader from "../components/Loader";
import UploadCard from "../components/UploadCard";
import { usePrediction } from "../context/PredictionContext";

const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.includes(".local") || // support Bonjour/mDNS hosts
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) // regex for 172.16.0.0 - 172.31.255.255
  ) {
    return `http://${hostname}:8000/predict`;
  }
  return "https://najma-derma-api.loca.lt/predict";
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
  const [status, setStatus] = useState("Choose an image to begin.");
  const [dragActive, setDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(API_URL);

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

  // const videoRef = useRef(null);
  // const canvasRef = useRef(null);
  // const streamRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const stateModel = String(location.state?.model || "")
    .trim()
    .toLowerCase();
  const modelFromState = stateModel === "cnn" || stateModel === "vit" ? stateModel : "";
  const activeModel = modelFromState || selectedModel;

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

  // const stopCamera = () => {
  //   if (streamRef.current) {
  //     streamRef.current.getTracks().forEach((track) => track.stop());
  //     streamRef.current = null;
  //   }
  //   setCameraOn(false);
  // };

  // useEffect(() => {
  //   return () => {
  //     stopCamera();
  //   };
  // }, []);

  useEffect(() => {
    if (modelFromState && modelFromState !== selectedModel) {
      setSelectedModel(modelFromState);
    }
  }, [modelFromState, selectedModel, setSelectedModel]);

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
      setStatus("Please choose a valid image file.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    clearPrediction();
    setError("");
    setStatus("Image ready. Click Analyze Image.");
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

  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     streamRef.current = stream;
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //     }
  //     setCameraOn(true);
  //     setError("");
  //     setStatus("Camera started. Capture an image when ready.");
  //   } catch {
  //     setError("Could not access camera. Please allow camera permission.");
  //     setStatus("Camera access failed.");
  //   }
  // };

  // const captureFromCamera = () => {
  //   if (!videoRef.current || !canvasRef.current) return;

  //   const video = videoRef.current;
  //   const canvas = canvasRef.current;
  //   const width = video.videoWidth || 640;
  //   const height = video.videoHeight || 480;
  //   canvas.width = width;
  //   canvas.height = height;

  //   const context = canvas.getContext("2d");
  //   context.drawImage(video, 0, 0, width, height);

  //   canvas.toBlob(
  //     (blob) => {
  //       if (!blob) {
  //         setError("Failed to capture image from camera.");
  //         setStatus("Capture failed. Please try again.");
  //         return;
  //       }
  //       const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
  //       setNewSelectedFile(file);
  //     },
  //     "image/jpeg",
  //     0.95
  //   );
  // };

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
      setError("Please upload or capture an image first.");
      setStatus("No image selected.");
      return;
    }
    if (!activeModel) {
      setError("Please start from Home page and choose a model first.");
      setStatus("Model not selected.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus(`Analyzing image with ${activeModel.toUpperCase()} model...`);

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
      setStatus("Prediction complete.");
      navigate("/result");
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Cannot connect to server. Make sure FastAPI backend is running on port 8000.");
      } else {
        setError(err.message || "Unexpected error while predicting.");
      }
      setStatus("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fade-in mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <div className="glass-panel rounded-3xl p-6 shadow-2xl md:p-9 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-teal-500/5 blur-[80px]" />
        
        <h1 className="mb-5 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl relative z-10">
          <Upload className="h-6 w-6 text-teal-400" />
          Detection Workspace
        </h1>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-[#0a0c16]/50 px-4 py-3 relative z-10">
          <p className="text-sm font-medium text-slate-350">{status}</p>
        </div>

        {/* Server Connection Settings */}
        <div className="mb-6 relative z-10">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#0a0c16]/30 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <Settings className="h-3.5 w-3.5" />
            {showSettings ? "Hide Server Settings" : "Server Connection Settings"}
          </button>
          
          {showSettings && (
            <div className="mt-3 rounded-xl border border-white/5 bg-[#0a0c16]/80 p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Backend API URL (for /predict endpoint)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customApiUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomApiUrl(val);
                    }}
                    placeholder="e.g. http://10.23.1.107:8000/predict"
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const defaultValue = getApiUrl();
                      setCustomApiUrl(defaultValue);
                    }}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    Reset
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500 leading-normal">
                  Your phone is currently loading the app from host: <code className="text-slate-400">{window.location.hostname}</code>.<br/>
                  If your server is using localtunnel, paste your backend tunnel link here (ends with <code className="text-slate-400">/predict</code>).
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3 relative z-10">
          <p className="rounded-full bg-teal-950/30 border border-teal-500/25 px-4 py-2 text-sm font-semibold text-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.1)]">
            {activeModel
              ? `Using ${activeModel === "cnn" ? "CNN+XGBOOST MODEL" : "VIT+XGBOOST MODEL"}`
              : "No model selected (go back to Home page)"}
          </p>
        </div>

        <div className={`grid gap-6 relative z-10 ${loading ? "md:grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <UploadCard
              previewUrl={previewUrl}
              dragActive={dragActive}
              loading={loading}
              onFileInputChange={handleFileChange}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            />

            {!loading && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(20,184,166,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handlePredict}
                  disabled={!canPredict}
                  aria-label="Run skin cancer prediction"
                >
                  Analyze Image
                  <ArrowRight className="h-4 w-4" />
                </button>
                {error ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-rose-900/50 bg-rose-950/20 px-3 py-2 text-sm text-rose-400"
                  >
                    {error}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    Supported: JPG/PNG, max {MAX_FILE_SIZE_MB}MB
                  </p>
                )}
              </div>
            )}
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/5 bg-[#0e101b]/60 backdrop-blur-md p-5 shadow-inner flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Neural Analysis Running</h2>
                <p className="mt-1 text-xs text-slate-400">
                  SCAN_ID: SC-{Math.floor(Math.random() * 90000) + 10000}
                </p>

                <div className="mt-6 flex flex-col items-center justify-center p-5 border border-white/5 bg-[#070912]/80 rounded-xl relative overflow-hidden">
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-teal-500/30" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-teal-500/30" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-teal-500/30" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-teal-500/30" />

                  <Loader2 className="h-9 w-9 text-teal-400 animate-spin" />
                  <div className="mt-4 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-xs font-bold text-teal-400">{scanProgress}% Processing</p>
                </div>

                <div className="mt-6 space-y-3.5">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    {scanProgress >= 20 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-teal-400 animate-spin" />
                    )}
                    <span className={scanProgress >= 20 ? "text-slate-500 line-through" : "font-medium text-slate-300"}>
                      Image preprocessing complete
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    {scanProgress >= 40 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : scanProgress >= 20 ? (
                      <Loader2 className="h-4 w-4 text-teal-400 animate-spin" />
                    ) : (
                      <Hourglass className="h-4 w-4 text-slate-600" />
                    )}
                    <span
                      className={
                        scanProgress >= 40
                          ? "text-slate-500 line-through"
                          : scanProgress >= 20
                          ? "font-medium text-slate-300"
                          : "text-slate-500"
                      }
                    >
                      Normalizing input features
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    {scanProgress >= 60 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : scanProgress >= 40 ? (
                      <Loader2 className="h-4 w-4 text-teal-400 animate-spin" />
                    ) : (
                      <Hourglass className="h-4 w-4 text-slate-600" />
                    )}
                    <span
                      className={
                        scanProgress >= 60
                          ? "text-slate-500 line-through"
                          : scanProgress >= 40
                          ? "font-medium text-slate-300"
                          : "text-slate-500"
                      }
                    >
                      Running CNN classification (MobileNetV2)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    {scanProgress >= 80 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : scanProgress >= 60 ? (
                      <Loader2 className="h-4 w-4 text-teal-400 animate-spin" />
                    ) : (
                      <Hourglass className="h-4 w-4 text-slate-600" />
                    )}
                    <span
                      className={
                        scanProgress >= 80
                          ? "text-slate-500 line-through"
                          : scanProgress >= 60
                          ? "font-medium text-slate-300"
                          : "text-slate-500"
                      }
                    >
                      Computing ViT self-attention maps
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    {scanProgress >= 95 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : scanProgress >= 80 ? (
                      <Loader2 className="h-4 w-4 text-teal-400 animate-spin" />
                    ) : (
                      <Hourglass className="h-4 w-4 text-slate-600" />
                    )}
                    <span
                      className={
                        scanProgress >= 95
                          ? "text-slate-500 line-through"
                          : scanProgress >= 80
                          ? "font-medium text-slate-300"
                          : "text-slate-500"
                      }
                    >
                      Generating diagnostic risk assessment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DetectPage;
