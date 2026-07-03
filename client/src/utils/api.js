function normalizeApiBaseUrl(value) {
  const rawUrl = (value || 'http://localhost:4000/api').trim().replace(/\/+$/, '');

  if (rawUrl.endsWith('/api')) {
    return rawUrl;
  }

  return `${rawUrl}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const authApi = {
  me: () => apiRequest('/auth/me'),
  google: (payload) =>
    apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

export const userApi = {
  dashboard: () => apiRequest('/users/me/dashboard'),
  progress: () => apiRequest('/users/progress'),
  bookmarks: () => apiRequest('/users/bookmarks'),
  savePreferences: (payload) =>
    apiRequest('/users/me/preferences', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

export const feedbackApi = {
  send: (payload) =>
    apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const questionApi = {
  markSolved: (questionId) =>
    apiRequest(`/questions/${questionId}/solve`, {
      method: 'POST',
    }),
  unmarkSolved: (questionId) =>
    apiRequest(`/questions/${questionId}/solve`, {
      method: 'DELETE',
    }),
  markBookmarked: (questionId) =>
    apiRequest(`/questions/${questionId}/bookmark`, {
      method: 'POST',
    }),
  unmarkBookmarked: (questionId) =>
    apiRequest(`/questions/${questionId}/bookmark`, {
      method: 'DELETE',
    }),
};

export const adminApi = {
  dashboard: () => apiRequest('/admin/dashboard'),
};
