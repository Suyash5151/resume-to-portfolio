import React from "react";
import { FaGraduationCap } from 'react-icons/fa';
import { cleanItemText } from '../utils/normalizeData';

function parseEducationItem(edu) {
  if (Array.isArray(edu)) {
    // If it's a character array, heal it
    if (edu.length > 2 && edu.every(ch => typeof ch === 'string' && ch.length <= 1)) {
      return { degree: edu.join(''), institution: '', year: '', grade: '' };
    }
    // If it's fields array e.g. [Degree, School, Year, Grade]
    return {
      degree: cleanItemText(edu[0]) || 'Degree',
      institution: cleanItemText(edu[1]) || '',
      year: cleanItemText(edu[2]) || '',
      grade: cleanItemText(edu[3]) || cleanItemText(edu[4]) || ''
    };
  }
  if (typeof edu === 'object' && edu !== null) {
    return {
      degree: cleanItemText(edu.degree || edu.title || edu.course) || 'Degree',
      institution: cleanItemText(edu.school || edu.college || edu.institution || edu.university) || '',
      year: cleanItemText(edu.year || edu.duration || edu.batch) || '',
      grade: cleanItemText(edu.grade || edu.marks || edu.score || edu.gpa) || ''
    };
  }
  if (typeof edu === 'string') {
    const cleaned = cleanItemText(edu);
    // Split by distinct delimiters like | or @ if present, otherwise display as is
    if (cleaned.includes('|')) {
      const parts = cleaned.split('|');
      return {
        degree: parts[0].trim(),
        institution: parts.slice(1).join(' | ').trim(),
        year: '',
        grade: ''
      };
    }
    return {
      degree: cleaned,
      institution: '',
      year: '',
      grade: ''
    };
  }
  return { degree: cleanItemText(edu), institution: '', year: '', grade: '' };
}

function Education({ data }) {
  if (!data?.education || data.education.length === 0) return null;

  return (
    <section id="education" className="py-20 px-6 md:px-20 flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        My <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Education</span>
      </h2>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.education.map((rawEdu, idx) => {
          const { degree, institution, year, grade } = parseEducationItem(rawEdu);
          if (!degree && !institution) return null;
          return (
            <div 
              key={idx}
              className="bg-gray-900/90 border border-gray-800 hover:border-fuchsia-500/50 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="p-3.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 mb-4">
                <FaGraduationCap className="text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">{degree}</h3>
              {institution && <p className="text-gray-300 text-sm mb-1 leading-relaxed">{institution}</p>}
              {year && <p className="text-gray-400 text-xs mt-1 font-mono">{year}</p>}
              {grade && (
                <p className="text-xs font-bold text-orange-400 mt-2 bg-orange-400/10 border border-orange-400/30 px-3 py-1 rounded-full">
                  {grade}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Education;