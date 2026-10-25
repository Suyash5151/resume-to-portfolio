import React from 'react';
import ModernTemplate from './ModernTemplate';
import TerminalTemplate from './TerminalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Glassmorphic',
    tagline: 'Vibrant gradients, glass cards, and smooth animations',
    accentColor: 'from-fuchsia-500 to-pink-500',
    component: ModernTemplate
  },
  {
    id: 'terminal',
    name: 'Hacker / Terminal CLI',
    tagline: 'Monospace, bash command prompts, and retro aesthetics',
    accentColor: 'from-emerald-500 to-cyan-500',
    component: TerminalTemplate
  },
  {
    id: 'executive',
    name: 'Corporate Executive',
    tagline: 'Refined typography, timeline milestones, and clean consulting layout',
    accentColor: 'from-amber-400 to-sky-500',
    component: ExecutiveTemplate
  }
];

export default function TemplateRenderer({
  templateId = 'modern',
  resumeData,
  imgurl,
  pdfUrl,
  resumeFile,
  onOpenShare,
  onOpenEditor,
  onOpenAts
}) {
  const selected = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const ComponentToRender = selected.component;

  return (
    <ComponentToRender
      resumeData={resumeData}
      imgurl={imgurl}
      pdfUrl={pdfUrl}
      resumeFile={resumeFile}
      onOpenShare={onOpenShare}
      onOpenEditor={onOpenEditor}
      onOpenAts={onOpenAts}
    />
  );
}
