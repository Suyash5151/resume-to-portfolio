import React from "react";
import { FaFolderOpen, FaRocket } from 'react-icons/fa';
import { cleanItemText } from '../utils/normalizeData';

function parseProjectItem(project, idx) {
  if (Array.isArray(project)) {
    // If it's a character array
    if (project.length > 2 && project.every(ch => typeof ch === 'string' && ch.length <= 1)) {
      return { title: project.join(''), desc: '' };
    }
    return {
      title: cleanItemText(project[0]) || `Project 0${idx + 1}`,
      desc: cleanItemText(project[1]) || ''
    };
  }
  if (typeof project === 'object' && project !== null) {
    return {
      title: cleanItemText(project.title || project.name) || `Project 0${idx + 1}`,
      desc: cleanItemText(project.description || project.desc) || ''
    };
  }
  if (typeof project === 'string') {
    const cleaned = cleanItemText(project);
    const colonSplit = cleaned.split(':');
    if (colonSplit.length > 1) {
      return {
        title: colonSplit[0].trim(),
        desc: colonSplit.slice(1).join(':').trim()
      };
    }
    const dashSplit = cleaned.split(' - ');
    if (dashSplit.length > 1) {
      return {
        title: dashSplit[0].trim(),
        desc: dashSplit.slice(1).join(' - ').trim()
      };
    }
    return {
      title: cleaned,
      desc: ''
    };
  }
  return { title: `Project 0${idx + 1}`, desc: cleanItemText(project) };
}

function Projects({ data }) {
  if (!data?.projects || data.projects.length === 0) return null;

  return (
    <section id="projects" className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-6">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        My <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Projects</span>
      </h2>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.projects.map((rawProject, idx) => {
          const { title, desc } = parseProjectItem(rawProject, idx);
          if (!title && !desc) return null;
          return (
            <div
              key={idx}
              className="bg-gray-900/90 border border-gray-800 hover:border-fuchsia-500/50 rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl group"
            >
              <div>
                <div className="flex items-center gap-3.5 w-full mb-4">
                  <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 group-hover:scale-110 transition-transform">
                    <FaFolderOpen className="text-2xl" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-fuchsia-400 font-bold uppercase tracking-wider">
                      PROJECT // 0{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                      {title}
                    </h3>
                  </div>
                </div>
                
                {desc && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {desc}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
                <span className="font-mono">Status: Completed</span>
                <span className="text-fuchsia-400 font-semibold flex items-center gap-1">
                  <FaRocket className="text-[10px]" /> Featured
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
