/**
 * Device & IP Information Extraction Utility
 * Extracts client IP address, browser, OS, and device information from requests
 */

/**
 * Get the real client IP address, handling proxies and load balancers
 * @param {Object} req - Express request object
 * @returns {string} - Client IP address
 */
export const getClientIp = (req) => {
  // Check for forwarded headers (when behind proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one (original client)
    return forwarded.split(',')[0].trim();
  }
  
  // Check other common proxy headers
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp.trim();
  }
  
  // Check CF-Connecting-IP (Cloudflare)
  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp) {
    return cfIp.trim();
  }
  
  // Fall back to direct connection IP
  let ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  
  // Handle IPv6-mapped IPv4 addresses (::ffff:192.168.1.1)
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  return ip || 'unknown';
};

/**
 * Parse user agent string to extract browser, OS, and device info
 * @param {string} userAgent - User agent string
 * @returns {Object} - Parsed device information
 */
export const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return {
      browser: { name: 'unknown', version: 'unknown' },
      os: { name: 'unknown', version: 'unknown' },
      device: { type: 'unknown', vendor: 'unknown', model: 'unknown' }
    };
  }
  
  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = { name: 'unknown', version: 'unknown' };
  
  if (ua.includes('edg/')) {
    browser.name = 'Edge';
    browser.version = extractVersion(userAgent, /Edg\/(\d+[\d.]*)/i);
  } else if (ua.includes('chrome') && !ua.includes('chromium')) {
    browser.name = 'Chrome';
    browser.version = extractVersion(userAgent, /Chrome\/(\d+[\d.]*)/i);
  } else if (ua.includes('firefox')) {
    browser.name = 'Firefox';
    browser.version = extractVersion(userAgent, /Firefox\/(\d+[\d.]*)/i);
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser.name = 'Safari';
    browser.version = extractVersion(userAgent, /Version\/(\d+[\d.]*)/i);
  } else if (ua.includes('opera') || ua.includes('opr/')) {
    browser.name = 'Opera';
    browser.version = extractVersion(userAgent, /(?:Opera|OPR)\/(\d+[\d.]*)/i);
  } else if (ua.includes('msie') || ua.includes('trident')) {
    browser.name = 'Internet Explorer';
    browser.version = extractVersion(userAgent, /(?:MSIE |rv:)(\d+[\d.]*)/i);
  }
  
  // Detect OS
  let os = { name: 'unknown', version: 'unknown' };
  
  if (ua.includes('windows')) {
    os.name = 'Windows';
    if (ua.includes('windows nt 10')) os.version = '10';
    else if (ua.includes('windows nt 11')) os.version = '11';
    else if (ua.includes('windows nt 6.3')) os.version = '8.1';
    else if (ua.includes('windows nt 6.2')) os.version = '8';
    else if (ua.includes('windows nt 6.1')) os.version = '7';
  } else if (ua.includes('mac os x')) {
    os.name = 'macOS';
    os.version = extractVersion(userAgent, /Mac OS X (\d+[._\d]*)/i)?.replace(/_/g, '.') || 'unknown';
  } else if (ua.includes('linux')) {
    os.name = 'Linux';
    if (ua.includes('ubuntu')) os.version = 'Ubuntu';
    else if (ua.includes('fedora')) os.version = 'Fedora';
  } else if (ua.includes('android')) {
    os.name = 'Android';
    os.version = extractVersion(userAgent, /Android (\d+[\d.]*)/i);
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os.name = 'iOS';
    os.version = extractVersion(userAgent, /OS (\d+[._\d]*)/i)?.replace(/_/g, '.') || 'unknown';
  }
  
  // Detect device type
  let device = { type: 'desktop', vendor: 'unknown', model: 'unknown' };
  
  if (ua.includes('mobile') || ua.includes('android') && !ua.includes('tablet')) {
    device.type = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device.type = 'tablet';
  }
  
  // Detect device vendor/model
  if (ua.includes('iphone')) {
    device.vendor = 'Apple';
    device.model = 'iPhone';
  } else if (ua.includes('ipad')) {
    device.vendor = 'Apple';
    device.model = 'iPad';
  } else if (ua.includes('macintosh')) {
    device.vendor = 'Apple';
    device.model = 'Mac';
  } else if (ua.includes('samsung')) {
    device.vendor = 'Samsung';
  } else if (ua.includes('pixel')) {
    device.vendor = 'Google';
    device.model = 'Pixel';
  }
  
  return { browser, os, device };
};

/**
 * Extract version number from user agent string
 * @param {string} userAgent - User agent string
 * @param {RegExp} regex - Regex pattern with capture group for version
 * @returns {string|null} - Extracted version or null
 */
const extractVersion = (userAgent, regex) => {
  const match = userAgent.match(regex);
  return match ? match[1] : null;
};

/**
 * Extract complete device information from request
 * @param {Object} req - Express request object
 * @returns {Object} - Complete device information object
 */
export const extractDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const { browser, os, device } = parseUserAgent(userAgent);
  
  return {
    ip: getClientIp(req),
    userAgent: userAgent,
    browser: browser,
    os: os,
    device: device,
    platform: os.name,
    language: req.headers['accept-language']?.split(',')[0] || 'unknown',
    timezone: req.body?.timezone || req.headers['x-timezone'] || 'unknown',
    screenResolution: req.body?.screenResolution || 'unknown'
  };
};

/**
 * Create a session history entry
 * @param {Object} req - Express request object
 * @returns {Object} - Session history entry
 */
export const createSessionEntry = (req) => {
  const { browser, os, device } = parseUserAgent(req.headers['user-agent'] || '');
  
  return {
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || 'unknown',
    browser: `${browser.name} ${browser.version}`,
    os: `${os.name} ${os.version}`,
    deviceType: device.type,
    timestamp: new Date()
  };
};

export default {
  getClientIp,
  parseUserAgent,
  extractDeviceInfo,
  createSessionEntry
};
