const ottomanSubcategories = new Set([
  // 'ottoman-divan-beds',
  // 'upholstered-ottoman-bed',
  'headboards',
]);

const isTestingHost = (hostname: string) =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === 'somne-f5b59.web.app' ||
  hostname.endsWith('--somne-f5b59.web.app') ||
  hostname === 'somne-f5b59.firebaseapp.com';

export const shouldShowOttomanComingSoon = (
  subcategory: string | undefined,
  hostname = typeof window === 'undefined' ? '' : window.location.hostname,
) => ottomanSubcategories.has(subcategory || '') && !isTestingHost(hostname);
