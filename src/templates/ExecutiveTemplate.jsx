import React from 'react';
import { 
  FaBriefcase, 
  FaGraduationCap, 
  FaAward, 
  FaCode, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaDownload,
  FaShareAlt,
  FaEdit
} from 'react-icons/fa';

export default function ExecutiveTemplate({
  resumeData,
  imgurl,
  pdfUrl,
  resumeFile,
  onOpenShare,
  onOpenEditor,
  onOpenAts
}) {
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
      alert("No PDF resume available to download.");
    }
  };

  return (
    <div className="executive-template bg-[#0f172a] text-slate-100 min-h-screen py-10 px-4 sm:px-8 selection:bg-amber-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Executive Header Banner */}
        <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-500"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {imgurl ? (
                <img 
                  src={imgurl} 
                  alt={d.name} 
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-amber-400/40 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl font-serif text-amber-400 font-bold">
                  {d.name ? d.name.charAt(0) : 'E'}
                </div>
              )}

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Executive Profile</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {d.name || "Executive Leader"}
                </h1>
                <p className="text-lg text-sky-400 font-medium mt-1">
                  {d.profession || "Senior Technology Professional"}
                </p>
                {d.location && (
                  <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <FaMapMarkerAlt className="text-xs text-slate-500" /> {d.location}
                  </p>
                )}
                {d.oneliner && (
                  <p className="text-sm text-slate-300 italic mt-3 max-w-xl">
                    "{d.oneliner}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap md:flex-col gap-2.5 w-full md:w-auto justify-center">
              {d.linkedin && (
                <a
                  href={d.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <FaLinkedin /> Connect on LinkedIn
                </a>
              )}
              {(resumeFile || pdfUrl) && (
                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 font-medium text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FaDownload /> Download Resume
                </button>
              )}
              {onOpenShare && (
                <button
                  onClick={onOpenShare}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FaShareAlt /> Share Portfolio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (1/3): Skills, Contact, Education */}
          <div className="space-y-8">
            
            {/* Core Competencies */}
            {d.skills && d.skills.length > 0 && (
              <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-6 shadow-md">
                <h3 className="text-base font-serif font-bold text-amber-400 flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <FaCode className="text-sm" /> Core Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {d.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {d.education && d.education.length > 0 && (
              <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-6 shadow-md">
                <h3 className="text-base font-serif font-bold text-amber-400 flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <FaGraduationCap className="text-sm" /> Education & Academic Credentials
                </h3>
                <div className="space-y-4 text-xs">
                  {d.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <p className="font-semibold text-slate-200">
                        {typeof edu === 'object' ? (Array.isArray(edu) ? edu.join(' · ') : JSON.stringify(edu)) : edu}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {d.certifications && d.certifications.length > 0 && (
              <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-6 shadow-md">
                <h3 className="text-base font-serif font-bold text-amber-400 flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <FaAward className="text-sm" /> Certifications & Accreditations
                </h3>
                <div className="space-y-3 text-xs">
                  {d.certifications.map((cert, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-slate-300">
                      🏅 {typeof cert === 'object' ? JSON.stringify(cert) : cert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-6 shadow-md text-xs space-y-3">
              <h3 className="text-base font-serif font-bold text-amber-400 mb-4 pb-2 border-b border-slate-700">
                Direct Contact
              </h3>
              {d.email && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <FaEnvelope className="text-sky-400" />
                  <a href={`mailto:${d.email}`} className="hover:underline truncate">{d.email}</a>
                </div>
              )}
              {d.phone && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <FaPhone className="text-sky-400" />
                  <span>{d.phone}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (2/3): Executive Summary, Experience, Projects */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Executive Summary */}
            {d.about && (
              <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-8 shadow-md">
                <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2.5">
                  <span className="w-2.5 h-6 bg-amber-400 rounded-sm"></span>
                  Executive Summary
                </h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {d.about}
                </p>
              </div>
            )}

            {/* Professional Experience */}
            {d.Experience && d.Experience.length > 0 && (
              <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-8 shadow-md">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2.5">
                  <FaBriefcase className="text-amber-400 text-lg" />
                  Career History & Engagements
                </h2>
                <div className="space-y-6 relative border-l-2 border-slate-700 ml-3 pl-6">
                  {d.Experience.map((exp, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-400 group-hover:bg-amber-400 transition-colors"></div>
                      <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-colors">
                        <p className="text-slate-200 text-sm leading-relaxed font-medium">
                          {typeof exp === 'object' ? JSON.stringify(exp) : exp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Projects & Initiatives */}
            {d.projects && d.projects.length > 0 && (
              <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl p-8 shadow-md">
                <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2.5">
                  <span className="w-2.5 h-6 bg-sky-400 rounded-sm"></span>
                  Key Projects & Technical Deliverables
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {d.projects.map((proj, idx) => {
                    const title = Array.isArray(proj) ? proj[0] : (typeof proj === 'string' ? proj.split(':')[0] : `Project 0${idx+1}`);
                    const desc = Array.isArray(proj) ? proj[1] : (typeof proj === 'string' && proj.includes(':') ? proj.split(':').slice(1).join(':') : proj);
                    return (
                      <div key={idx} className="p-5 bg-slate-800/70 border border-slate-700/80 rounded-xl hover:border-sky-400/50 transition-all">
                        <h4 className="text-sm font-serif font-bold text-white mb-2">{title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
          Executive Portfolio · Verified Profile of {d.name || 'Candidate'}
        </footer>

      </div>
    </div>
  );
}
