import React from "react";
import { FaCertificate } from 'react-icons/fa';

function Certification({ data }) {
  if (!data.certifications || data.certifications.length === 0) return null;

  return (
    <section id="certifications" className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-16 px-6">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        My <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Certifications</span>
      </h2>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.certifications.map((cert, idx) => (
          <div
            key={idx}
            className="bg-gray-900 rounded-xl shadow-lg p-6 flex items-center gap-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <FaCertificate className="text-3xl text-orange-400 flex-shrink-0" />
            <span className="text-lg font-medium text-white">{cert.name || cert}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Certification;
