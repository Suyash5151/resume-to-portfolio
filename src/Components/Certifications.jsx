import React from "react";
import { FaCertificate } from 'react-icons/fa';

function Certification({ data }) {
  if (!data?.certifications || data.certifications.length === 0) return null;

  return (
    <section id="certifications" className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-20 px-6">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        My <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Certifications</span>
      </h2>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.certifications.map((rawCert, idx) => {
          let certTitle = '';
          if (typeof rawCert === 'string') {
            certTitle = rawCert;
          } else if (Array.isArray(rawCert)) {
            certTitle = rawCert.join(' - ');
          } else if (typeof rawCert === 'object' && rawCert !== null) {
            certTitle = rawCert.name || rawCert.title || JSON.stringify(rawCert);
          }
          return (
            <div
              key={idx}
              className="bg-gray-900/90 border border-gray-800 hover:border-orange-400/50 rounded-2xl shadow-xl p-5 flex items-center gap-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="p-3 rounded-xl bg-orange-400/10 border border-orange-400/30 text-orange-400 flex-shrink-0">
                <FaCertificate className="text-2xl" />
              </div>
              <span className="text-base font-medium text-white leading-snug">{certTitle}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Certification;
