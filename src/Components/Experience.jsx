import React from "react";
import { FaBriefcase } from 'react-icons/fa';

function Experience({ data }) {
  if (!data.Experience || data.Experience.length === 0) return null;

  return (
    <section id="experience" className="py-16 px-6 md:px-20 flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        Work <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Experience</span>
      </h2>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.Experience.map((exp, idx) => (
          <div
            key={idx}
            className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-start text-left transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 w-full mb-3">
              <FaBriefcase className="text-3xl text-fuchsia-400 flex-shrink-0" />
              <h3 className="text-xl font-semibold text-white">{exp[0]}</h3>
            </div>
            <p className="text-lg text-gray-300 ml-11">{exp[1]}</p>
            <p className="text-sm text-orange-400 font-mono ml-11 mt-1">{exp[2]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;