import LZString from 'lz-string';

// Detected local network LAN IP for instant cross-device mobile sharing on the same network
export const LOCAL_NETWORK_IP = '10.17.131.73';
export const DEFAULT_PORT = '3000';

/**
 * Encodes portfolio data into a compressed, URL-safe string.
 */
export function encodePortfolioData(resumeData, imgurl = '', baseUrl = '') {
  try {
    const payload = {
      d: resumeData,
      i: (imgurl && !imgurl.startsWith('blob:')) ? imgurl : ''
    };
    const jsonStr = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    
    let base = baseUrl;
    if (!base) {
      base = window.location.origin + window.location.pathname;
    }
    // Clean trailing slash
    base = base.replace(/\/+$/, '');

    return `${base}/?p=${compressed}`;
  } catch (err) {
    console.error('Error generating share link:', err);
    return null;
  }
}

/**
 * Generates a Local Wi-Fi Network link (e.g. http://10.17.131.73:3000/?p=...)
 * that works on any phone, tablet, or device connected to the same network.
 */
export function generateNetworkShareUrl(resumeData, imgurl = '') {
  const networkBase = `http://${LOCAL_NETWORK_IP}:${window.location.port || DEFAULT_PORT}`;
  return encodePortfolioData(resumeData, imgurl, networkBase);
}

/**
 * Generates a public cloud / custom domain shareable link.
 */
export function generateCustomDomainShareUrl(resumeData, imgurl = '', customDomain = '') {
  let base = customDomain.trim();
  if (base && !base.startsWith('http://') && !base.startsWith('https://')) {
    base = `https://${base}`;
  }
  if (!base) {
    base = 'https://resumefolio-seven.vercel.app';
  }
  return encodePortfolioData(resumeData, imgurl, base);
}

/**
 * Decodes the compressed portfolio data from URL parameter.
 */
export function decodePortfolioData(paramStr) {
  if (!paramStr) return null;
  try {
    let jsonStr = LZString.decompressFromEncodedURIComponent(paramStr);
    
    // Fallback if raw or URI decoded
    if (!jsonStr) {
      jsonStr = LZString.decompressFromEncodedURIComponent(decodeURIComponent(paramStr));
    }
    
    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      return {
        resumeData: parsed.d || parsed,
        imgurl: parsed.i || ''
      };
    }
  } catch (err) {
    console.error('Error decoding share link:', err);
  }
  return null;
}
