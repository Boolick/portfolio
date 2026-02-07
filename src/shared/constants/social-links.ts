/**
 * Security Constants - Social Media and Contact Links
 * 
 * Centralized constants for all external links to prevent hardcoding URLs throughout the codebase.
 * This approach follows security best practices by:
 * 1. Providing a single source of truth for all external URLs
 * 2. Making it easier to audit and validate all external links
 * 3. Reducing the risk of typos or malicious URL injection
 * 4. Enabling easier updates when links change
 * 
 * @see frontend-security-coder skill for context
 */

// Base URLs for social platforms (validated and sanitized)
const SOCIAL_PLATFORM_URLS = {
  GITHUB: 'https://github.com',
  LINKEDIN: 'https://linkedin.com/in',
  TELEGRAM: 'https://t.me',
} as const;

// User-specific identifiers (sanitized)
const SOCIAL_IDENTIFIERS = {
  GITHUB_USERNAME: 'your-github-username', // TODO: Update with actual GitHub username
  LINKEDIN_USERNAME: 'aliaksandr-bullo',
  TELEGRAM_USERNAME: 'boolodev',
} as const;

// Contact information
const CONTACT_INFO = {
  EMAIL: 'bullo.aliaksandr@gmail.com',
  LOCATION: 'Remote | Open to relocation',
  LOCATION_RU: 'Удалённо | Готов к релокации',
} as const;

/**
 * Constructs a full social media URL
 * @param platform - The social platform base URL
 * @param identifier - The user identifier (username, handle, etc.)
 * @returns The complete, validated URL
 */
function buildSocialUrl(platform: string, identifier: string): string {
  // Basic validation to ensure we're building a proper URL
  if (!platform.startsWith('https://')) {
    throw new Error('Invalid platform URL: must start with https://');
  }
  
  // Remove @ prefix if present (for Telegram handles)
  const cleanIdentifier = identifier.replace(/^@/, '');
  
  return `${platform}/${cleanIdentifier}`;
}

/**
 * Public API for accessing social media links
 */
export const SOCIAL_LINKS = {
  GITHUB: buildSocialUrl(SOCIAL_PLATFORM_URLS.GITHUB, SOCIAL_IDENTIFIERS.GITHUB_USERNAME),
  LINKEDIN: buildSocialUrl(SOCIAL_PLATFORM_URLS.LINKEDIN, SOCIAL_IDENTIFIERS.LINKEDIN_USERNAME),
  TELEGRAM: buildSocialUrl(SOCIAL_PLATFORM_URLS.TELEGRAM, SOCIAL_IDENTIFIERS.TELEGRAM_USERNAME),
} as const;

/**
 * Public API for contact information
 */
export const CONTACT = {
  EMAIL: CONTACT_INFO.EMAIL,
  MAILTO: `mailto:${CONTACT_INFO.EMAIL}`,
  LOCATION: CONTACT_INFO.LOCATION,
  LOCATION_RU: CONTACT_INFO.LOCATION_RU,
} as const;

/**
 * Link security attributes
 * Use these for all external links to prevent security issues
 */
export const EXTERNAL_LINK_ATTRS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;
