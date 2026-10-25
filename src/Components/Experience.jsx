import React from "react";
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { cleanItemText } from '../utils/normalizeData';

function parseExperienceItem(exp) {
  if (Array.isArray(exp)) {
    // If it's a character array
    if (exp.length > 2 && exp.every(ch => typeof ch === 'string' && ch.length <= 1)) {
      return { title: exp.join(''), company: '', period: '' };
    }
    return {
      title: cleanItemText(exp[0]) || 'Role',
      company: cleanItemText(exp[1]) || '',
      period: cleanItemText(exp[2]) || ''
    };
  }
  if (typeof exp === 'object' && exp !== null) {
    return {
      title: cleanItemText(exp.title || exp.role || exp.jobTitle) || 'Role',
      company: cleanItemText(exp.company || exp.organization || exp.description) || '',
      period: cleanItemText(exp.period || exp.year || exp.duration || exp.dates) || ''
    };
  }
  if (typeof exp === 'string') {
    const cleaned = cleanItemText(exp);
    const atSplit = cleaned.split('@');
    if (atSplit.length > 1) {
      return {
        title: atSplit[0].trim(),
        company: atSplit.slice(1).join('@').trim(),
        period: ''
      };
    }
    const colonSplit = cleaned.split(':');
    if (colonSplit.length > 1) {
      return {
        title: colonSplit[0].trim(),
        company: colonSplit.slice(1).join(':').trim(),
        period: ''
      };
    }
    return {
      title: cleaned,
      company: '',
      period: ''
    };
  }
  return { title: cleanItemText(exp), company: '', period: '' };
}

function Experience({ data }) {
  if (!data?.Experience || data.Experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 px-6 md:px-20 flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
        Work <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Experience</span>
      </h2>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.Experience.map((rawExp, idx) => {
          const { title, company, period } = parseExperienceItem(rawExp);
          if (!title && !company) return null;
          return (
            <div
              key={idx}
              className="bg-gray-900/90 border border-gray-800 hover:border-fuchsia-500/50 rounded-2xl shadow-xl p-6 flex flex-col justify-between text-left transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <div>
                <div className="flex items-start gap-4 w-full mb-3">
                  <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 flex-shrink-0">
                    <FaBriefcase className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
                    {period && (
                      <span className="text-xs text-orange-400 font-mono flex items-center gap-1 mt-1">
                        <FaCalendarAlt className="text-[10px]" /> {period}
                      </span>
                    )}
                  </div>
                </div>
                {company && (
                  <p className="text-sm text-gray-300 leading-relaxed pl-1 mt-2">
                    {company}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Experience;