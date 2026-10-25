/**
 * Export and Import utilities for ResumeFolio
 */

/**
 * Exports data object as a downloadable JSON file
 */
export function exportToJson(data, filename = 'portfolio.json') {
  try {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to export JSON:', err);
  }
}

/**
 * Imports and parses a JSON file from user file input
 */
export function importFromJson(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.endsWith('.json')) {
      reject(new Error('Please select a valid JSON file.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON structure in the selected file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsText(file);
  });
}

/**
 * Compiles a self-contained standalone HTML portfolio that works completely offline.
 */
export function generateStandaloneHtml(resumeData, imgurl = '', templateName = 'Modern') {
  const d = resumeData || {};
  const name = d.name || 'Developer';
  const profession = d.profession || 'Software Engineer';
  const location = d.location || '';
  const about = d.about || '';
  const oneliner = d.oneliner || '';
  const email = d.email || '';
  const phone = d.phone || '';
  const linkedin = d.linkedin || '';
  const skills = Array.isArray(d.skills) ? d.skills : [];
  const experience = Array.isArray(d.Experience) ? d.Experience : [];
  const projects = Array.isArray(d.projects) ? d.projects : [];
  const education = Array.isArray(d.education) ? d.education : [];
  const certifications = Array.isArray(d.certifications) ? d.certifications : [];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glow { box-shadow: 0 0 50px -10px rgba(217, 70, 239, 0.25); }
    html { scroll-behavior: smooth; }
  </style>
</head>
<body class="bg-black text-gray-100 min-h-screen selection:bg-fuchsia-500 selection:text-white">

  <!-- Navigation -->
  <nav class="sticky top-0 z-50 glass border-b border-gray-800/80 px-6 py-4 flex justify-between items-center bg-black/70 backdrop-blur-md">
    <div class="font-bold text-xl bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
      ${name}
    </div>
    <div class="hidden md:flex gap-6 text-sm font-medium text-gray-300">
      <a href="#about" class="hover:text-fuchsia-400 transition-colors">About</a>
      ${experience.length ? '<a href="#experience" class="hover:text-fuchsia-400 transition-colors">Experience</a>' : ''}
      ${projects.length ? '<a href="#projects" class="hover:text-fuchsia-400 transition-colors">Projects</a>' : ''}
      ${skills.length ? '<a href="#skills" class="hover:text-fuchsia-400 transition-colors">Skills</a>' : ''}
      ${education.length ? '<a href="#education" class="hover:text-fuchsia-400 transition-colors">Education</a>' : ''}
      <a href="#contact" class="hover:text-fuchsia-400 transition-colors">Contact</a>
    </div>
    <div>
      <a href="#contact" class="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white transition-all shadow-md shadow-fuchsia-500/20">
        Hire Me
      </a>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
    <div class="absolute w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none -top-20"></div>
    <div class="absolute w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -bottom-20"></div>

    <div class="relative z-10 max-w-3xl">
      ${imgurl ? `<img src="${imgurl}" alt="${name}" class="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-2 border-fuchsia-500/40 shadow-2xl glow" />` : ''}
      <div class="inline-block px-4 py-1.5 rounded-full glass text-fuchsia-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-fuchsia-500/30">
        👋 Available for opportunities
      </div>
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        Hi, I'm <span class="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">${name}</span>
      </h1>
      <p class="text-xl md:text-2xl text-gray-300 font-medium mb-4">
        ${profession} ${location ? `· <span class="text-gray-400">${location}</span>` : ''}
      </p>
      ${oneliner ? `<p class="text-gray-400 text-base md:text-lg max-w-xl mx-auto italic mb-8">"${oneliner}"</p>` : ''}
      
      <div class="flex flex-wrap gap-4 justify-center">
        ${linkedin ? `<a href="${linkedin}" target="_blank" class="px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 font-semibold text-sm transition-all transform hover:scale-105 shadow-lg shadow-fuchsia-500/25">Connect on LinkedIn</a>` : ''}
        ${email ? `<a href="mailto:${email}" class="px-6 py-3 rounded-full glass hover:bg-white/10 font-semibold text-sm transition-all border border-gray-700">Send Email</a>` : ''}
      </div>
    </div>
  </section>

  <!-- About Section -->
  ${about ? `
  <section id="about" class="py-20 px-6 max-w-4xl mx-auto">
    <div class="glass p-8 md:p-12 rounded-3xl glow">
      <h2 class="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">About Me</h2>
      <p class="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line">${about}</p>
    </div>
  </section>` : ''}

  <!-- Skills Section -->
  ${skills.length ? `
  <section id="skills" class="py-16 px-6 max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">Core <span class="text-fuchsia-400">Skills</span></h2>
    <div class="flex flex-wrap gap-3 justify-center">
      ${skills.map(s => `<span class="px-4 py-2 rounded-xl glass border border-fuchsia-500/30 text-fuchsia-300 text-sm font-medium hover:border-fuchsia-400 transition-all">${s}</span>`).join('')}
    </div>
  </section>` : ''}

  <!-- Projects Section -->
  ${projects.length ? `
  <section id="projects" class="py-20 px-6 max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-10">Featured <span class="text-fuchsia-400">Projects</span></h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${projects.map((p, idx) => `
      <div class="glass p-6 rounded-2xl border border-gray-800 hover:border-fuchsia-500/50 transition-all group">
        <div class="text-xs font-mono text-fuchsia-400 mb-2">PROJECT // 0${idx + 1}</div>
        <h3 class="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors mb-2">${Array.isArray(p) ? p[0] : (typeof p === 'string' ? p.split(':')[0] : 'Project')}</h3>
        <p class="text-sm text-gray-400 leading-relaxed">${Array.isArray(p) ? p[1] : (typeof p === 'string' && p.includes(':') ? p.split(':').slice(1).join(':') : p)}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- Experience Section -->
  ${experience.length ? `
  <section id="experience" class="py-16 px-6 max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-10">Work <span class="text-fuchsia-400">Experience</span></h2>
    <div class="space-y-6">
      ${experience.map((exp) => `
      <div class="glass p-6 rounded-2xl border-l-4 border-l-fuchsia-500">
        <p class="text-gray-200 text-base leading-relaxed font-medium">${typeof exp === 'object' ? JSON.stringify(exp) : exp}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- Education & Certifications -->
  ${(education.length || certifications.length) ? `
  <section id="education" class="py-16 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    ${education.length ? `
    <div>
      <h3 class="text-xl font-bold mb-6 text-fuchsia-400">Education</h3>
      <div class="space-y-4">
        ${education.map(edu => `
        <div class="glass p-5 rounded-xl border border-gray-800">
          <p class="text-gray-200 text-sm font-medium">${typeof edu === 'object' ? (Array.isArray(edu) ? edu.join(' · ') : JSON.stringify(edu)) : edu}</p>
        </div>`).join('')}
      </div>
    </div>` : ''}

    ${certifications.length ? `
    <div>
      <h3 class="text-xl font-bold mb-6 text-pink-400">Certifications & Honors</h3>
      <div class="space-y-4">
        ${certifications.map(cert => `
        <div class="glass p-5 rounded-xl border border-gray-800">
          <p class="text-gray-200 text-sm font-medium">${typeof cert === 'object' ? JSON.stringify(cert) : cert}</p>
        </div>`).join('')}
      </div>
    </div>` : ''}
  </section>` : ''}

  <!-- Contact Section -->
  <section id="contact" class="py-20 px-6 max-w-2xl mx-auto text-center">
    <div class="glass p-8 md:p-12 rounded-3xl border border-fuchsia-500/30 glow">
      <h2 class="text-3xl font-extrabold mb-4 bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Get In Touch</h2>
      <p class="text-gray-300 text-sm mb-6">Have an exciting opportunity or want to connect? Reach out anytime!</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        ${email ? `<a href="mailto:${email}" class="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-md">Email Me</a>` : ''}
        ${phone ? `<a href="tel:${phone}" class="px-6 py-3 rounded-xl glass text-gray-200 font-semibold text-sm border border-gray-700">Call: ${phone}</a>` : ''}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 text-center text-xs text-gray-500 border-t border-gray-800/80">
    <p>Generated with ResumeFolio · Designed for ${name}</p>
  </footer>

</body>
</html>`;

  return html;
}

/**
 * Downloads the generated standalone HTML file directly to the user's computer.
 */
export function exportStandaloneHtmlFile(resumeData, imgurl = '', templateName = 'Modern') {
  const htmlContent = generateStandaloneHtml(resumeData, imgurl, templateName);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `${(resumeData?.name || 'portfolio').toLowerCase().replace(/\s+/g, '_')}_portfolio.html`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
