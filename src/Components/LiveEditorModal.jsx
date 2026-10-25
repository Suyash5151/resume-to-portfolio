import React, { useState } from 'react';
import { 
  FaTimes, 
  FaSave, 
  FaPlus, 
  FaTrash, 
  FaMagic, 
  FaUser, 
  FaCode, 
  FaBriefcase, 
  FaRocket, 
  FaGraduationCap,
  FaSpinner
} from 'react-icons/fa';
import { enhanceText } from '../services/api';

export default function LiveEditorModal({ isOpen, onClose, resumeData, onSave }) {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(resumeData || {})));
  const [activeTab, setActiveTab] = useState('profile');
  const [newSkill, setNewSkill] = useState('');
  const [enhancingIndex, setEnhancingIndex] = useState(null); // string or number to track loading item

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!newSkill.trim()) return;
    const skills = Array.isArray(data.skills) ? [...data.skills] : [];
    if (!skills.includes(newSkill.trim())) {
      skills.push(newSkill.trim());
      handleFieldChange('skills', skills);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (indexToRemove) => {
    const skills = (data.skills || []).filter((_, idx) => idx !== indexToRemove);
    handleFieldChange('skills', skills);
  };

  // Experience handlers
  const handleExperienceChange = (idx, value) => {
    const list = [...(data.Experience || [])];
    list[idx] = value;
    handleFieldChange('Experience', list);
  };

  const handleAddExperience = () => {
    const list = [...(data.Experience || []), "Software Engineer @ Tech Corp (2023 - Present): Engineered scalable full-stack features."];
    handleFieldChange('Experience', list);
  };

  const handleRemoveExperience = (idx) => {
    const list = (data.Experience || []).filter((_, i) => i !== idx);
    handleFieldChange('Experience', list);
  };

  // Projects handlers
  const handleProjectChange = (idx, field, value) => {
    const list = [...(data.projects || [])];
    let curr = list[idx];
    if (Array.isArray(curr)) {
      const updated = [...curr];
      if (field === 'title') updated[0] = value;
      if (field === 'desc') updated[1] = value;
      list[idx] = updated;
    } else if (typeof curr === 'string') {
      const parts = curr.split(':');
      if (field === 'title') list[idx] = `${value}: ${parts.slice(1).join(':') || ''}`;
      if (field === 'desc') list[idx] = `${parts[0] || 'Project'}: ${value}`;
    }
    handleFieldChange('projects', list);
  };

  const handleAddProject = () => {
    const list = [...(data.projects || []), ["New Project", "Built an AI-powered interactive application with modern UI."]];
    handleFieldChange('projects', list);
  };

  const handleRemoveProject = (idx) => {
    const list = (data.projects || []).filter((_, i) => i !== idx);
    handleFieldChange('projects', list);
  };

  // AI Enhancer
  const handleAiEnhance = async (text, targetType, targetIdx, mode = 'star') => {
    if (!text || !text.trim()) return;
    setEnhancingIndex(`${targetType}-${targetIdx}`);
    try {
      const improved = await enhanceText(text, mode);
      if (targetType === 'about') {
        handleFieldChange('about', improved);
      } else if (targetType === 'oneliner') {
        handleFieldChange('oneliner', improved);
      } else if (targetType === 'experience') {
        handleExperienceChange(targetIdx, improved);
      } else if (targetType === 'project-desc') {
        handleProjectChange(targetIdx, 'desc', improved);
      }
    } catch (err) {
      alert(`AI enhancement failed: ${err.message}`);
    } finally {
      setEnhancingIndex(null);
    }
  };

  const handleSaveAndClose = () => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border border-gray-700/80 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden text-gray-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="p-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-sm">
                ✍️
              </span>
              Interactive Live Editor
            </h2>
            <p className="text-xs text-gray-400">Edit resume fields, reorder sections, and polish bullet points with AI</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndClose}
              className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-fuchsia-500/20"
            >
              <FaSave /> Save Changes
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-gray-800 bg-gray-950/40 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile & Bio', icon: FaUser },
            { id: 'skills', label: 'Skills', icon: FaCode },
            { id: 'experience', label: 'Experience', icon: FaBriefcase },
            { id: 'projects', label: 'Projects', icon: FaRocket },
            { id: 'education', label: 'Education & Certs', icon: FaGraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  active 
                    ? 'border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/10' 
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: Profile & Bio */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={data.profession || ''}
                    onChange={(e) => handleFieldChange('profession', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    value={data.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={data.linkedin || ''}
                    onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={data.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tagline with AI button */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Punchy Tagline / One-Liner</label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance(data.oneliner || data.profession, 'oneliner', 0, 'concise')}
                    disabled={enhancingIndex === 'oneliner-0'}
                    className="text-xs text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 font-medium disabled:opacity-50"
                  >
                    {enhancingIndex === 'oneliner-0' ? <FaSpinner className="animate-spin" /> : <FaMagic />} AI Polish
                  </button>
                </div>
                <input
                  type="text"
                  value={data.oneliner || ''}
                  onChange={(e) => handleFieldChange('oneliner', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                  placeholder="e.g. Building scalable high-performance full stack web systems."
                />
              </div>

              {/* About Me with AI STAR Rewrite */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">About Me / Summary</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAiEnhance(data.about, 'about', 0, 'impactful')}
                      disabled={enhancingIndex === 'about-0'}
                      className="text-xs text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 font-medium disabled:opacity-50"
                    >
                      {enhancingIndex === 'about-0' ? <FaSpinner className="animate-spin" /> : <FaMagic />} Make Impactful
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={data.about || ''}
                  onChange={(e) => handleFieldChange('about', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-fuchsia-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleAddSkill} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add a new skill (e.g. Docker, TypeScript, Microservices)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <FaPlus /> Add Skill
                </button>
              </form>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Current Skills ({data.skills?.length || 0})
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(data.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-sm font-medium hover:border-fuchsia-500 group transition-all"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove skill"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Experience Items</h3>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-semibold text-fuchsia-400 flex items-center gap-1"
                >
                  <FaPlus /> Add Role
                </button>
              </div>

              <div className="space-y-4">
                {(data.Experience || []).map((exp, idx) => {
                  const expText = typeof exp === 'object' ? JSON.stringify(exp) : exp;
                  const isEnhancing = enhancingIndex === `experience-${idx}`;
                  return (
                    <div key={idx} className="p-4 bg-gray-800/80 border border-gray-700 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-fuchsia-400 font-bold">Role 0{idx + 1}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAiEnhance(expText, 'experience', idx, 'star')}
                            disabled={isEnhancing}
                            className="text-xs text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 font-medium disabled:opacity-50"
                          >
                            {isEnhancing ? <FaSpinner className="animate-spin" /> : <FaMagic />} STAR Rewrite
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(idx)}
                            className="text-gray-500 hover:text-red-400 text-xs"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        value={expText}
                        onChange={(e) => handleExperienceChange(idx, e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700/80 rounded-lg p-2.5 text-xs text-gray-200 focus:border-fuchsia-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Project Portfolio</h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-semibold text-fuchsia-400 flex items-center gap-1"
                >
                  <FaPlus /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {(data.projects || []).map((proj, idx) => {
                  const title = Array.isArray(proj) ? proj[0] : (typeof proj === 'string' ? proj.split(':')[0] : `Project ${idx+1}`);
                  const desc = Array.isArray(proj) ? proj[1] : (typeof proj === 'string' && proj.includes(':') ? proj.split(':').slice(1).join(':') : proj);
                  const isEnhancing = enhancingIndex === `project-desc-${idx}`;

                  return (
                    <div key={idx} className="p-4 bg-gray-800/80 border border-gray-700 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-fuchsia-400 font-bold">Project 0{idx + 1}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAiEnhance(desc, 'project-desc', idx, 'star')}
                            disabled={isEnhancing}
                            className="text-xs text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 font-medium disabled:opacity-50"
                          >
                            {isEnhancing ? <FaSpinner className="animate-spin" /> : <FaMagic />} Enhance Impact
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            className="text-gray-500 hover:text-red-400 text-xs"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={title || ''}
                          onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-gray-100 font-semibold focus:border-fuchsia-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Project Description & Outcomes</label>
                        <textarea
                          rows={3}
                          value={desc || ''}
                          onChange={(e) => handleProjectChange(idx, 'desc', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-gray-300 focus:border-fuchsia-500 focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Education & Certifications */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Education
                </label>
                <div className="space-y-2">
                  {(data.education || []).map((edu, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={typeof edu === 'object' ? (Array.isArray(edu) ? edu.join(' · ') : JSON.stringify(edu)) : edu}
                      onChange={(e) => {
                        const list = [...(data.education || [])];
                        list[idx] = e.target.value;
                        handleFieldChange('education', list);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-xs text-gray-200 focus:border-fuchsia-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Certifications & Honors
                </label>
                <div className="space-y-2">
                  {(data.certifications || []).map((cert, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={typeof cert === 'object' ? JSON.stringify(cert) : cert}
                      onChange={(e) => {
                        const list = [...(data.certifications || [])];
                        list[idx] = e.target.value;
                        handleFieldChange('certifications', list);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-xs text-gray-200 focus:border-fuchsia-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
