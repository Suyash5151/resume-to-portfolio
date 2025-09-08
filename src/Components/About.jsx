// src/pages/AboutMe.jsx
import React from 'react';

export default function AboutMe({ sharedValue, data }) {
  const skills = [
    { name: 'HTML & CSS', value: 90 },
    { name: 'React JS', value: 95 },
    { name: 'JavaScript', value: 88 },
    { name: 'Next JS', value: 85 },
  ];

  return (
    <div id="about" className="bg-black text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-10 min-h-screen">
      {/* Left: Profile Image */}
      <div>
        <img
          src={sharedValue || '/emptyuser.webp'}
          alt="About Me"
          className="rounded-xl w-72 h-80 object-cover shadow-lg"
        />
      </div>

      {/* Right: Text + Skills */}
      <div className="max-w-xl">
        <h2 className="text-4xl font-bold mb-6">
          About <span className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-transparent bg-clip-text">me</span>
        </h2>

        {data && data.about && (
          <p className="text-gray-300 mb-4 leading-relaxed">
            {data.about}
          </p>
        )}
        

     
      </div>
    </div>
  );
}
