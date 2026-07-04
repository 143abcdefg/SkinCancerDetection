import { useState } from "react";
import { Mail, ExternalLink, Cpu, Layers, Globe, ArrowUpRight, Code2, CheckCircle2, ChevronRight } from "lucide-react";
import najmaPhoto from "./assets/najma.jpg";

function App() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const emailAddress = "najmamohamed.ce@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Ambient backgrounds */}
      <div className="pointer-events-none fixed -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <img src={najmaPhoto} alt="Najma Mohamed Profile" className="h-full w-full object-cover" />
            </div>
            <span className="text-lg font-black tracking-tight font-display text-white">Najma</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#work" className="text-sm font-medium text-slate-400 hover:text-white transition">Work</a>
            <a href="#services" className="text-sm font-medium text-slate-400 hover:text-white transition">Services</a>
            <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition">About</a>
            <a 
              href={`mailto:${emailAddress}`}
              className="rounded-full bg-white px-5 py-2 text-xs font-bold text-black hover:bg-slate-200 transition font-display"
            >
              Book a Call
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-12">
          
          {/* Left Hero Texts */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-950/20 px-3 py-1 text-xs font-semibold text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Available for Opportunities
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-[1.1] text-white md:text-6xl font-display">
              I build high-end <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI systems
              </span> <br />
              and web applications.
            </h1>
            <p className="text-sm leading-relaxed text-slate-400 max-w-lg font-sans">
              Computer Engineering graduate specializing in deep learning model serving, API architectures, and interactive, premium web interfaces. Bridging the gap between software complexity and clean client UX.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#work"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-black hover:bg-slate-200 transition font-display"
              >
                View Work
              </a>
              <button 
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                {copiedEmail ? "Email Copied!" : "Get in Touch"}
              </button>
            </div>
          </div>

          {/* Right Floating Device Mock */}
          <div className="md:col-span-5 relative flex items-center justify-center">
            
            {/* Glowing Backdrop Glow */}
            <div className="absolute inset-0 m-auto h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />
            
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">DermaAI_Diagnostic_Suite</span>
              </div>
              
              {/* Mock Dashboard Screen */}
              <div className="space-y-4 rounded-xl border border-white/5 bg-[#06070c] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">AI Diagnostic Report</span>
                  <span className="text-[8px] bg-rose-955/20 border border-rose-800/40 text-rose-400 px-2 py-0.5 rounded">High Risk</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/5 bg-[#0b0c16] p-2 flex flex-col justify-between h-16">
                    <span className="text-[7px] text-slate-500">CNN SCORE</span>
                    <span className="text-sm font-black text-teal-400">0.512</span>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-[#0b0c16] p-2 flex flex-col justify-between h-16">
                    <span className="text-[7px] text-slate-500">VIT SCORE</span>
                    <span className="text-sm font-black text-purple-400">0.531</span>
                  </div>
                </div>

                <div className="rounded-lg border border-white/5 bg-slate-950 p-2.5 text-[8px] text-slate-400 space-y-1.5">
                  <p className="font-bold text-white">Inference Ensemble Formula</p>
                  <p>Predictions combine Vision Transformer self-attention features (55% weight) with XGBoost classifier trees (45% weight).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Marquee Separator */}
      <div className="relative border-y border-white/5 bg-white/2 py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs font-black uppercase tracking-widest text-slate-500 font-display">
          <span className="mx-4">Machine Learning</span> • <span className="mx-4">Embedded Systems</span> • <span className="mx-4">Full-Stack Development</span> • <span className="mx-4">React & Tailwind</span> • <span className="mx-4">FastAPI APIs</span> • <span className="mx-4">OpenCV Computer Vision</span> • <span className="mx-4">PyTorch Models</span>
          <span className="mx-4">Machine Learning</span> • <span className="mx-4">Embedded Systems</span> • <span className="mx-4">Full-Stack Development</span> • <span className="mx-4">React & Tailwind</span> • <span className="mx-4">FastAPI APIs</span> • <span className="mx-4">OpenCV Computer Vision</span> • <span className="mx-4">PyTorch Models</span>
        </div>
      </div>

      {/* Work / Projects Section */}
      <section id="work" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-black text-white md:text-3.5xl font-display mb-10">Selected Work</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Project Card 1 */}
          <div className="group rounded-2xl border border-white/5 bg-gradient-to-br from-white/3 to-transparent p-6 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Signature Project</span>
              <div className="flex gap-2">
                <a 
                  href="https://skin-cancer-detection-nine.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="rounded-full bg-slate-900 border border-white/10 p-2 text-slate-400 hover:text-white transition"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a 
                  href="https://github.com/143abcdefg/SkinCancerDetection" 
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-slate-900 border border-white/10 p-2 text-slate-400 hover:text-white transition inline-flex items-center justify-center"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </a>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white font-display">DermaAI: Skin Cancer Diagnostic Suite</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              A clinical-grade skin anomaly screening workspace. Extracts intermediate attention map features from a trained Vision Transformer (ViT), pipes them into XGBoost, and serves the ensemble model on a FastAPI backend.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">PyTorch</span>
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">XGBoost</span>
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">FastAPI</span>
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">React</span>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="group rounded-2xl border border-white/5 bg-gradient-to-br from-white/3 to-transparent p-6 transition-all duration-300 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Embedded Systems</span>
              <span className="rounded-full bg-slate-900 border border-white/10 p-2 text-slate-400">
                <Cpu className="h-4 w-4" />
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white font-display">Edge AI Camera</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              High-efficiency object detection pipeline targeting resource-constrained micro-controller units. Implements model quantization and hardware-accelerated C++ layers to run inference directly on-chip.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">C++</span>
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">OpenCV</span>
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">quantized YOLO</span>
              <span className="rounded-md bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">ARM Cortex</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Expertise */}
      <section id="services" className="bg-white/1 py-20 border-y border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-black text-white md:text-3.5xl font-display mb-10">Expertise Areas</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Service item 1 */}
            <div className="rounded-xl border border-white/5 bg-[#06060c] p-6 space-y-4">
              <div className="h-10 w-10 rounded-full bg-teal-950/40 border border-teal-850 flex items-center justify-center text-teal-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display">AI Model Engineering</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                Fine-tuning and deploying convolutional networks and vision transformers. Building robust feature-extraction logic to train custom XGBoost classifiers.
              </p>
            </div>

            {/* Service item 2 */}
            <div className="rounded-xl border border-white/5 bg-[#06060c] p-6 space-y-4">
              <div className="h-10 w-10 rounded-full bg-cyan-950/40 border border-cyan-850 flex items-center justify-center text-cyan-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display">Full-Stack Architectures</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                Developing responsive React layouts styled with Tailwind, and serving endpoints with FastAPI. Handling multi-threading, CORS configurations, and Docker deployments.
              </p>
            </div>

            {/* Service item 3 */}
            <div className="rounded-xl border border-white/5 bg-[#06060c] p-6 space-y-4">
              <div className="h-10 w-10 rounded-full bg-purple-950/40 border border-purple-850 flex items-center justify-center text-purple-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display">Low-Level Software</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                Familiarity with ARM Cortex hardware configuration, priority-based schedulers, hardware registers, and register-level Verilog/VHDL simulations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About / Resume Section */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-12">
          
          {/* Left Text */}
          <div className="md:col-span-8 space-y-6">
            <h2 className="text-2xl font-black text-white md:text-3.5xl font-display">About Me</h2>
            <p className="text-sm leading-relaxed text-slate-400 font-sans">
              I am a **Computer Engineering** student at **Karabük University** (graduating 2026). My engineering journey focuses on the convergence of machine learning and modern web technologies. I enjoy building systems that translate complicated neural network weights into visual, interactive tools that solve real problems.
            </p>
            <p className="text-sm leading-relaxed text-slate-400 font-sans">
              Whether optimizing inference speeds of model layers, building backend APIs, or styling modern, dark-mode interfaces, I strive for high performance and visual excellence in all my work.
            </p>

            {/* Education Timeline */}
            <div className="pt-4 border-l border-white/10 pl-6 space-y-4 relative">
              <div className="absolute h-3.5 w-3.5 rounded-full bg-cyan-500 -left-[7px] top-1 border-4 border-[#050505]" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white font-display">Karabük University</span>
                <span className="text-xs text-cyan-400 font-semibold font-mono">2022 - 2026</span>
              </div>
              <p className="text-xs text-slate-500">B.Sc. in Computer Engineering | Specializing in Machine Learning and Embedded Systems.</p>
            </div>
          </div>

          {/* Right Contact/Resume download */}
          <div className="md:col-span-4 rounded-xl border border-white/5 bg-[#06060c] p-6 flex flex-col justify-between h-72">
            <div>
              <h3 className="text-base font-bold text-white font-display mb-3">Connect With Me</h3>
              <p className="text-xs text-slate-550 leading-relaxed font-sans mb-4">
                Reach out to discuss potential roles, research collaborations, or software projects.
              </p>
              
              <div className="space-y-3.5">
                <a href={`mailto:${emailAddress}`} className="flex items-center gap-3 text-xs text-slate-405 hover:text-white transition">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  {emailAddress}
                </a>
                <a href="https://github.com/143abcdefg" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs text-slate-455 hover:text-white transition">
                  <svg className="h-4 w-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  github.com/143abcdefg
                </a>
              </div>
            </div>

            <button 
              onClick={handleCopyEmail}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-xs font-bold text-white transition font-display"
            >
              Get Resume / CV
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600 font-mono">
        &copy; {new Date().getFullYear()} Najma Mohamed. All rights reserved. Crafted with React, Vite, and Tailwind v4.0.
      </footer>

    </div>
  );
}

export default App;
