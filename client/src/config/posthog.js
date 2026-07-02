const projectUrl = import.meta.env.POSTHOG_PROJECT_URL?.trim() || '';

export const POSTHOG_PROJECT_URL = projectUrl;

export function buildPosthogUrl(path = '') {
  if (!POSTHOG_PROJECT_URL) {
    return '';
  }

  try {
    const url = new URL(POSTHOG_PROJECT_URL);
    const basePath = url.pathname.replace(/\/+$/, '');
    const nextPath = String(path || '').trim().replace(/^\/+/, '');

    url.pathname = nextPath ? `${basePath}/${nextPath}` : basePath || '/';
    return url.toString();
  } catch {
    return POSTHOG_PROJECT_URL;
  }
}
