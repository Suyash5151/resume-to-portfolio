import React from 'react';
import Landing from '../Components/Landing';
import AboutMe from '../Components/About';
import Experience from '../Components/Experience';
import Education from '../Components/Education';
import Projects from '../Components/projects';
import Skills from '../Components/skills';
import Certification from '../Components/Certifications';
import Contact from '../Components/Contact';

export default function ModernTemplate({
  resumeData,
  imgurl,
  pdfUrl,
  resumeFile,
  onOpenShare,
  onOpenEditor,
  onOpenAts
}) {
  return (
    <div className="modern-template bg-black text-white min-h-screen">
      <Landing
        id="landing"
        sharedValue={imgurl}
        data={resumeData}
        pdfUrl={pdfUrl}
        resumeFile={resumeFile}
        onOpenShare={onOpenShare}
      />
      <AboutMe data={resumeData} sharedValue={imgurl} />
      {resumeData?.Experience?.length > 0 && <Experience id="experience" data={resumeData} />}
      {resumeData?.education?.length > 0 && <Education id="education" data={resumeData} />}
      {resumeData?.projects?.length > 0 && <Projects id="projects" data={resumeData} />}
      {resumeData?.skills?.length > 0 && <Skills id="skills" data={resumeData} />}
      {resumeData?.certifications?.length > 0 && <Certification id="certification" data={resumeData} />}
      <Contact data={resumeData} />
    </div>
  );
}
