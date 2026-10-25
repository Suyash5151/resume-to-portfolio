import React from 'react';
import { FaMagic, FaBolt, FaRobot } from 'react-icons/fa';

function Navbar2() {
  return (
    <nav className="navbar bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 sticky top-0 z-50 px-4 sm:px-8 shadow-xl">
      <div className="navbar-start flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-orange-400 p-[2px] shadow-lg shadow-fuchsia-500/25">
          <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center text-fuchsia-400">
            <FaRobot className="text-base" />
          </div>
        </div>
        <div>
          <a className="text-xl font-black tracking-tight bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            ResumeFolio
          </a>
          <div className="text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            AI Portfolio Architect
          </div>
        </div>
      </div>

      <div className="navbar-center hidden md:flex">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900/90 border border-gray-700/60 text-xs text-gray-300 shadow-inner">
          <span className="text-fuchsia-400 font-semibold flex items-center gap-1">
            <FaMagic className="text-[10px]" /> Turn Any PDF Resume
          </span>
          <span className="text-gray-500">→</span>
          <span className="text-cyan-300 font-medium">Interactive Portfolio & ATS Analysis</span>
        </div>
      </div>

      <div className="navbar-end flex items-center gap-3">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <FaBolt className="text-[10px]" /> ATS Optimizer Ready
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;