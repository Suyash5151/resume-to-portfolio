import React, { useState, useEffect } from 'react';
import './App.css'; 
import Landing from './Components/Landing';
import Navbar from './Components/navbar';
import Navbar2 from './Components/navbar2';
import Footer from './Components/footer';
import ResumeInp from './Components/ResumeInp';
import Projects from './Components/projects';
import Skills from './Components/skills';
import Certification from './Components/Certifications';
import Education from './Components/Education';
import Experience from './Components/Experience';
import AboutMe from './Components/About';
import Contact from './Components/Contact';

function App() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [imgurl, setImgurl] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [resumeFile, setResumeFile] = useState(null); // Add this for storing the actual file

  const handlePdfUrl = (url) => setPdfUrl(url);
  const handleResumeFile = (file) => setResumeFile(file); // Add this handler

  const handleTogglePage = (value) => {
    setShowPortfolio(value);
  };
  
  const themes = ["light","dark","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk","autumn","business","acid","lemonade","night","coffee","winter","dim","nord","sunset"];

  const applyRandomTheme = () => {
    const random = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.setAttribute('data-theme', 'black'); // Fixed the typo
  };

  useEffect(() => {
    console.log("showPortfolio:", showPortfolio);
  }, [showPortfolio]);

  useEffect(() => {
    if (window.location.hash) {
      window.location.hash = "";
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showPortfolio]);

  return (
    <div className="App font-sans">
      {!showPortfolio ? (
        <div>
          <Navbar2/>
          <ResumeInp 
            onComplete={handleTogglePage} 
            onSendValue={setImgurl} 
            onSendJSON={setResumeData} 
            onSendPdfUrl={handlePdfUrl}
            onSendResumeFile={handleResumeFile} // Add this prop
          />
          <Footer/>
        </div>
      ) : (
        <div>
          <Navbar user={resumeData} data={resumeData}/>
          <Landing 
            id="landing" 
            sharedValue={imgurl} 
            data={resumeData} 
            pdfUrl={pdfUrl}
            resumeFile={resumeFile} // Pass the file as well
          />
          <AboutMe data={resumeData} sharedValue={imgurl}/>
          {resumeData?.Experience?.length > 0 && <Experience id="experience" data={resumeData} />}
          {resumeData?.education?.length > 0 && <Education id="education" data={resumeData} />}
          {resumeData?.projects?.length > 0 && <Projects id="projects" data={resumeData} />}
          {resumeData?.skills?.length > 0 && <Skills id="skills" data={resumeData} />}
          {resumeData?.certifications?.length > 0 && <Certification id="certification" data={resumeData} />}
          <Contact data={resumeData}/>
        </div>
      )}
    </div>
  );
}

export default App;
