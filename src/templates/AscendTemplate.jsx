import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  FaRocket, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCode, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGithub, 
  FaDownload, 
  FaShareAlt, 
  FaEdit, 
  FaBolt, 
  FaChevronRight, 
  FaGlobeAmericas,
  FaArrowRight,
  FaCheckCircle,
  FaCopy
} from 'react-icons/fa';

/**
 * Procedural WebGL Cosmic Globe Canvas
 * Renders interactive Earth planet, halo glow, cloud shell, starfield, and radar pings
 */
function AscendGlobeCanvas({ activeTab }) {
  const mountRef = useRef(null);
  const targetPosRef = useRef({ x: 0, y: -1.2, scale: 1.15, rotY: 0 });

  useEffect(() => {
    // Dynamic positions per page/tab for cinematic camera choreography
    switch (activeTab) {
      case 'overview':
        targetPosRef.current = { x: 0, y: -1.1, scale: 1.18, rotY: 0 };
        break;
      case 'projects':
        targetPosRef.current = { x: 2.2, y: 0.1, scale: 0.95, rotY: 1.2 };
        break;
      case 'experience':
        targetPosRef.current = { x: -2.3, y: 0.25, scale: 0.92, rotY: 2.4 };
        break;
      case 'skills':
        targetPosRef.current = { x: 0, y: 0.3, scale: 1.05, rotY: 3.6 };
        break;
      case 'education':
        targetPosRef.current = { x: 2.1, y: -0.2, scale: 0.88, rotY: 4.8 };
        break;
      case 'contact':
        targetPosRef.current = { x: 0, y: -0.9, scale: 1.25, rotY: 5.9 };
        break;
      default:
        targetPosRef.current = { x: 0, y: -1.1, scale: 1.15, rotY: 0 };
    }
  }, [activeTab]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060f, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Root Planet Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Procedural High-Res Earth Texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep ocean base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#061325');
    oceanGrad.addColorStop(0.5, '#020b18');
    oceanGrad.addColorStop(1, '#08172c');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Continents & Landmasses
    ctx.fillStyle = '#162b48';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    // Procedural organic continents
    function drawBlob(cx, cy, rx, ry, seed = 0) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.08) {
        const noise = Math.sin(a * 4 + seed) * 12 + Math.cos(a * 7 + seed * 2) * 8;
        const x = cx + Math.cos(a) * (rx + noise);
        const y = cy + Math.sin(a) * (ry + noise * 0.8);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // North America
    drawBlob(520, 360, 240, 140, 1.2);
    // South America
    drawBlob(680, 680, 140, 190, 2.5);
    // Eurasia
    drawBlob(1320, 330, 360, 160, 3.8);
    // Africa
    drawBlob(1140, 580, 160, 200, 4.2);
    // Australia & Islands
    drawBlob(1680, 720, 130, 90, 5.7);
    drawBlob(1520, 500, 70, 40, 6.1);

    // City lights on continents (night glow nodes)
    ctx.fillStyle = '#f6c343';
    ctx.shadowColor = '#f6c343';
    ctx.shadowBlur = 4;
    for (let i = 0; i < 400; i++) {
      const rx = (Math.random() * 0.8 + 0.1) * 2048;
      const ry = (Math.random() * 0.8 + 0.1) * 1024;
      const pixel = ctx.getImageData(rx, ry, 1, 1).data;
      if (pixel[0] > 18) { // If on landmass
        ctx.fillRect(rx, ry, Math.random() > 0.8 ? 2.5 : 1.5, Math.random() > 0.8 ? 2.5 : 1.5);
      }
    }
    ctx.shadowBlur = 0;

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Planet Sphere Mesh
    const planetGeo = new THREE.SphereGeometry(2.0, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.85,
      metalness: 0.15,
      emissive: new THREE.Color(0x0b172a),
      emissiveIntensity: 0.3
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    worldGroup.add(planetMesh);

    // 2. Translucent Cloud Shell
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cctx = cloudCanvas.getContext('2d');
    cctx.fillStyle = 'transparent';
    cctx.fillRect(0, 0, 1024, 512);

    cctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let i = 0; i < 70; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const cr = Math.random() * 60 + 20;
      cctx.beginPath();
      cctx.arc(cx, cy, cr, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    cloudTexture.wrapS = THREE.RepeatWrapping;

    const cloudGeo = new THREE.SphereGeometry(2.04, 48, 48);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    worldGroup.add(cloudMesh);

    // 3. Glowing Atmosphere Rim Halo (Fresnel Custom Shader)
    const haloGeo = new THREE.SphereGeometry(2.28, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          rim = pow(rim, 2.4);
          vec3 atmosphereColor = mix(vec3(0.18, 0.52, 0.98), vec3(0.96, 0.76, 0.26), rim * 0.35);
          gl_FragColor = vec4(atmosphereColor, rim * 0.75);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    worldGroup.add(haloMesh);

    // 4. Radar Ping Markers on Tech Hubs (SF, NY, London, Tokyo, Singapore, Zurich)
    const markerGroup = new THREE.Group();
    worldGroup.add(markerGroup);

    const HUB_COORDS = [
      { lat: 37.7749, lon: -122.4194, name: 'Silicon Valley' },
      { lat: 40.7128, lon: -74.0060, name: 'New York' },
      { lat: 51.5074, lon: -0.1278, name: 'London' },
      { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
      { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
      { lat: 47.3769, lon: 8.5417, name: 'Zurich' }
    ];

    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    const ringMeshes = [];
    HUB_COORDS.forEach(coord => {
      const pos = latLonToVector3(coord.lat, coord.lon, 2.02);

      // Center dot
      const dotGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xf6c343 });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      markerGroup.add(dotMesh);

      // Radar Concentric Ring
      const ringGeo = new THREE.RingGeometry(0.04, 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf6c343,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      markerGroup.add(ring);
      ringMeshes.push(ring);
    });

    // 5. Starfield Particles (Cosmic Depth)
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 25 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Subtle gold, cyan, white tints
      const tint = Math.random();
      if (tint > 0.85) {
        starColors[i * 3] = 0.96; starColors[i * 3 + 1] = 0.76; starColors[i * 3 + 2] = 0.26;
      } else if (tint > 0.6) {
        starColors[i * 3] = 0.3; starColors[i * 3 + 1] = 0.7; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.9; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 1.0;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Mouse Parallax
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Earth & Cloud Rotations
      planetMesh.rotation.y += 0.0018;
      cloudMesh.rotation.y += 0.0026;
      starField.rotation.y += 0.0002;

      // Smooth Position & Scale Interpolation toward Target Keyframe
      const target = targetPosRef.current;
      worldGroup.position.x += (target.x + mouseX - worldGroup.position.x) * 0.05;
      worldGroup.position.y += (target.y - mouseY - worldGroup.position.y) * 0.05;

      const currentScale = worldGroup.scale.x;
      const newScale = currentScale + (target.scale - currentScale) * 0.05;
      worldGroup.scale.set(newScale, newScale, newScale);

      // Radar Ring Pulsing
      ringMeshes.forEach((ring, idx) => {
        const pulse = (Math.sin(elapsed * 3 + idx * 0.9) + 1) * 0.5;
        ring.scale.set(1 + pulse * 1.6, 1 + pulse * 1.6, 1);
        ring.material.opacity = (1 - pulse) * 0.8;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true" 
    />
  );
}

/**
 * Ascend Designer Multi-Page Portfolio Template
 */
export default function AscendTemplate({
  resumeData,
  imgurl,
  pdfUrl,
  resumeFile,
  onOpenShare,
  onOpenEditor,
  onOpenAts
}) {
  const d = resumeData || {};
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedContact, setCopiedContact] = useState(false);

  // Tabs Definition
  const TABS = [
    { id: 'overview', label: 'Overview', code: '01' },
    { id: 'projects', label: 'Projects & Systems', code: '02' },
    { id: 'experience', label: 'Trajectory', code: '03' },
    { id: 'skills', label: 'Tech Stack Orbit', code: '04' },
    { id: 'education', label: 'Credentials', code: '05' },
    { id: 'contact', label: 'Mission Dispatch', code: '06' }
  ];

  // Helper to extract cleanly formatted items
  const skillsList = d.skills || ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'AWS'];
  const experienceList = d.Experience || ['Senior Systems Engineer @ Tech Dynamics | 2022 - Present'];
  const projectsList = d.projects || ['ScaleOps Cloud: Automated cloud optimization system with real-time analytics.'];
  const educationList = d.education || ['Bachelor of Science in Computer Science'];
  const certificationsList = d.certifications || [];

  // Categorize Projects for Designer Filter
  const categorizedProjects = projectsList.map((proj, idx) => {
    let title = typeof proj === 'string' ? proj.split(':')[0] : (proj.title || `System 0${idx + 1}`);
    let desc = typeof proj === 'string' ? (proj.split(':')[1] || proj) : (proj.desc || proj.description || '');
    let tag = 'Full Stack';
    if (/ai|ml|learning|data|model/i.test(title + desc)) tag = 'AI & Data';
    else if (/front|ui|ux|web|design|mobile/i.test(title + desc)) tag = 'Frontend & UI';
    else if (/cloud|devops|aws|docker|infra/i.test(title + desc)) tag = 'Infrastructure';
    return { title: title.trim(), desc: desc.trim(), tag, id: idx + 1 };
  });

  const filteredProjects = selectedCategory === 'ALL' 
    ? categorizedProjects 
    : categorizedProjects.filter(p => p.tag === selectedCategory);

  // Skill Quadrants for Orbit Matrix
  const skillCategories = {
    'Frontend & Visual Systems': skillsList.filter(s => /react|vue|angular|front|css|html|ui|ux|next|tailwind|figma/i.test(s)),
    'Backend & Distributed Architecture': skillsList.filter(s => /node|express|python|java|go|c\+\+|api|sql|mongo|postgre|db|redis|django|spring/i.test(s)),
    'Cloud, DevOps & Tooling': skillsList.filter(s => /docker|kube|aws|gcp|cloud|git|ci|linux|azure|devops|bash/i.test(s)),
    'Core Methodologies': skillsList.filter(s => !/react|vue|node|python|docker|aws|git|html|css|sql/i.test(s))
  };

  const handleDownload = () => {
    if (resumeFile) {
      const url = URL.createObjectURL(resumeFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeFile.name || `${d.name || 'Resume'}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${d.name || 'Resume'}.pdf`;
      a.click();
    } else {
      alert("No PDF resume uploaded yet. You can export standalone HTML using the Export button.");
    }
  };

  const copyEmail = () => {
    if (d.email) {
      navigator.clipboard.writeText(d.email);
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2000);
    }
  };

  return (
    <div className="ascend-template min-h-screen bg-[#04060f] text-slate-100 relative font-sans selection:bg-[#f6c343] selection:text-black overflow-x-hidden">
      
      {/* 3D WebGL Earth & Cosmic Universe Canvas */}
      <AscendGlobeCanvas activeTab={activeTab} />

      {/* Atmospheric Star Dust Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(125%_65%_at_50%_-10%,rgba(4,6,15,0.75)_0%,rgba(4,6,15,0.35)_45%,transparent_70%)]" 
        aria-hidden="true" 
      />

      {/* Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#070a16]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f6c343] to-[#e07a2c] flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_15px_rgba(246,195,67,0.4)]">
                ⟐
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-[0.16em] uppercase text-white block group-hover:text-[#f6c343] transition-colors">
                  {d.name || 'ASCEND ARCHITECT'}
                </span>
                <span className="text-[10px] tracking-widest text-[#38bdf8] flex items-center gap-1.5 uppercase font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Telemetry Linked // Online
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Multi-Page Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] shadow-inner">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#f6c343] to-[#e07a2c] text-black shadow-[0_0_16px_rgba(246,195,67,0.35)] font-bold scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className={`text-[10px] opacity-70 ${activeTab === tab.id ? 'text-black' : 'text-[#f6c343]'}`}>
                  {tab.code}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-slate-200 transition-all hover:border-[#f6c343]/60 shadow-sm"
              title="Download Original Resume Dossier"
            >
              <FaDownload className="text-[#f6c343] text-xs" />
              <span>Dossier</span>
            </button>

            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f6c343]/10 hover:bg-[#f6c343]/20 border border-[#f6c343]/40 text-[#f6c343] transition-all hover:scale-105 shadow-[0_0_12px_rgba(246,195,67,0.15)]"
              title="Open WYSIWYG Live Editor"
            >
              <FaEdit className="text-xs" />
              <span className="hidden md:inline">Live Edit</span>
            </button>

            <button
              onClick={onOpenAts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] transition-all hover:scale-105 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
              title="View ATS Scanner & JD Match"
            >
              <FaBolt className="text-xs" />
              <span className="hidden md:inline">ATS 99%</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 px-4 bg-[#050814]/90 border-t border-white/[0.05] scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#f6c343] to-[#e07a2c] text-black font-bold'
                  : 'text-slate-400 bg-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Multi-Page Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* ============================================================== */}
        {/* PAGE 1: OVERVIEW / MISSION COMMAND                             */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-16 animate-fadeIn">
            
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto pt-6 pb-10">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-semibold tracking-widest text-[#f6c343] uppercase mb-8 shadow-inner">
                <FaRocket className="text-xs text-[#e07a2c]" />
                <span>Next-Gen Engineering & Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
                Scale Smarter, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#f6c343] via-[#ff9e3b] to-[#e07a2c] bg-clip-text text-transparent">
                  Not Harder.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                {d.oneliner || `${d.profession || 'Full Stack Engineer'} architecting high-velocity digital experiences.`}
              </p>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#f6c343] to-[#e07a2c] hover:from-[#ffd25f] hover:to-[#f08535] text-black shadow-[0_0_30px_rgba(246,195,67,0.35)] transition-all hover:scale-105 flex items-center gap-2"
                >
                  Explore Systems <FaArrowRight className="text-xs" />
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] text-white transition-all hover:border-[#f6c343]/60 backdrop-blur-md"
                >
                  Initiate Dispatch
                </button>
              </div>
            </div>

            {/* Core Metrics / Telemetry KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Deployed Systems', value: `${projectsList.length}+`, detail: 'Production Solutions' },
                { label: 'Career Milestones', value: `${experienceList.length}+`, detail: 'Roles & Chapters' },
                { label: 'Core Tech Stack', value: `${skillsList.length}`, detail: 'Validated Capabilities' },
                { label: 'System Reliability', value: '99.9%', detail: 'Performance Standard' }
              ].map((kpi, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0b1022]/70 backdrop-blur-xl border border-white/[0.08] hover:border-[#f6c343]/40 rounded-2xl p-6 transition-all duration-300 group shadow-lg"
                >
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    {kpi.label}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white group-hover:text-[#f6c343] transition-colors">
                    {kpi.value}
                  </div>
                  <span className="text-xs text-[#38bdf8] mt-2 block font-medium">
                    {kpi.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Candidate Executive Dossier / Bio */}
            <div className="bg-[#090d1e]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f6c343] via-[#38bdf8] to-[#e07a2c]"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Photo / Avatar if present */}
                {imgurl && (
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#f6c343] to-[#38bdf8] opacity-30 group-hover:opacity-60 blur transition-all"></div>
                      <img 
                        src={imgurl} 
                        alt={d.name} 
                        className="relative w-56 h-56 object-cover rounded-2xl border border-white/20 shadow-2xl"
                      />
                    </div>
                  </div>
                )}

                <div className={`${imgurl ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#f6c343] uppercase tracking-widest">
                    <span>// DOSSIER SPECIFICATION</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {d.name || 'Visionary Engineer'}
                  </h2>

                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                    {d.about || 'Specialized in bridging high-velocity design with scalable distributed architecture. Committed to creating performant, user-obsessed digital infrastructure.'}
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-4">
                    {skillsList.slice(0, 6).map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-white/[0.05] border border-white/[0.1] text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Latest Role */}
              <div 
                onClick={() => setActiveTab('experience')}
                className="cursor-pointer bg-[#0a0e20]/70 hover:bg-[#0e142e]/90 border border-white/[0.08] hover:border-[#f6c343]/50 rounded-2xl p-6 transition-all group backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-[#f6c343]">01 // TRAJECTORY</span>
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform text-[#f6c343]" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#f6c343] transition-colors line-clamp-1">
                  {typeof experienceList[0] === 'string' ? experienceList[0].split('@')[0] : (experienceList[0]?.title || 'Senior Engineer')}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {typeof experienceList[0] === 'string' ? experienceList[0] : (experienceList[0]?.company || 'Enterprise Leader')}
                </p>
              </div>

              {/* Card 2: Featured Project */}
              <div 
                onClick={() => setActiveTab('projects')}
                className="cursor-pointer bg-[#0a0e20]/70 hover:bg-[#0e142e]/90 border border-white/[0.08] hover:border-[#38bdf8]/50 rounded-2xl p-6 transition-all group backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-[#38bdf8]">02 // INNOVATIONS</span>
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform text-[#38bdf8]" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors line-clamp-1">
                  {categorizedProjects[0]?.title || 'Flagship Architecture'}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {categorizedProjects[0]?.desc || 'Scalable full-stack application built with high availability.'}
                </p>
              </div>

              {/* Card 3: Direct Dispatch */}
              <div 
                onClick={() => setActiveTab('contact')}
                className="cursor-pointer bg-[#0a0e20]/70 hover:bg-[#0e142e]/90 border border-white/[0.08] hover:border-emerald-400/50 rounded-2xl p-6 transition-all group backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-emerald-400">03 // DISPATCH</span>
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {d.location || 'Global Remote / On-Site'}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {d.email || 'Direct channel available for mission coordination.'}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 2: PROJECTS & INNOVATIONS                                 */}
        {/* ============================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div>
                <span className="text-xs font-mono text-[#f6c343] uppercase tracking-widest block mb-2">
                  PAGE 02 // SYSTEMS & ARCHITECTURES
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                  Featured <span className="bg-gradient-to-r from-[#f6c343] to-[#e07a2c] bg-clip-text text-transparent">Innovations</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                  Scalable applications, distributed systems, and modern visual interfaces engineered for enterprise impact.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {['ALL', 'Full Stack', 'Frontend & UI', 'AI & Data', 'Infrastructure'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#f6c343] text-black shadow-md'
                        : 'bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project, idx) => (
                <div 
                  key={idx}
                  className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-[#f6c343]/50 rounded-3xl p-8 transition-all duration-300 hover:translate-y-[-4px] shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    {/* Badge & Index */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-[#f6c343]/10 text-[#f6c343] border border-[#f6c343]/30">
                        SYSTEM // 0{project.id}
                      </span>
                      <span className="text-xs text-[#38bdf8] font-mono">
                        {project.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white group-hover:text-[#f6c343] transition-colors mb-3">
                      {project.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {project.desc || 'Architected resilient solution with reactive frontend state, API integrations, and robust test coverage.'}
                    </p>
                  </div>

                  <div>
                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                      {skillsList.slice(idx * 2, idx * 2 + 3).map((st, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                          {st}
                        </span>
                      ))}
                    </div>

                    {/* Launch & Blueprint Actions */}
                    <div className="mt-6 flex items-center justify-between pt-2">
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Stable
                      </span>

                      <button 
                        onClick={() => alert(`System Blueprint: ${project.title}\n\n${project.desc}\n\nStack: ${skillsList.slice(0, 4).join(', ')}`)}
                        className="text-xs font-semibold text-[#f6c343] hover:text-[#ffd25f] flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                      >
                        Architecture Brief <FaArrowRight className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 3: EXPERIENCE / TRAJECTORY                                */}
        {/* ============================================================== */}
        {activeTab === 'experience' && (
          <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
            
            <div className="border-b border-white/[0.08] pb-8">
              <span className="text-xs font-mono text-[#f6c343] uppercase tracking-widest block mb-2">
                PAGE 03 // CAREER EVOLUTION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Trajectory & <span className="bg-gradient-to-r from-[#f6c343] to-[#e07a2c] bg-clip-text text-transparent">Milestones</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Chronological timeline of organizational impact, leadership, and technical achievements.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-white/[0.1] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
              {experienceList.map((rawExp, idx) => {
                let title = 'Senior Engineer';
                let company = 'Enterprise';
                let period = '2022 - Present';
                let details = '';

                if (typeof rawExp === 'string') {
                  const atParts = rawExp.split('@');
                  if (atParts.length > 1) {
                    title = atParts[0].trim();
                    const rest = atParts.slice(1).join('@');
                    const pipeParts = rest.split('|');
                    company = pipeParts[0].trim();
                    period = pipeParts[1]?.trim() || 'Active Period';
                  } else {
                    title = rawExp;
                  }
                  details = rawExp;
                } else if (typeof rawExp === 'object' && rawExp !== null) {
                  title = rawExp.title || rawExp.role || 'Role';
                  company = rawExp.company || rawExp.organization || '';
                  period = rawExp.period || rawExp.year || 'Timeline';
                  details = rawExp.description || rawExp.details || '';
                }

                return (
                  <div key={idx} className="relative group">
                    {/* Glowing Timeline Marker */}
                    <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#04060f] border-2 border-[#f6c343] flex items-center justify-center shadow-[0_0_12px_rgba(246,195,67,0.5)]">
                      <div className="w-2 h-2 rounded-full bg-[#f6c343]"></div>
                    </div>

                    {/* Milestone Card */}
                    <div className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-[#f6c343]/40 rounded-2xl p-6 sm:p-8 transition-all shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#f6c343] transition-colors">
                          {title}
                        </h3>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/[0.06] text-[#38bdf8] border border-white/[0.08] self-start sm:self-auto">
                          {period}
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-[#f6c343] mb-4 flex items-center gap-2">
                        <FaBriefcase className="text-xs" />
                        <span>{company}</span>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed">
                        {details || 'Engineered end-to-end features, optimized build workflows, and coordinated cross-functional initiatives driving user engagement.'}
                      </p>

                      <div className="mt-5 pt-4 border-t border-white/[0.05] flex flex-wrap gap-2">
                        {skillsList.slice(idx * 2, idx * 2 + 4).map((sk, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/[0.03] text-slate-300">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 4: TECH STACK ORBIT                                       */}
        {/* ============================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto">
            
            <div className="border-b border-white/[0.08] pb-8">
              <span className="text-xs font-mono text-[#f6c343] uppercase tracking-widest block mb-2">
                PAGE 04 // CAPABILITY CLUSTERS
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Tech Stack <span className="bg-gradient-to-r from-[#f6c343] to-[#e07a2c] bg-clip-text text-transparent">Orbit</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Comprehensive matrix of languages, frameworks, cloud infrastructure, and architectural methodologies.
              </p>
            </div>

            {/* Quadrant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skillCategories).map(([category, items], idx) => {
                const displayItems = items.length > 0 ? items : skillsList.slice(idx * 3, idx * 3 + 4);
                return (
                  <div 
                    key={idx}
                    className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#f6c343]"></span>
                        {category}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {displayItems.length} ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {displayItems.map((skill, sIdx) => (
                        <div 
                          key={sIdx}
                          className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#f6c343]/50 rounded-xl p-3.5 transition-all group"
                        >
                          <div className="text-xs font-bold text-slate-200 group-hover:text-[#f6c343] transition-colors mb-2 flex items-center justify-between">
                            <span>{skill}</span>
                            <span className="text-[10px] font-mono text-emerald-400">95%</span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#f6c343] to-[#e07a2c] rounded-full" 
                              style={{ width: `${88 + (sIdx % 4) * 3}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 5: CREDENTIALS & ACCREDITATIONS                           */}
        {/* ============================================================== */}
        {activeTab === 'education' && (
          <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
            
            <div className="border-b border-white/[0.08] pb-8">
              <span className="text-xs font-mono text-[#f6c343] uppercase tracking-widest block mb-2">
                PAGE 05 // ACCREDITATION & CLEARANCES
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Credentials & <span className="bg-gradient-to-r from-[#f6c343] to-[#e07a2c] bg-clip-text text-transparent">Education</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Academic foundation, professional licensures, and industry certifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Education Block */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaGraduationCap className="text-[#f6c343]" />
                  <span>Academic Clearances</span>
                </h3>

                {educationList.map((edu, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-[#f6c343]/40 rounded-2xl p-6 transition-all shadow-lg"
                  >
                    <span className="text-[11px] font-mono text-[#f6c343] block mb-1">
                      DEGREE // 0{idx + 1}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {typeof edu === 'string' ? edu : (edu.degree || edu.institution || 'Academic Program')}
                    </h4>
                    <span className="text-xs text-slate-400 mt-2 block font-medium">
                      Accredited University Curriculum
                    </span>
                  </div>
                ))}
              </div>

              {/* Certifications Block */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" />
                  <span>Industry Accreditations</span>
                </h3>

                {(certificationsList.length > 0 ? certificationsList : [
                  'AWS Certified Solutions Architect',
                  'Professional Cloud Developer Certification',
                  'Advanced System Design & Scalability'
                ]).map((cert, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-400/40 rounded-2xl p-6 transition-all shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        VERIFIED BADGE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">STATUS: ACTIVE</span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {typeof cert === 'string' ? cert : (cert.title || cert.name || 'Certification')}
                    </h4>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 6: MISSION DISPATCH / CONTACT                             */}
        {/* ============================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto">
            
            <div className="text-center pb-6">
              <span className="text-xs font-mono text-[#f6c343] uppercase tracking-widest block mb-2">
                PAGE 06 // MISSION CONTROL
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Initiate <span className="bg-gradient-to-r from-[#f6c343] to-[#e07a2c] bg-clip-text text-transparent">Dispatch</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
                Secure communications channel for direct hire opportunities, architecture consultations, or high-velocity projects.
              </p>
            </div>

            {/* Direct Contact Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div 
                onClick={copyEmail}
                className="cursor-pointer bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-[#f6c343]/50 rounded-2xl p-5 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-3 text-[#f6c343]">
                  <FaEnvelope />
                </div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Direct Email</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {d.email || 'architect@portfolio.dev'}
                </span>
                <span className="text-[10px] text-[#f6c343] mt-2 block font-mono">
                  {copiedContact ? '✓ Copied to clipboard!' : 'Click to copy'}
                </span>
              </div>

              {d.phone && (
                <div className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-3 text-[#38bdf8]">
                    <FaPhone />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Secure Line</span>
                  <span className="text-xs font-bold text-white mt-1 block">{d.phone}</span>
                </div>
              )}

              <div className="bg-[#090d1f]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Base Orbit</span>
                <span className="text-xs font-bold text-white mt-1 block">
                  {d.location || 'Global Remote'}
                </span>
              </div>

            </div>

            {/* Quick Interactive Dispatch Composer */}
            <div className="bg-[#090d1f]/90 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-8 sm:p-10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaRocket className="text-[#f6c343]" />
                <span>Transmit Mission Briefing</span>
              </h3>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const targetEmail = d.email || 'architect@portfolio.dev';
                  window.location.href = `mailto:${targetEmail}?subject=Mission Briefing via Ascend Portfolio&body=Hello ${d.name || ''},%0D%0A%0D%0AI would like to connect with you regarding an opportunity.`;
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c343]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Your Frequency / Email</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="elena@enterprise.co"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c343]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Mission Scope</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Describe project requirements, tech stack objectives, or role parameters..."
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6c343]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#f6c343] to-[#e07a2c] hover:from-[#ffd25f] hover:to-[#f08535] text-black shadow-[0_0_24px_rgba(246,195,67,0.35)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FaRocket /> Dispatch Transmission Signal
                </button>
              </form>
            </div>

            {/* Social Coordinates */}
            {(d.linkedin || d.github) && (
              <div className="flex items-center justify-center gap-6 pt-4">
                {d.linkedin && (
                  <a 
                    href={d.linkedin.startsWith('http') ? d.linkedin : `https://${d.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#f6c343] transition-colors"
                  >
                    <FaLinkedin className="text-base text-[#38bdf8]" />
                    <span>LinkedIn Network</span>
                  </a>
                )}
                {d.github && (
                  <a 
                    href={d.github.startsWith('http') ? d.github : `https://${d.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#f6c343] transition-colors"
                  >
                    <FaGithub className="text-base text-white" />
                    <span>GitHub Repository</span>
                  </a>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#03050c]/90 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f6c343]"></span>
            <span>ASCEND ENGINE // IMMERSIVE 3D DOSSIER</span>
          </div>
          <div>
            © {new Date().getFullYear()} {d.name || 'Candidate Portfolio'} • All Telemetry Secured
          </div>
        </div>
      </footer>

    </div>
  );
}
