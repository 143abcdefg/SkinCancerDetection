import { NavLink } from "react-router-dom";
import { Activity, Info, ScanLine, ShieldPlus } from "lucide-react";

const navItems = [
  { label: "Home", to: "/", icon: Activity },
  { label: "Detect", to: "/detect", icon: ScanLine },
  { label: "About", to: "/about", icon: Info },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0c16]/75 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <NavLink to="/" className="group flex items-center gap-2.5 text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[0_0_12px_rgba(45,212,191,0.2)] transition group-hover:scale-105">
            <ShieldPlus className="h-4 w-4" />
          </span>
          <span className="text-sm font-extrabold tracking-tight md:text-base">
            Derma<span className="text-teal-450">AI</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-[#0e101a]/60 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs md:text-sm font-semibold transition-all duration-250 ${
                    isActive
                      ? "bg-teal-950/30 text-teal-400 border border-teal-500/25 shadow-[0_0_8px_rgba(20,184,166,0.15)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent"
                  }`
                }
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <div className="hidden flex-col text-right md:flex">
              <span className="text-xs font-bold text-slate-200">Eng. Najma Mohamed</span>
              <span className="text-[10px] text-slate-500">AI Engineer</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              NM
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
