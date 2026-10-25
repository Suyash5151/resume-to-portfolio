import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaCopy, 
  FaCheck, 
  FaWhatsapp, 
  FaLinkedin, 
  FaTwitter, 
  FaTelegramPlane, 
  FaEnvelope, 
  FaQrcode, 
  FaShareAlt, 
  FaWifi, 
  FaGlobe, 
  FaFileCode, 
  FaCloudUploadAlt,
  FaSyncAlt
} from 'react-icons/fa';
import { createShortShare } from '../services/api';
import { exportStandaloneHtmlFile } from '../utils/exportUtils';
import { LOCAL_NETWORK_IP, DEFAULT_PORT, encodePortfolioData } from '../utils/shareUtils';

export default function ShareModal({ 
  isOpen, 
  onClose, 
  shareUrl, 
  userName,
  resumeData,
  imgurl,
  selectedTemplate
}) {
  const [activeTab, setActiveTab] = useState('network'); // 'network' | 'public' | 'file' | 'deploy'
  const [copied, setCopied] = useState(false);
  const [customDomain, setCustomDomain] = useState(() => {
    const saved = localStorage.getItem('resumefolio_custom_domain');
    if (!saved || saved === 'https://resumefolio.vercel.app') {
      return 'https://resumefolio-seven.vercel.app';
    }
    return saved;
  });
  const [shortShareId, setShortShareId] = useState(null);
  const [isGeneratingShort, setIsGeneratingShort] = useState(false);

  // When modal opens, create a short share ID from the backend
  useEffect(() => {
    if (isOpen && resumeData) {
      setIsGeneratingShort(true);
      createShortShare(resumeData, imgurl, selectedTemplate)
        .then(id => {
          if (id) {
            setShortShareId(id);
          }
        })
        .finally(() => {
          setIsGeneratingShort(false);
        });
    }
  }, [isOpen, resumeData, imgurl, selectedTemplate]);

  if (!isOpen) return null;

  const currentPort = window.location.port || DEFAULT_PORT;
  
  // 1. Clean, short Wi-Fi Link (e.g. http://10.17.131.73:3000/?s=3ed1b3)
  const networkUrl = shortShareId 
    ? `http://${LOCAL_NETWORK_IP}:${currentPort}/?s=${shortShareId}`
    : `http://${LOCAL_NETWORK_IP}:${currentPort}/?p=${encodePortfolioData(resumeData, imgurl, '')?.split('?p=')[1] || ''}`;

  // 2. Clean Public Cloud Link
  let cleanDomain = customDomain.trim();
  if (cleanDomain && !cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
    cleanDomain = `https://${cleanDomain}`;
  }
  cleanDomain = cleanDomain.replace(/\/+$/, '');

  const publicUrl = shortShareId 
    ? `${cleanDomain}/?s=${shortShareId}`
    : `${cleanDomain}/?p=${encodePortfolioData(resumeData, imgurl, '')?.split('?p=')[1] || ''}`;

  const activeShareUrl = activeTab === 'network' ? networkUrl : (activeTab === 'public' ? publicUrl : networkUrl);

  const handleCopy = async (urlToCopy = activeShareUrl) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSaveDomain = (val) => {
    setCustomDomain(val);
    localStorage.setItem('resumefolio_custom_domain', val);
  };

  const handleDownloadHtml = () => {
    exportStandaloneHtmlFile(resumeData, imgurl, selectedTemplate);
  };

  const shareTitle = `${userName || 'Developer'}'s Interactive Portfolio`;
  const shareText = `Check out ${userName || 'my'}'s interactive developer portfolio: ${activeShareUrl}`;
  
  // High-contrast, clean QR code with error correction level M (instant phone focus)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&margin=10&data=${encodeURIComponent(networkUrl)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border border-gray-700/90 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-pink-500 text-white shadow-md">
              <FaShareAlt className="text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Share Your Portfolio Everywhere</h2>
              <p className="text-xs text-gray-400">Open full interactive portfolio on any mobile or desktop device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-gray-950/40 px-4 gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('network')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'network'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FaWifi className="text-emerald-400" />
            <span>Instant Mobile QR Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('public')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'public'
                ? 'border-fuchsia-400 text-fuchsia-400 bg-fuchsia-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FaGlobe className="text-fuchsia-400" />
            <span>Public Web Link</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'file'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FaFileCode className="text-cyan-400" />
            <span>Offline HTML File</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'deploy'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FaCloudUploadAlt className="text-amber-400" />
            <span>Free Cloud Deploy</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Instant Mobile QR Scan */}
          {activeTab === 'network' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <span className="text-base">📱</span>
                <div>
                  <span className="font-bold">Instant Crisp QR Code:</span> Point your phone's camera at this QR code. It will instantly open the complete interactive portfolio on your phone!
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-6 bg-gray-950/90 border border-gray-800 rounded-2xl relative">
                {isGeneratingShort ? (
                  <div className="w-48 h-48 flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
                    <FaSyncAlt className="animate-spin text-2xl text-emerald-400" />
                    <span>Optimizing QR code...</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-white rounded-2xl shadow-2xl">
                    <img
                      src={qrCodeUrl}
                      alt="Ultra-Fast Scan QR Code"
                      className="w-44 h-44 rounded-lg block"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <FaQrcode />
                  <span>Ultra-fast low-density QR (Instant Scan)</span>
                </div>
              </div>

              {/* Wi-Fi Link Box */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Mobile Wi-Fi Direct Link
                </label>
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={networkUrl}
                    className="bg-transparent text-xs text-gray-200 px-3 py-2 w-full focus:outline-none truncate font-mono"
                  />
                  <button
                    onClick={() => handleCopy(networkUrl)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs transition-all whitespace-nowrap ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    }`}
                  >
                    {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy Link</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Public Web Link */}
          {activeTab === 'public' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-3.5 bg-fuchsia-950/40 border border-fuchsia-500/30 rounded-xl text-xs text-fuchsia-300">
                <span className="font-bold">🌐 Worldwide Public Link:</span> You can configure your custom domain or deployed URL below to generate a permanent link that opens anywhere on the internet.
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Custom Domain or Deployed URL
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => handleSaveDomain(e.target.value)}
                  placeholder="https://resumefolio-seven.vercel.app"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-gray-100 focus:border-fuchsia-500 focus:outline-none font-mono mb-3"
                />

                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Compact Shareable Link
                </label>
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl p-1.5">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="bg-transparent text-xs text-gray-200 px-3 py-2 w-full focus:outline-none truncate font-mono"
                  />
                  <button
                    onClick={() => handleCopy(publicUrl)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs transition-all whitespace-nowrap ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-md'
                    }`}
                  >
                    {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 text-center">
                  Share Directly
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2.5 rounded-xl bg-gray-800 hover:bg-[#25D366]/20 border border-gray-700 hover:border-[#25D366]/50 text-gray-300 hover:text-[#25D366] transition-all"
                  >
                    <FaWhatsapp className="text-xl mb-1" />
                    <span className="text-[10px]">WhatsApp</span>
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2.5 rounded-xl bg-gray-800 hover:bg-[#0077B5]/20 border border-gray-700 hover:border-[#0077B5]/50 text-gray-300 hover:text-[#0077B5] transition-all"
                  >
                    <FaLinkedin className="text-xl mb-1" />
                    <span className="text-[10px]">LinkedIn</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(publicUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2.5 rounded-xl bg-gray-800 hover:bg-[#1DA1F2]/20 border border-gray-700 hover:border-[#1DA1F2]/50 text-gray-300 hover:text-[#1DA1F2] transition-all"
                  >
                    <FaTwitter className="text-xl mb-1" />
                    <span className="text-[10px]">Twitter</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2.5 rounded-xl bg-gray-800 hover:bg-[#0088cc]/20 border border-gray-700 hover:border-[#0088cc]/50 text-gray-300 hover:text-[#0088cc] transition-all"
                  >
                    <FaTelegramPlane className="text-xl mb-1" />
                    <span className="text-[10px]">Telegram</span>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`}
                    className="flex flex-col items-center p-2.5 rounded-xl bg-gray-800 hover:bg-orange-500/20 border border-gray-700 hover:border-orange-500/50 text-gray-300 hover:text-orange-400 transition-all"
                  >
                    <FaEnvelope className="text-xl mb-1" />
                    <span className="text-[10px]">Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Offline Standalone HTML File */}
          {activeTab === 'file' && (
            <div className="space-y-5 animate-fade-in text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-cyan-500/10">
                <FaFileCode />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Standalone Offline Portfolio</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Download a single, self-contained <code className="text-cyan-300 bg-gray-800 px-1 py-0.5 rounded">portfolio.html</code> file with your custom data & styles bundled. You can attach it in emails, WhatsApp chats, or double-click to open on any computer or phone completely offline!
                </p>
              </div>

              <button
                onClick={handleDownloadHtml}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
              >
                <FaFileCode /> Download Standalone HTML File
              </button>
            </div>
          )}

          {/* TAB 4: Free Cloud Deploy Guide */}
          {activeTab === 'deploy' && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 flex items-start gap-2">
                <span className="text-base">⚡</span>
                <div>
                  <span className="font-bold">Deploy Free to Vercel in 1 Step:</span> Get a permanent, worldwide <code className="bg-gray-800 px-1 py-0.5 rounded text-amber-200">https://your-name.vercel.app</code> link in under 60 seconds.
                </div>
              </div>

              <div className="space-y-3 bg-gray-950/70 p-4 rounded-xl border border-gray-800">
                <div className="font-semibold text-gray-200">Step 1: Open Terminal in project directory</div>
                <div className="bg-black p-3 rounded-lg font-mono text-emerald-400 text-[11px] select-all">
                  cd frontend && npx vercel
                </div>

                <div className="font-semibold text-gray-200">Step 2: Press Enter to accept defaults</div>
                <p className="text-gray-400 leading-relaxed">
                  Vercel will build and assign you a free production URL (e.g. <code className="text-cyan-300">https://resumefolio-seven.vercel.app</code>).
                </p>

                <div className="font-semibold text-gray-200">Step 3: Paste your new Vercel URL in "Public Web Link" tab</div>
                <p className="text-gray-400">
                  Every portfolio you generate will now produce an instant universal web link!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
