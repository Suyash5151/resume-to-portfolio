import React from "react";
import { FaGraduationCap } from 'react-icons/fa';

function Education({ data }) {
  if (!data.education || data.education.length === 0) return null;

  return (
    <section id="education" className="py-16 px-6 md:px-20 flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        My <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Education</span>
      </h2>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {data.education.map((edu, idx) => (
          <div 
            key={idx}
            className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <FaGraduationCap className="text-4xl text-fuchsia-400 mb-4" />
            <h3 className="text-xl font-semibold text-white">{edu[0]}</h3>
            <p className="text-gray-400 mt-1">{edu[1]}</p>
            <p className="text-gray-400 mt-1">{edu[2]}</p>
             <p className="text-gray-400 mt-1">{edu[4]}</p>
            <p className="text-lg font-bold text-orange-400 mt-2">{edu[3]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Education;