import axios from 'axios';

// Dynamically use current hostname so phones on local network connect to the right IP
const BACKEND_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://${BACKEND_HOST}:5001/api`;
const SUSPENDED_KEY = 'AIzaSyDbh4GAj6DzApAqtUtfbRdAl7fQ71o8oZM';

export function getActiveApiKey() {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('user_gemini_api_key');
    if (custom && custom.trim()) return custom.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== SUSPENDED_KEY && !envKey.includes('AIzaSyDbh4GAj6DzApAqtUtfbRdAl7fQ71o8oZM')) {
    return envKey.trim();
  }
  return '';
}

export function saveUserApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('user_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('user_gemini_api_key');
    }
  }
}

const FALLBACK_MODELS = [
  'models/gemini-2.5-flash',
  'models/gemini-2.5-pro',
  'models/gemini-2.0-flash',
  'models/gemini-1.5-flash'
];

/**
 * Direct client-side fallback if backend proxy is down
 */
async function callClientGemini(prompt) {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key is suspended or not set. Please click "Configure Gemini Key" to enter a free API key from Google AI Studio.');
  }

  let lastError = null;
  for (const model of FALLBACK_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;
    try {
      const res = await axios.post(
        url,
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, topK: 40, topP: 0.95 }
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
      );
      const parts = res.data?.candidates?.[0]?.content?.parts || [];
      const text = parts.map(p => p.text).filter(Boolean).join('\n');
      if (text) return text;
    } catch (err) {
      const errMsg = err?.response?.data?.error?.message || err.message;
      console.warn(`[Client Fallback] Model ${model} failed:`, errMsg);
      if (errMsg.includes('suspended') || errMsg.includes('PERMISSION_DENIED') || errMsg.includes('API_KEY_INVALID')) {
        throw new Error(`Google reported: Permission denied. Your Gemini API key has been suspended or is invalid. Please click "Configure Gemini Key" to provide a new key.`);
      }
      lastError = err;
    }
  }
  throw lastError || new Error('Client-side Gemini call failed. Please check your Gemini API key.');
}

/**
 * 1. Parse Resume Text
 */
export async function parseResume(resumeText) {
  try {
    const res = await axios.post(`${BACKEND_URL}/parse-resume`, { resumeText }, { timeout: 25000 });
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
  } catch (backendError) {
    console.warn('[API Gateway] Backend unreachable, falling back to client-side LLM call...', backendError.message);
  }

  // Fallback to client-side
  const prompt = `
Extract the following from the resume text:
- name, profession, location, email, phone, linkedin
- oneliner: 4-5 word catchy tagline
- about: 3-5 sentence professional summary
- skills: array of major skills
- Experience: array of experience strings
- projects: array of project strings
- education: array of education strings
- certifications: array of certification strings

Return strictly valid JSON:
{
  "name": "", "profession": "", "location": "", "email": "", "phone": "",
  "linkedin": "", "oneliner": "", "about": "", "skills": [],
  "Experience": [], "projects": [], "education": [], "certifications": []
}

Resume Text:
${resumeText}
`;
  const raw = await callClientGemini(prompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Could not parse JSON from resume response.');
  return JSON.parse(match[0]);
}

/**
 * 2. Analyze ATS Compatibility Score
 */
export async function analyzeAtsScore(resumeData, resumeText = '') {
  try {
    const res = await axios.post(`${BACKEND_URL}/ats-score`, { resumeData, resumeText }, { timeout: 25000 });
    if (res.data?.success && res.data?.analysis) {
      return res.data.analysis;
    }
  } catch (backendError) {
    console.warn('[API Gateway] Backend unreachable for ATS, running client fallback...', backendError.message);
  }

  const prompt = `
Analyze this resume as an enterprise ATS recruiter. Calculate score 0-100 and return JSON:
{
  "overallScore": 85,
  "breakdown": { "actionVerbs": 80, "metrics": 75, "skillDensity": 90, "formatting": 95 },
  "strengths": ["Clear technical stack", "Structured work history"],
  "improvements": ["Add more quantifiable metrics (e.g. % improved, scale)", "Include industry certifications"],
  "keywordSummary": ["React", "JavaScript", "Frontend", "APIs"]
}
Resume:
${resumeText || JSON.stringify(resumeData)}
`;
  const raw = await callClientGemini(prompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Could not parse ATS evaluation.');
  return JSON.parse(match[0]);
}

/**
 * 3. Match against Target Job Description
 */
export async function matchJobDescription(resumeData, jobDescription) {
  try {
    const res = await axios.post(`${BACKEND_URL}/match-jd`, { resumeData, jobDescription }, { timeout: 25000 });
    if (res.data?.success && res.data?.match) {
      return res.data.match;
    }
  } catch (backendError) {
    console.warn('[API Gateway] Backend unreachable for JD match, running client fallback...', backendError.message);
  }

  const prompt = `
Compare Resume with Job Description. Return JSON:
{
  "matchPercentage": 80,
  "matchedSkills": ["React", "JavaScript", "CSS"],
  "missingSkills": ["TypeScript", "Docker", "AWS"],
  "keyRecommendations": ["Add cloud deployment keywords", "Quantify project scale"],
  "interviewTips": ["Explain state management trade-offs", "Highlight component reusability"]
}
Resume:
${JSON.stringify(resumeData)}
Job Description:
${jobDescription}
`;
  const raw = await callClientGemini(prompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Could not parse JD match response.');
  return JSON.parse(match[0]);
}

/**
 * 4. AI Bullet Point / Text Enhancer (STAR Method)
 */
export async function enhanceText(text, mode = 'star') {
  try {
    const res = await axios.post(`${BACKEND_URL}/enhance-text`, { text, mode }, { timeout: 20000 });
    if (res.data?.success && res.data?.enhancedText) {
      return res.data.enhancedText;
    }
  } catch (backendError) {
    console.warn('[API Gateway] Backend unreachable for text enhancement, running client fallback...', backendError.message);
  }

  let instruction = 'Rewrite this resume bullet point using the STAR method (Situation, Task, Action, Result) with strong action verbs and quantified impact:';
  if (mode === 'concise') instruction = 'Make this description punchy, professional, and under 25 words:';
  if (mode === 'impactful') instruction = 'Rewrite to maximize executive impact and scale:';

  const prompt = `${instruction}\n\n"${text}"\n\nReturn ONLY the rewritten sentence without explanations or quotes.`;
  const raw = await callClientGemini(prompt);
  return raw.trim().replace(/^["']|["']$/g, '');
}

/**
 * 5. Create Short Share Link on Backend
 */
export async function createShortShare(resumeData, imgurl = '', selectedTemplate = 'modern') {
  try {
    const res = await axios.post(`${BACKEND_URL}/share`, {
      resumeData,
      imgurl,
      selectedTemplate
    }, { timeout: 10000 });

    if (res.data?.success && res.data?.shareId) {
      return res.data.shareId;
    }
  } catch (err) {
    console.warn('[API Gateway] Failed to create short share on backend:', err.message);
  }
  return null;
}

/**
 * 6. Fetch Portfolio by Short Share ID
 */
export async function fetchSharedPortfolio(shareId) {
  try {
    const res = await axios.get(`${BACKEND_URL}/share/${shareId}`, { timeout: 10000 });
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('[API Gateway] Failed to fetch share ID from backend:', err.message);
  }
  return null;
}
