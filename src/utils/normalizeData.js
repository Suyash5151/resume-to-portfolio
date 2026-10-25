/**
 * Universal Data Normalizer
 * Heals character arrays, nested arrays, malformed LLM responses, and corrupted string-splits.
 */

export function cleanItemText(item) {
  if (item === null || item === undefined) return '';
  
  if (Array.isArray(item)) {
    // If it's an array of single characters (e.g. ['B', '.', 'T', 'e', 'c', 'h'])
    if (item.length > 2 && item.every(ch => typeof ch === 'string' && ch.length <= 1)) {
      return item.join('');
    }
    // If it's an array of word tokens, join cleanly
    return item.map(x => cleanItemText(x)).filter(Boolean).join(' · ');
  }
  
  if (typeof item === 'object') {
    return Object.values(item).map(v => cleanItemText(v)).filter(Boolean).join(' · ');
  }
  
  return String(item).trim();
}

export function normalizeArray(list) {
  if (!list) return [];
  if (typeof list === 'string') {
    // If a whole section was returned as a single multiline string
    return list.split('\n').map(s => s.trim()).filter(Boolean);
  }
  if (!Array.isArray(list)) return [];

  // Check if list itself is an array of single characters e.g. ['B', '.', 'T', ...]
  if (list.length > 3 && list.every(item => typeof item === 'string' && item.length <= 1)) {
    return [list.join('')];
  }

  return list.map(item => {
    if (Array.isArray(item)) {
      if (item.length > 2 && item.every(ch => typeof ch === 'string' && ch.length <= 1)) {
        return item.join('');
      }
      return item.map(sub => cleanItemText(sub)).filter(Boolean);
    }
    if (typeof item === 'object' && item !== null) {
      return item;
    }
    return String(item).trim();
  }).filter(item => {
    if (Array.isArray(item)) return item.length > 0;
    if (typeof item === 'string') return item.trim().length > 0;
    return item !== null && item !== undefined;
  });
}

export function normalizeResumeData(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const data = { ...raw };

  // Normalize string fields
  data.name = cleanItemText(data.name || 'Developer');
  data.profession = cleanItemText(data.profession || 'Software Engineer');
  data.location = cleanItemText(data.location || '');
  data.email = cleanItemText(data.email || '');
  data.phone = cleanItemText(data.phone || '');
  data.linkedin = cleanItemText(data.linkedin || '');
  data.oneliner = cleanItemText(data.oneliner || '');
  data.about = cleanItemText(data.about || '');

  // Normalize arrays
  data.skills = normalizeArray(data.skills).map(s => cleanItemText(s)).filter(Boolean);
  data.Experience = normalizeArray(data.Experience);
  data.projects = normalizeArray(data.projects);
  data.education = normalizeArray(data.education);
  data.certifications = normalizeArray(data.certifications).map(c => cleanItemText(c)).filter(Boolean);

  return data;
}
