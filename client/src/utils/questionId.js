export function createQuestionId(link, title) {
  const normalizedLink = String(link || '').trim().replace(/\/+$/, '');

  if (normalizedLink) {
    try {
      const url = new URL(normalizedLink);
      const slug = url.pathname
        .split('/')
        .filter(Boolean)
        .pop();

      if (slug) {
        return slug.toLowerCase();
      }
    } catch (error) {
      return normalizedLink.toLowerCase();
    }
  }

  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
