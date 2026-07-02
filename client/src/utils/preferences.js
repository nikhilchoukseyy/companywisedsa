const COOKIE_NAME = 'dsa_prefs';

export const defaultPreferences = {
  lastCompany: '',
  lastFile: '5. All.csv',
  difficultyFilter: 'ALL',
  searchText: '',
  currentPage: 1,
  pageSize: 25,
  preferredLanguage: 'python',
};

export function readCookiePreferences() {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) {
    return { ...defaultPreferences };
  }

  try {
    const value = decodeURIComponent(cookie.split('=')[1]);
    return {
      ...defaultPreferences,
      ...JSON.parse(value),
    };
  } catch (error) {
    return { ...defaultPreferences };
  }
}

export function writeCookiePreferences(preferences) {
  const payload = encodeURIComponent(JSON.stringify(preferences));
  document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
