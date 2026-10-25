import React, { useState, useEffect } from 'react';
import './App.css'; 
import Navbar from './Components/navbar';
import Navbar2 from './Components/navbar2';
import Footer from './Components/footer';
import ResumeInp from './Components/ResumeInp';
import ShareModal from './Components/ShareModal';
import LiveEditorModal from './Components/LiveEditorModal';
import AtsModal from './Components/AtsModal';
import TemplateRenderer from './templates/TemplateRenderer';
import { encodePortfolioData, decodePortfolioData } from './utils/shareUtils';
import { exportStandaloneHtmlFile, exportToJson, importFromJson } from './utils/exportUtils';
import { fetchSharedPortfolio } from './services/api';
import { normalizeResumeData } from './utils/normalizeData';
import { 
  savePortfolioToStorage, 
  loadPortfolioFromStorage, 
  saveSelectedTemplate, 
  loadSelectedTemplate 
} from './utils/storage';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [imgurl, setImgurl] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(() => loadSelectedTemplate());
  
  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handlePdfUrl = (url) => setPdfUrl(url);
  const handleResumeFile = (file) => setResumeFile(file);

  const handleTogglePage = (value) => {
    setShowPortfolio(value);
  };

  // 1. Initial Mount: Check Short Share ID (?s=...), Compressed URL (?p=...), or LocalStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // A. Check for Short Share ID (e.g. ?s=3ed1b3 or #s=3ed1b3)
    const shortId = urlParams.get('s') || (window.location.hash.startsWith('#s=') ? window.location.hash.replace('#s=', '') : null);
    if (shortId) {
      fetchSharedPortfolio(shortId).then(res => {
        if (res && res.resumeData) {
          setResumeData(normalizeResumeData(res.resumeData));
          if (res.imgurl) setImgurl(res.imgurl);
          if (res.selectedTemplate) setSelectedTemplate(res.selectedTemplate);
          setShowPortfolio(true);
          setIsSharedView(true);
          console.log("Loaded portfolio from Short Share ID successfully!");
        }
      }).catch(err => console.error('Failed to load short share:', err));
      return;
    }

    // B. Check for Compressed Parameter (?p=... or #p=...)
    const paramData = urlParams.get('p') || urlParams.get('data');
    let hashData = null;
    if (!paramData && window.location.hash.startsWith('#p=')) {
      hashData = window.location.hash.replace('#p=', '');
    }

    const dataToDecode = paramData || hashData;
    if (dataToDecode) {
      const decoded = decodePortfolioData(dataToDecode);
      if (decoded && decoded.resumeData) {
        setResumeData(normalizeResumeData(decoded.resumeData));
        if (decoded.imgurl) setImgurl(decoded.imgurl);
        setShowPortfolio(true);
        setIsSharedView(true);
        console.log("Loaded portfolio from compressed shareable URL successfully!");
        return;
      }
    }

    // Otherwise check LocalStorage for cached draft
    const saved = loadPortfolioFromStorage();
    if (saved && saved.resumeData) {
      setResumeData(normalizeResumeData(saved.resumeData));
      if (saved.imgurl) setImgurl(saved.imgurl);
      if (saved.selectedTemplate) setSelectedTemplate(saved.selectedTemplate);
    }
  }, []);

  // 2. Auto-save to LocalStorage whenever portfolio changes (unless in shared preview mode)
  useEffect(() => {
    if (resumeData && !isSharedView) {
      savePortfolioToStorage(resumeData, imgurl, selectedTemplate);
    }
  }, [resumeData, imgurl, selectedTemplate, isSharedView]);

  // 3. Update shareable link whenever resumeData or imgurl changes
  useEffect(() => {
    if (resumeData) {
      const generatedLink = encodePortfolioData(resumeData, imgurl);
      if (generatedLink) {
        setShareUrl(generatedLink);
      }
    }
  }, [resumeData, imgurl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showPortfolio]);

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    saveSelectedTemplate(templateId);
  };

  const handleSaveEditedData = (updatedData) => {
    setResumeData(normalizeResumeData(updatedData));
  };

  const handleExportHtml = () => {
    if (!resumeData) {
      alert('Please generate a portfolio first.');
      return;
    }
    exportStandaloneHtmlFile(resumeData, imgurl, selectedTemplate);
  };

  const handleExportJson = () => {
    if (!resumeData) {
      alert('No portfolio data to export.');
      return;
    }
    exportToJson({ resumeData, imgurl, selectedTemplate }, `${(resumeData?.name || 'portfolio').toLowerCase().replace(/\s+/g, '_')}_config.json`);
  };

  const handleImportJson = async (file) => {
    try {
      const imported = await importFromJson(file);
      if (imported.resumeData) {
        setResumeData(normalizeResumeData(imported.resumeData));
        if (imported.imgurl) setImgurl(imported.imgurl);
        if (imported.selectedTemplate) setSelectedTemplate(imported.selectedTemplate);
        setShowPortfolio(true);
        alert('Portfolio configuration loaded successfully!');
      } else {
        alert('Invalid portfolio configuration format.');
      }
    } catch (err) {
      alert(`Import error: ${err.message}`);
    }
  };

  const handleNewPortfolio = () => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setIsSharedView(false);
    setShowPortfolio(false);
  };

  return (
    <div className="App font-sans min-h-screen bg-black text-white">
      {!showPortfolio ? (
        <div>
          <Navbar2/>
          <ResumeInp 
            onComplete={handleTogglePage} 
            onSendValue={setImgurl} 
            onSendJSON={(json) => setResumeData(normalizeResumeData(json))} 
            onSendPdfUrl={handlePdfUrl}
            onSendResumeFile={handleResumeFile}
            onSendResumeText={setResumeText}
          />
          <Footer/>
        </div>
      ) : (
        <div>
          {/* Dynamic Enterprise Navbar */}
          <Navbar 
            user={resumeData} 
            data={resumeData}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenEditor={() => setIsEditorOpen(true)}
            onOpenAts={() => setIsAtsOpen(true)}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onExportHtml={handleExportHtml}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onNewPortfolio={handleNewPortfolio}
            isSharedView={isSharedView}
          />

          {/* Strategy Pattern Multi-Template Rendering Engine */}
          <TemplateRenderer
            templateId={selectedTemplate}
            resumeData={resumeData}
            imgurl={imgurl}
            pdfUrl={pdfUrl}
            resumeFile={resumeFile}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenEditor={() => setIsEditorOpen(true)}
            onOpenAts={() => setIsAtsOpen(true)}
          />

          {/* 1. Interactive Share Modal */}
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            shareUrl={shareUrl || window.location.href}
            userName={resumeData?.name}
            resumeData={resumeData}
            imgurl={imgurl}
            selectedTemplate={selectedTemplate}
          />

          {/* 2. WYSIWYG Live Editor Modal with AI STAR Rewrites */}
          <LiveEditorModal
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            resumeData={resumeData}
            onSave={handleSaveEditedData}
          />

          {/* 3. AI ATS Health Scorer & Job Description Matcher Modal */}
          <AtsModal
            isOpen={isAtsOpen}
            onClose={() => setIsAtsOpen(false)}
            resumeData={resumeData}
            resumeText={resumeText}
          />
        </div>
      )}
      <Analytics />
    </div>
  );
}

export default App;
