import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { 
  FaShareAlt, 
  FaEdit, 
  FaBolt, 
  FaDownload, 
  FaFileExport, 
  FaFileImport, 
  FaDesktop, 
  FaChevronDown 
} from 'react-icons/fa';
import { TEMPLATES } from '../templates/TemplateRenderer';

function Navbar({ 
  user, 
  data, 
  onOpenShare, 
  onOpenEditor, 
  onOpenAts,
  selectedTemplate = 'modern',
  onSelectTemplate,
  onExportHtml,
  onExportJson,
  onImportJson,
  onNewPortfolio, 
  isSharedView 
}) {
  const [showTypewriter, setShowTypewriter] = useState(true);

  useEffect(() => {
    if (user?.name) {
      const timeout = setTimeout(() => {
        setShowTypewriter(false);
      }, user.name.length * 80 + 500);

      return () => clearTimeout(timeout);
    }
  }, [user?.name]);

  const handleJsonUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && onImportJson) {
      onImportJson(file);
    }
  };

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/85 backdrop-blur-xl border-b border-gray-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Brand / Name Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Button */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-gray-900 border border-gray-700/80 rounded-2xl z-50 mt-3 w-60 p-3 shadow-2xl space-y-1.5 text-gray-200">
              <li><a href="#about" className="hover:text-fuchsia-400">About Me</a></li>
              {data?.Experience?.length > 0 && <li><a href="#experience" className="hover:text-fuchsia-400">Experience</a></li>}
              {data?.projects?.length > 0 && <li><a href="#projects" className="hover:text-fuchsia-400">Projects</a></li>}
              {data?.certifications?.length > 0 && <li><a href="#certifications" className="hover:text-fuchsia-400">Certifications</a></li>}
              {data?.education?.length > 0 && <li><a href="#education" className="hover:text-fuchsia-400">Education</a></li>}
              {data?.skills?.length > 0 && <li><a href="#skills" className="hover:text-fuchsia-400">Skills</a></li>}
              <li><a href="#contact" className="hover:text-fuchsia-400">Contact</a></li>
              <div className="border-t border-gray-800 my-1"></div>
              <li>
                <button onClick={onOpenEditor} className="text-fuchsia-400 font-semibold flex items-center gap-2">
                  <FaEdit /> Live Editor (WYSIWYG)
                </button>
              </li>
              <li>
                <button onClick={onOpenAts} className="text-emerald-400 font-semibold flex items-center gap-2">
                  <FaBolt /> ATS Score & JD Matcher
                </button>
              </li>
            </ul>
          </div>

          {/* User Name with Animated Typewriter */}
          <a href="#landing" className="flex items-center gap-2 group">
            <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              {showTypewriter ? (
                <Typewriter
                  words={[user?.name || "Portfolio"]}
                  typeSpeed={80}
                  deleteSpeed={0}
                  cursor
                  cursorStyle="|"
                  loop={1}
                />
              ) : (
                user?.name || "Portfolio"
              )}
            </span>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-gray-300">
          <a href="#about" className="hover:text-fuchsia-400 transition-colors">About</a>
          {data?.Experience?.length > 0 && <a href="#experience" className="hover:text-fuchsia-400 transition-colors">Experience</a>}
          {data?.projects?.length > 0 && <a href="#projects" className="hover:text-fuchsia-400 transition-colors">Projects</a>}
          {data?.certifications?.length > 0 && <a href="#certifications" className="hover:text-fuchsia-400 transition-colors">Certificates</a>}
          {data?.education?.length > 0 && <a href="#education" className="hover:text-fuchsia-400 transition-colors">Education</a>}
          {data?.skills?.length > 0 && <a href="#skills" className="hover:text-fuchsia-400 transition-colors">Skills</a>}
          <a href="#contact" className="hover:text-fuchsia-400 transition-colors">Contact</a>
        </nav>

        {/* Action Controls Toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* 1. Template Switcher (Strategy Pattern) */}
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="px-3 py-1.5 rounded-xl bg-gray-900/90 border border-gray-700/80 hover:border-fuchsia-500/60 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Switch Layout Strategy (Modern / Terminal / Executive)"
            >
              <FaDesktop className="text-fuchsia-400 text-xs" />
              <span className="hidden md:inline">{currentTemplate.name.split(' ')[0]}</span>
              <span className="md:hidden">Theme</span>
              <FaChevronDown className="text-[10px] text-gray-400 ml-0.5" />
            </div>

            <ul tabIndex={0} className="dropdown-content bg-gray-900 border border-gray-700/90 rounded-2xl z-50 w-72 p-3 shadow-2xl space-y-2 mt-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                Strategy Template Engine
              </div>
              {TEMPLATES.map(tmpl => (
                <li key={tmpl.id}>
                  <button
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col ${
                      selectedTemplate === tmpl.id 
                        ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-300 shadow-md shadow-fuchsia-500/10' 
                        : 'hover:bg-gray-800/80 text-gray-300'
                    }`}
                  >
                    <span className="font-bold text-xs flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${tmpl.accentColor}`}></span>
                      {tmpl.name}
                      {selectedTemplate === tmpl.id && <span className="ml-auto text-[10px] text-fuchsia-400 font-normal">Active</span>}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1 leading-snug">{tmpl.tagline}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. WYSIWYG Live Editor Button */}
          <button
            onClick={onOpenEditor}
            className="px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-fuchsia-500/60 text-gray-200 hover:text-fuchsia-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Open Live Editor"
          >
            <FaEdit className="text-xs text-fuchsia-400" />
            <span className="hidden lg:inline">Live Editor</span>
          </button>

          {/* 3. ATS Score & JD Matcher Button */}
          <button
            onClick={onOpenAts}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Evaluate ATS Compatibility & Match Job Description"
          >
            <FaBolt className="text-xs text-emerald-400" />
            <span className="hidden lg:inline">ATS Score</span>
          </button>

          {/* 4. Export / Import Dropdown */}
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-cyan-500/60 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FaDownload className="text-xs text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
              <FaChevronDown className="text-[10px] text-gray-400" />
            </div>
            <ul tabIndex={0} className="dropdown-content bg-gray-900 border border-gray-700/90 rounded-2xl z-50 w-60 p-2.5 shadow-2xl space-y-1 mt-2 text-xs">
              <li>
                <button onClick={onExportHtml} className="w-full flex items-center gap-2.5 p-2.5 hover:bg-gray-800 rounded-xl text-cyan-300 font-medium">
                  <FaFileExport className="text-sm" /> Standalone HTML Bundle
                </button>
              </li>
              <li>
                <button onClick={onExportJson} className="w-full flex items-center gap-2.5 p-2.5 hover:bg-gray-800 rounded-xl text-gray-200 font-medium">
                  <FaDownload className="text-sm" /> Backup JSON Config
                </button>
              </li>
              <div className="border-t border-gray-800 my-1"></div>
              <li>
                <label className="w-full flex items-center gap-2.5 p-2.5 hover:bg-gray-800 rounded-xl text-gray-300 font-medium cursor-pointer">
                  <FaFileImport className="text-sm" /> Restore JSON Config
                  <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
                </label>
              </li>
            </ul>
          </div>

          {/* 5. Share Button */}
          <button
            onClick={onOpenShare}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 hover:from-fuchsia-600 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-fuchsia-500/25 transition-all transform hover:scale-105 active:scale-95"
            title="Share Portfolio on Any Device"
          >
            <FaShareAlt className="text-xs" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* 6. New / Create Own Button */}
          <button
            onClick={onNewPortfolio}
            className="px-3 py-1.5 rounded-xl border border-gray-700/80 hover:border-gray-500 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
            title={isSharedView ? "Create Your Own Portfolio" : "Upload New Resume"}
          >
            {isSharedView ? "+ Create" : "New"}
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
