function UploadCard({
  previewUrl,
  dragActive,
  loading,
  onFileInputChange,
  onDrop,
  onDragOver,
  onDragLeave,
}) {
  return (
    <section className="glass-panel rounded-2xl p-5 shadow-inner transition-all duration-300">
      <h2 className="text-lg font-bold text-white tracking-tight">Upload Skin Image</h2>
      <p className="mt-1 text-sm text-slate-400">
        Drag and drop a clear, close-up image of the skin lesion.
      </p>

      <div
        className={`mt-4 rounded-xl border-2 border-dashed p-4 text-center transition-all ${
          dragActive
            ? "border-teal-500 bg-teal-950/20"
            : "border-slate-800 bg-[#070912]/80 hover:border-slate-700 hover:bg-[#0f121d]/20"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {previewUrl ? (
          <div className="relative mx-auto max-h-64 w-full rounded-lg overflow-hidden flex items-center justify-center bg-[#05070c] border border-white/5">
            <img
              src={previewUrl}
              alt="Selected skin lesion preview"
              className="max-h-64 max-w-full object-contain"
            />
            {loading && (
              <>
                {/* Horizontal laser scanline */}
                <div className="absolute left-0 w-full h-[2px] bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-scan pointer-events-none" />
                
                {/* Dermal target grid */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-32 w-32 rounded-full border border-teal-500/40 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full border border-dashed border-teal-400/30" />
                  </div>
                  <div className="absolute h-full w-[1px] bg-teal-500/20" />
                  <div className="absolute w-full h-[1px] bg-teal-500/20" />
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="py-10 text-sm text-slate-500">
            Drop JPG or PNG image here (up to 10MB)
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:shadow-[0_0_12px_rgba(20,184,166,0.35)] hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={onFileInputChange}
            disabled={loading}
            className="hidden"
            aria-label="Upload image file"
          />
          Upload Image
        </label>
      </div>
    </section>
  );
}

export default UploadCard;
