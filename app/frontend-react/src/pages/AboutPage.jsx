import { Brain, Cpu, FlaskConical, ShieldAlert } from "lucide-react";

function AboutPage() {
  return (
    <section className="fade-in mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <div className="rounded-3xl border border-slate-800 bg-[#121620]/90 p-6 shadow-xl md:p-9">
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          About This Application
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
          DermaAI helps clinicians and users upload skin images and receive an AI-based screening
          prediction. It is designed to support early awareness through a clean and professional
          interface.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-[#0f121a]/80 p-5">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <FlaskConical className="h-5 w-5 text-teal-400" />
              How it works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              The backend model analyzes uploaded images and returns a predicted class with
              confidence score so users can better understand potential risk levels.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-[#0f121a]/80 p-5">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <Cpu className="h-5 w-5 text-violet-400" />
              Technology stack
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Brain className="h-4 w-4 text-teal-400" />
                CNN+XGBOOST MODEL / VIT+XGBOOST MODEL
              </span>{" "}
              <span className="text-slate-400">
                for image classification, FastAPI for model serving, React + Vite for frontend, and
                Tailwind CSS for modern, responsive UI.
              </span>
            </p>
          </article>
        </div>

        <p className="mt-7 inline-flex items-start gap-2 rounded-xl border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-sm leading-relaxed text-amber-400">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Disclaimer: This tool is for educational purposes only and not medical advice or a
          diagnosis. Please consult a qualified healthcare professional for clinical decisions.
        </p>
      </div>
    </section>
  );
}

export default AboutPage;
