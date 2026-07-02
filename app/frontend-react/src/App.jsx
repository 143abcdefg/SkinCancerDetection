import { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PageLoader from "./components/PageLoader";
import AboutPage from "./pages/AboutPage";
import DetectPage from "./pages/DetectPage";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";

function App() {
  const location = useLocation();

  return (
    <main className="relative flex min-h-screen flex-col bg-[#07080e] overflow-hidden text-slate-100">
      {/* Ambient glowing circles */}
      <div className="pointer-events-none fixed -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[150px]" />
      <div className="pointer-events-none fixed -left-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[150px]" />

      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <div key={location.pathname} className="relative z-10 route-fade">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detect" element={<DetectPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Suspense>
      <Footer />
    </main>
  );
}

export default App;
