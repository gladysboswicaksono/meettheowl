const ENDPOINT = 'https://us-central1-meettheowl.cloudfunctions.net/trackEvent';

function getSessionId() {
  let id = sessionStorage.getItem('_sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('_sid', id);
  }
  return id;
}

function isNoTrack() {
  if (window.location.hostname === 'localhost') return true;
  if (sessionStorage.getItem('notrack') === '1') return true;
  const params = new URLSearchParams(window.location.search);
  if (params.get('notrack') === '1') {
    sessionStorage.setItem('notrack', '1');
    return true;
  }
  return false;
}

export function getDeviceContext() {
  return {
    device_type: window.innerWidth <= 600 ? 'phone' : window.innerWidth <= 900 ? 'tablet' : 'desktop',
    viewport_width: window.innerWidth,
    screen_width: window.screen.width,
  };
}

export function trackEvent(event_type, page, label, properties = {}) {
  if (isNoTrack()) return;
  const payload = {
    session_id: getSessionId(),
    event_type,
    page: page || window.location.pathname,
    label: label || null,
    properties: { ...getDeviceContext(), ...properties },
  };
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function trackPageView(page) {
  trackEvent('page_view', page, null);
}

export function trackClick(label, properties = {}) {
  trackEvent('click', null, label, properties);
}
