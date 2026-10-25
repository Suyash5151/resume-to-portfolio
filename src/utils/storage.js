/**
 * LocalStorage persistence manager for ResumeFolio
 */
const STORAGE_KEY = 'resumefolio_saved_data';
const TEMPLATE_KEY = 'resumefolio_selected_template';

export function savePortfolioToStorage(resumeData, imgurl = '', selectedTemplate = 'modern') {
  try {
    const payload = {
      resumeData,
      imgurl,
      selectedTemplate,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save portfolio data to LocalStorage:', err);
  }
}

export function loadPortfolioFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load portfolio data from LocalStorage:', err);
    return null;
  }
}

export function clearPortfolioStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}

export function saveSelectedTemplate(templateId) {
  try {
    localStorage.setItem(TEMPLATE_KEY, templateId);
  } catch (err) {
    console.error('Failed to save template selection:', err);
  }
}

export function loadSelectedTemplate() {
  try {
    return localStorage.getItem(TEMPLATE_KEY) || 'modern';
  } catch (err) {
    return 'modern';
  }
}
