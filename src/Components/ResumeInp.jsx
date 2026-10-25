import React, { useState } from "react";
import { FaUpload, FaFileAlt, FaUser, FaCog, FaTrash } from 'react-icons/fa';
import { parseResume } from "../services/api";

function ResumeInp({ onComplete, onSendValue, onSendJSON, onSendPdfUrl, onSendResumeFile, onSendResumeText }) {
  const [imageURL, setImageURL] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState('text');
  const [pdfFile, setPdfFile] = useState(null);
  const [originalResumeFile, setOriginalResumeFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
      console.log("Image URL:", url);
      onSendValue(url);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setOriginalResumeFile(file);
      
      const url = URL.createObjectURL(file);
      if (typeof onSendPdfUrl === 'function') onSendPdfUrl(url);
      if (typeof onSendResumeFile === 'function') onSendResumeFile(file);
      
      setLoading(true);
      try {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          extractedText += pageText + '\n';
        }
        
        setResumeText(extractedText);
        if (typeof onSendResumeText === 'function') onSendResumeText(extractedText);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        alert("Error reading PDF file. Please try again or use text input.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleSend = async () => {
    if (!resumeText.trim()) {
      alert("Please provide resume text either by typing or uploading a PDF.");
      return;
    }

    setLoading(true);

    try {
      if (typeof onSendResumeText === 'function') onSendResumeText(resumeText);
      const json = await parseResume(resumeText);
      setResponseData(json);

      if (typeof onComplete === "function") onComplete(true);
      if (typeof onSendJSON === "function") onSendJSON(json);
    } catch (e) {
      console.error("API Error:", e);
      const errorMessage =
        e.response?.data?.error?.message ||
        e.response?.data?.error ||
        e.message ||
        "Something went wrong. Please check your API key or network connection.";
      setResponseData({
        error: errorMessage,
      });
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };



  const clearAll = () => {
    setResumeText('');
    setPdfFile(null);
    setOriginalResumeFile(null);
    setResponseData(null);
    setImageURL(null);
    
    // Clear parent state as well
    if (typeof onSendPdfUrl === 'function') onSendPdfUrl(null);
    if (typeof onSendResumeFile === 'function') onSendResumeFile(null);
  };

  // Rest of your JSX remains the same...
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      {/* Your existing JSX structure */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Resume <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Parser</span>
          </h1>
          <p className="text-gray-400 text-lg">Extract and analyze your resume data with AI</p>
        </div>

        {/* Input Method Selection */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaCog className="text-fuchsia-400" />
            Input Method
          </h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="inputMethod"
                value="text"
                checked={inputMethod === 'text'}
                onChange={(e) => setInputMethod(e.target.value)}
                className="w-4 h-4 text-fuchsia-500 bg-gray-800 border-gray-600 focus:ring-fuchsia-500"
              />
              <FaFileAlt className="text-2xl text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors" />
              <span className="text-white group-hover:text-gray-300 transition-colors">Paste Resume Text</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="inputMethod"
                value="pdf"
                checked={inputMethod === 'pdf'}
                onChange={(e) => setInputMethod(e.target.value)}
                className="w-4 h-4 text-fuchsia-500 bg-gray-800 border-gray-600 focus:ring-fuchsia-500"
              />
              <FaUpload className="text-2xl text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors" />
              <span className="text-white group-hover:text-gray-300 transition-colors">Upload PDF Resume</span>
            </label>
          </div>
        </div>

        {/* Text Input Section */}
        {inputMethod === 'text' && (
          <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaFileAlt className="text-fuchsia-400" />
              Resume Text
            </h3>
            <textarea
              rows={12}
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors resize-none"
            />
          </div>
        )}

        {/* PDF Upload Section */}
        {inputMethod === 'pdf' && (
          <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUpload className="text-fuchsia-400" />
              PDF Upload
            </h3>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-fuchsia-500 transition-colors">
              <FaUpload className="text-4xl text-gray-600 mx-auto mb-4" />
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="inline-block bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105"
              >
                Choose PDF File
              </label>
              {pdfFile && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-fuchsia-400 font-medium">
                    Selected: {pdfFile.name}
                  </p>
                </div>
              )}
            </div>
            
            {resumeText && inputMethod === 'pdf' && (
              <div className="mt-6">
                <label className="block text-lg font-medium mb-3 text-gray-300">
                  Extracted Text (editable):
                </label>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Profile Image Upload */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUser className="text-fuchsia-400" />
            Profile Picture
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105"
            >
              Choose Image
            </label>
            {imageURL && (
              <div className="relative">
                <img
                  src={imageURL}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-fuchsia-400 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={handleSend}
            disabled={loading || !resumeText.trim()}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCog className="text-lg" />
                Process Resume
              </>
            )}
          </button>
          
          <button
            onClick={clearAll}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaTrash className="text-lg" />
            Clear All
          </button>
        </div>

        {/* Response Display - Your existing response display JSX */}
        {responseData && (
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            {responseData.error ? (
              <div className="text-center">
                <div className="text-red-400 text-lg font-semibold mb-2">Error</div>
                <p className="text-red-300">{responseData.error}</p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                      {responseData.name}
                    </span>
                  </h2>
                  <p className="text-gray-400 text-lg">{responseData.profession || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-fuchsia-400 font-semibold">Location:</span>
                      <span className="ml-2 text-gray-300">{responseData.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-fuchsia-400 font-semibold">Email:</span>
                      <span className="ml-2 text-gray-300">{responseData.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-fuchsia-400 font-semibold">Phone:</span>
                      <span className="ml-2 text-gray-300">{responseData.phone || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <span className="text-fuchsia-400 font-semibold">Tagline:</span>
                      <p className="text-gray-300 mt-1 italic">"{responseData.oneliner || 'N/A'}"</p>
                    </div>
                  </div>
                </div>
                
                {responseData.skills && responseData.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-fuchsia-400">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {responseData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30 rounded-full text-sm text-fuchsia-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeInp;