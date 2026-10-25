import React, { useState } from 'react';
import { 
  FaTerminal, 
  FaFolder, 
  FaFileCode, 
  FaExternalLinkAlt, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaDownload,
  FaShareAlt,
  FaEdit
} from 'react-icons/fa';

export default function TerminalTemplate({
  resumeData,
  imgurl,
  pdfUrl,
  resumeFile,
  onOpenShare,
  onOpenEditor,
  onOpenAts
}) {
  const [activeTab, setActiveTab] = useState('all');
  const d = resumeData || {};

  const handleDownload = () => {
    if (resumeFile) {
      const url = URL.createObjectURL(resumeFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeFile.name || `${d.name || 'Resume'}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${d.name || 'Resume'}.pdf`;
      a.click();
    } else {
      alert("No PDF file attached to download.");
    }
  };

  return (
    <div className="terminal-template bg-[#0d1117] text-[#c9d1d9] font-mono min-h-screen p-4 sm:p-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-5xl mx-auto border border-[#30363d] rounded-xl overflow-hidden shadow-2xl bg-[#161b22]/95 backdrop-blur-md">
        
        {/* Terminal Title Bar */}
        <div className="bg-[#21262d] border-b border-[#30363d] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
            <span className="ml-2 text-xs text-gray-400 font-semibold tracking-wide">
              bash - {d.name?.toLowerCase().replace(/\s+/g, '_') || 'dev'}@portfolio-v2.0
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              SYS: ONLINE
            </span>
            {onOpenEditor && (
              <button 
                onClick={onOpenEditor}
                className="px-2 py-1 rounded bg-[#30363d] hover:bg-[#3d444d] text-cyan-400 flex items-center gap-1 transition-colors"
                title="Edit data in live editor"
              >
                <FaEdit /> Edit
              </button>
            )}
            {onOpenShare && (
              <button 
                onClick={onOpenShare}
                className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition-colors"
              >
                <FaShareAlt /> Share
              </button>
            )}
          </div>
        </div>

        {/* Terminal Content Body */}
        <div className="p-6 sm:p-10 space-y-10">
          
          {/* Header Command */}
          <div>
            <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
              <span className="text-pink-400 font-bold">➜</span>
              <span className="text-cyan-400 font-bold">~</span>
              <span>whoami --verbose</span>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] p-6 rounded-lg flex flex-col sm:flex-row items-center gap-6">
              {imgurl && (
                <img 
                  src={imgurl} 
                  alt={d.name} 
                  className="w-28 h-28 rounded-lg object-cover border-2 border-emerald-400/50 shadow-lg"
                />
              )}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight mb-1">
                  {d.name || "Developer"}
                </h1>
                <p className="text-cyan-300 font-medium text-lg mb-2">
                  {d.profession || "Full Stack Software Engineer"} {d.location && <span className="text-gray-400 font-normal">@ {d.location}</span>}
                </p>
                {d.oneliner && (
                  <p className="text-gray-400 text-sm italic mb-4">
                    // "{d.oneliner}"
                  </p>
                )}

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
                  {d.linkedin && (
                    <a
                      href={d.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-cyan-400 text-xs border border-[#30363d] flex items-center gap-1.5 transition-colors"
                    >
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                  {d.email && (
                    <a
                      href={`mailto:${d.email}`}
                      className="px-3 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-emerald-400 text-xs border border-[#30363d] flex items-center gap-1.5 transition-colors"
                    >
                      <FaEnvelope /> {d.email}
                    </a>
                  )}
                  {(resumeFile || pdfUrl) && (
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-500/40 flex items-center gap-1.5 transition-colors"
                    >
                      <FaDownload /> Download Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {d.about && (
            <div>
              <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
                <span className="text-pink-400 font-bold">➜</span>
                <span className="text-cyan-400 font-bold">~</span>
                <span>cat bio.md</span>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-lg text-sm leading-relaxed text-gray-300">
                <span className="text-gray-500 select-none">01 | </span>
                {d.about}
              </div>
            </div>
          )}

          {/* Skills Command */}
          {d.skills && d.skills.length > 0 && (
            <div>
              <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
                <span className="text-pink-400 font-bold">➜</span>
                <span className="text-cyan-400 font-bold">~</span>
                <span>npm list --depth=0 core-skills</span>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-lg">
                <div className="text-xs text-gray-500 mb-3">└── installed dependencies ({d.skills.length} packages):</div>
                <div className="flex flex-wrap gap-2">
                  {d.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-[#21262d] border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 rounded text-xs transition-colors"
                    >
                      +{skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Command */}
          {d.projects && d.projects.length > 0 && (
            <div>
              <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
                <span className="text-pink-400 font-bold">➜</span>
                <span className="text-cyan-400 font-bold">~</span>
                <span>./deploy_projects.sh --all</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {d.projects.map((proj, i) => {
                  const title = Array.isArray(proj) ? proj[0] : (typeof proj === 'string' ? proj.split(':')[0] : `Project 0${i+1}`);
                  const desc = Array.isArray(proj) ? proj[1] : (typeof proj === 'string' && proj.includes(':') ? proj.split(':').slice(1).join(':') : proj);
                  return (
                    <div key={i} className="bg-[#0d1117] border border-[#30363d] hover:border-cyan-500/50 p-5 rounded-lg transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-pink-400 font-bold">📁 {title}</span>
                        <span className="text-[10px] text-gray-500 font-mono">v1.0.0</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {d.Experience && d.Experience.length > 0 && (
            <div>
              <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
                <span className="text-pink-400 font-bold">➜</span>
                <span className="text-cyan-400 font-bold">~</span>
                <span>git log --oneline experience/</span>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-lg space-y-3">
                {d.Experience.map((exp, i) => (
                  <div key={i} className="flex gap-3 text-xs leading-relaxed">
                    <span className="text-amber-400 select-none font-bold">commit_0{i+1}:</span>
                    <span className="text-gray-300">{typeof exp === 'object' ? JSON.stringify(exp) : exp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          {(d.education?.length > 0 || d.certifications?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {d.education?.length > 0 && (
                <div>
                  <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <span className="text-pink-400 font-bold">➜</span>
                    <span className="text-cyan-400 font-bold">~</span>
                    <span>cat credentials/education.txt</span>
                  </div>
                  <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg space-y-2 text-xs">
                    {d.education.map((edu, i) => (
                      <div key={i} className="text-gray-300">
                        🎓 {typeof edu === 'object' ? (Array.isArray(edu) ? edu.join(' · ') : JSON.stringify(edu)) : edu}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {d.certifications?.length > 0 && (
                <div>
                  <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
                    <span className="text-pink-400 font-bold">➜</span>
                    <span className="text-cyan-400 font-bold">~</span>
                    <span>cat credentials/certifications.txt</span>
                  </div>
                  <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg space-y-2 text-xs">
                    {d.certifications.map((cert, i) => (
                      <div key={i} className="text-gray-300">
                        🏆 {typeof cert === 'object' ? JSON.stringify(cert) : cert}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Terminal Prompt */}
          <div>
            <div className="text-emerald-400 text-sm mb-2 flex items-center gap-2">
              <span className="text-pink-400 font-bold">➜</span>
              <span className="text-cyan-400 font-bold">~</span>
              <span>ssh connect@{d.name?.toLowerCase().replace(/\s+/g, '') || 'dev'}.io</span>
            </div>
            <div className="bg-[#0d1117] border border-emerald-500/30 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-300 mb-4">
                Connection established. Reach out for new projects and career opportunities:
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {d.email && (
                  <a 
                    href={`mailto:${d.email}`} 
                    className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-colors"
                  >
                    Send Email ({d.email})
                  </a>
                )}
                {d.phone && (
                  <span className="px-4 py-2 rounded bg-[#21262d] border border-[#30363d] text-gray-300 text-xs">
                    Phone: {d.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom cursor */}
          <div className="pt-4 text-xs text-gray-500 flex items-center gap-2">
            <span>user@system:~$</span>
            <span className="w-2.5 h-4 bg-emerald-400 inline-block animate-pulse"></span>
          </div>

        </div>
      </div>
    </div>
  );
}
