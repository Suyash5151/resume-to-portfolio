import React from 'react';
import { FaDownload, FaLinkedin } from 'react-icons/fa';

export default function Landing({ sharedValue, data, pdfUrl, resumeFile }) {
  const profileImage = sharedValue && sharedValue.length > 0 ? sharedValue : '/emptyuser.webp';

  // Enhanced download handler with multiple fallbacks
  const handleDownload = () => {
    try {
      if (resumeFile) {
        // Method 1: Use the original file if available
        const url = URL.createObjectURL(resumeFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = resumeFile.name || `${data?.name || 'Resume'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
      } else if (pdfUrl) {
        // Method 2: Use the URL if file is not available
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${data?.name || 'Resume'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } else {
        // Method 3: Show message if neither is available
        alert("No resume file available for download. Please upload a PDF resume.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download resume. Please try again.");
    }
  };

  // Check if download is available
  const isDownloadAvailable = resumeFile || pdfUrl;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Profile Image */}
      <div className="relative mb-8">
        <img
          src={profileImage}
          alt="Profile"
          className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-transparent shadow-2xl"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-fuchsia-500/20 to-transparent"></div>
      </div>

      {/* Main Heading */}
      <h1 className="mt-6 text-3xl md:text-5xl font-bold text-center leading-tight max-w-4xl">
        I'm <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          {data?.name || "No name"}
        </span>,
        <br />
        <span className="text-2xl md:text-4xl font-medium text-gray-300">
          {data?.profession || "Professional"} based in {data?.location || "Earth"}.
        </span>
      </h1>

      {/* Sub Text */}
      <p className="text-lg mt-6 text-center max-w-2xl text-gray-400 leading-relaxed">
        {data?.oneliner || "I build modern web interfaces with React and Tailwind."}
      </p>

      {/* Buttons */}
      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        {data?.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 hover:from-fuchsia-600 hover:to-orange-500 text-white font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <FaLinkedin className="text-xl" />
            Connect with me
          </a>
        )}
        
        <button
          className={`px-8 py-4 rounded-full border-2 font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg ${
            isDownloadAvailable 
              ? "border-white text-white hover:bg-white hover:text-black" 
              : "border-gray-600 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleDownload}
          disabled={!isDownloadAvailable}
        >
          <FaDownload className="text-lg" />
          {isDownloadAvailable ? "My Resume" : "My Resume"}
        </button>
      </div>

     
    </div>
  );
}