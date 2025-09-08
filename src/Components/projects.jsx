import React from "react";
import { FaExternalLinkAlt,FaCertificate,FaFolderOpen  } from 'react-icons/fa';


function Projects({ data }) {
  if (!data.projects || data.projects.length === 0) return null;

  return (
    <section id="projects" className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-16 px-6">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        My <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Projects</span>
      </h2>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.projects.map((project, idx) => (
          <div
            key={idx}
            className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div>
              <div className="flex items-center gap-4 w-full mb-3">
                <FaFolderOpen className="text-3xl text-fuchsia-400 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-white mb-2">{project[0]|| "Project Title"}</h3>
              </div>
              
              
              <p className="text-gray-400 text-sm mb-4">{project[1] || "No description available."}</p>
            </div>
           
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
