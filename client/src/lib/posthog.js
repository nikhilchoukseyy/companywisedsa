import posthog from 'posthog-js';

const apiKey = import.meta.env.VITE_POSTHOG_KEY?.trim() || '';
const apiHost = import.meta.env.VITE_POSTHOG_HOST?.trim() || '';

export const isPostHogConfigured = Boolean(apiKey && apiHost);

let initialized = false;

function initializePosthog() {
  if (initialized || typeof window === 'undefined' || !isPostHogConfigured) {
    return;
  }

  try {
    posthog.init(apiKey, {
      api_host: apiHost,
      autocapture: true,
      capture_pageview: 'history_change',
      capture_pageleave: true,
      capture_heatmaps: true,
      capture_exceptions: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
      },
    });
    initialized = true;
  } catch {
    initialized = false;
  }
}

initializePosthog();

export default posthog;
