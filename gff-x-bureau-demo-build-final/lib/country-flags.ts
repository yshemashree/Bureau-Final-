/**
 * Country code to flag emoji mapping utility
 */

// Convert country code to flag emoji using regional indicator symbols
export function getCountryFlag(countryCode: string): string {
  const code = countryCode.toUpperCase();
  
  // Regional indicator symbols start at 0x1F1E6 for 'A'
  const base = 0x1F1E6;
  
  if (code.length !== 2) return '';
  
  const first = code.charCodeAt(0) - 65 + base;
  const second = code.charCodeAt(1) - 65 + base;
  
  return String.fromCodePoint(first, second);
}

// Pre-defined mapping for common countries (fallback if needed)
export const COUNTRY_FLAGS: Record<string, string> = {
  AR: '🇦🇷',
  AU: '🇦🇺',
  AT: '🇦🇹',
  BE: '🇧🇪',
  BR: '🇧🇷',
  KH: '🇰🇭',
  CA: '🇨🇦',
  CL: '🇨🇱',
  CN: '🇨🇳',
  CZ: '🇨🇿',
  DK: '🇩🇰',
  FI: '🇫🇮',
  FR: '🇫🇷',
  DE: '🇩🇪',
  GR: '🇬🇷',
  HK: '🇭🇰',
  ID: '🇮🇩',
  IN: '🇮🇳',
  IT: '🇮🇹',
  KE: '🇰🇪',
  MY: '🇲🇾',
  MX: '🇲🇽',
  MA: '🇲🇦',
  NL: '🇳🇱',
  NZ: '🇳🇿',
  NG: '🇳🇬',
  PE: '🇵🇪',
  PH: '🇵🇭',
  PL: '🇵🇱',
  SG: '🇸🇬',
  SK: '🇸🇰',
  ZA: '🇿🇦',
  ES: '🇪🇸',
  SE: '🇸🇪',
  CH: '🇨🇭',
  TH: '🇹🇭',
  GB: '🇬🇧',
  US: '🇺🇸',
};
