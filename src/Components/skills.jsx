import React from "react";

function Skills({ data }) {
  if (!data.skills || data.skills.length === 0) return null;

  return (
    <section id="skills" className="py-16 px-6 md:px-20 min-h-screen bg-black text-white">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">My<span className="ml-2 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Skills</span></h2>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {data.skills.map((skill, idx) => (
          <span
            key={idx}
            className="flex items-center justify-center px-5 py-3 bg-black rounded-xl shadow-lg text-lg font-semibold transition-all duration-200 cursor-pointer hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-orange-400 hover:scale-110 hover:text-black"
            tabIndex={0}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Skills;
