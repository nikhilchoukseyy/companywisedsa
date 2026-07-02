import posthog, { isPostHogConfigured } from '../lib/posthog';

const listeners = new Set();

const initialSnapshot = {
  configured: isPostHogConfigured,
  eventCount: 0,
  lastEvent: '',
  lastEventAt: '',
  lastError: '',
  identifiedUser: null,
  sessionId: '',
  featureFlags: [],
};

let snapshot = initialSnapshot;

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Snapshot listeners must never break the app shell.
    }
  });
}

function getSessionId() {
  try {
    return posthog.get_session_id?.() || '';
  } catch {
    return '';
  }
}

function getSafeUserProperties(user) {
  if (!user) {
    return {};
  }

  return {
    name: user.name || '',
    email: user.email || '',
    picture: user.picture || user.avatar || '',
    role: user.role || 'user',
    authProvider: user.authProvider || '',
  };
}

function updateSnapshot(patch) {
  snapshot = {
    ...snapshot,
    ...patch,
    configured: isPostHogConfigured,
  };
  emitChange();
}

function normalizeFeatureFlags(featureFlags = []) {
  return featureFlags.map((flag) => ({
    key: flag?.key || flag?.flag || flag?.name || 'flag',
    value:
      flag?.value ??
      flag?.variant ??
      flag?.enabled ??
      flag?.payload ??
      flag?.description ??
      'enabled',
  }));
}

function refreshFeatureFlags(featureFlags) {
  snapshot = {
    ...snapshot,
    configured: isPostHogConfigured,
    featureFlags: normalizeFeatureFlags(featureFlags),
  };
  emitChange();
}

if (isPostHogConfigured) {
  try {
    refreshFeatureFlags(posthog.getAllFeatureFlags?.() || []);
    posthog.onFeatureFlags?.((featureFlags) => {
      refreshFeatureFlags(featureFlags || []);
    });
  } catch {
    // Feature flags are optional and should never break the app shell.
  }
}

function trackEvent(eventName, properties = {}) {
  const sessionId = getSessionId();

  snapshot = {
    ...snapshot,
    configured: isPostHogConfigured,
    eventCount: snapshot.eventCount + 1,
    lastEvent: eventName,
    lastEventAt: new Date().toISOString(),
    sessionId: sessionId || snapshot.sessionId,
  };
  emitChange();

  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.capture(eventName, {
      ...properties,
      session_id: sessionId || undefined,
    });
  } catch {
    // Analytics should never block the UI.
  }
}

export function identifyAnalyticsUser(user) {
  const userId = String(user?.id || '');
  const properties = getSafeUserProperties(user);

  updateSnapshot({
    identifiedUser: userId
      ? {
          id: userId,
          ...properties,
        }
      : null,
    sessionId: getSessionId(),
  });

  if (!isPostHogConfigured || !userId) {
    return;
  }

  try {
    posthog.identify(
      userId,
      properties,
      {
        signup_date: user?.createdAt || undefined,
      }
    );
  } catch {
    // Keep auth resilient even if analytics misbehaves.
  }
}

export function resetAnalytics() {
  try {
    posthog.reset?.();
  } catch {
    // Ignore reset failures and keep logout working.
  }

  updateSnapshot({
    identifiedUser: null,
    sessionId: getSessionId(),
  });

  refreshFeatureFlags(posthog.getAllFeatureFlags?.() || []);
}

export function captureAnalyticsException(error, additionalProperties = {}) {
  const message = error instanceof Error ? error.message : String(error || 'Unknown error');

  snapshot = {
    ...snapshot,
    configured: isPostHogConfigured,
    eventCount: snapshot.eventCount + 1,
    lastEvent: 'app_exception',
    lastEventAt: new Date().toISOString(),
    lastError: message,
    sessionId: getSessionId() || snapshot.sessionId,
  };
  emitChange();

  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.captureException(error, {
      source: additionalProperties.source || 'unknown',
      ...additionalProperties,
    });
  } catch {
    // Best-effort only.
  }
}

export function trackLogin(method, user) {
  trackEvent('auth_login', {
    method,
    user_id: user?.id || '',
    role: user?.role || 'user',
  });
}

export function trackLogout(user) {
  trackEvent('auth_logout', {
    user_id: user?.id || '',
    role: user?.role || 'user',
  });
}

export function trackSearch(scope, query, extra = {}) {
  trackEvent('search', {
    scope,
    query,
    query_length: String(query || '').length,
    ...extra,
  });
}

export function trackNavigation(from, to, extra = {}) {
  trackEvent('navigation', {
    from,
    to,
    ...extra,
  });
}

export function trackCompanyViewed(company, extra = {}) {
  trackEvent('company_viewed', {
    company,
    ...extra,
  });
}

export function trackQuestionViewed(question, extra = {}) {
  trackEvent('question_viewed', {
    question_id: question?.questionId || question?.id || '',
    title: question?.Title || question?.title || '',
    company: question?.company || question?.companyName || '',
    difficulty: question?.Difficulty || question?.difficulty || '',
    ...extra,
  });
}

export function trackQuestionListRange(company, fileName, extra = {}) {
  trackEvent('question_range_selected', {
    company,
    file_name: fileName,
    ...extra,
  });
}

export function trackQuestionSolved(question, solved, extra = {}) {
  trackEvent('question_solved_state_changed', {
    question_id: question?.questionId || question?.id || '',
    title: question?.Title || question?.title || '',
    solved: Boolean(solved),
    ...extra,
  });
}

export function trackBookmarkAdded(question, extra = {}) {
  trackEvent('question_bookmarked', {
    question_id: question?.questionId || question?.id || '',
    title: question?.Title || question?.title || '',
    bookmarked: true,
    ...extra,
  });
}

export function trackBookmarkRemoved(question, extra = {}) {
  trackEvent('question_bookmarked', {
    question_id: question?.questionId || question?.id || '',
    title: question?.Title || question?.title || '',
    bookmarked: false,
    ...extra,
  });
}

export function trackFeedbackSubmitted(extra = {}) {
  trackEvent('feedback_submitted', extra);
}

export function trackAdminPage(page, extra = {}) {
  trackEvent('admin_page_viewed', {
    page,
    ...extra,
  });
}

export function trackAdminAction(action, extra = {}) {
  trackEvent('admin_action', {
    action,
    ...extra,
  });
}

export function trackCompilerOpened(language, extra = {}) {
  trackEvent('compiler_opened', {
    language,
    ...extra,
  });
}

export function trackCompilerRun(language, extra = {}) {
  trackEvent('compiler_run', {
    language,
    ...extra,
  });
}

export function getFeatureFlagsSnapshot() {
  return snapshot.featureFlags || [];
}

export function getAnalyticsSnapshot() {
  return snapshot;
}

export function subscribeAnalyticsSnapshot(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
