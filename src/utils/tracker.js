const ENDPOINT = 'https://us-central1-meettheowl.cloudfunctions.net/trackEvent';

let resolveFirstTrackingResult;
const firstTrackingResult = new Promise((resolve) => {
  resolveFirstTrackingResult = resolve;
});
let firstTrackingResultSettled = false;

function settleFirstTrackingResult(result) {
  if (firstTrackingResultSettled) return;
  firstTrackingResultSettled = true;
  resolveFirstTrackingResult(result);
}

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
  if (isNoTrack()) {
    settleFirstTrackingResult('intentionally-disabled');
    return Promise.resolve('intentionally-disabled');
  }

  const payload = {
    session_id: getSessionId(),
    event_type,
    page: page || window.location.pathname,
    label: label || null,
    properties: { ...getDeviceContext(), ...properties },
  };
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((response) => {
      const result = response.ok ? 'working' : 'failed';
      settleFirstTrackingResult(result);
      return result;
    })
    .catch(() => {
      settleFirstTrackingResult('failed');
      return 'failed';
    });
}

export function trackPageView(page) {
  return trackEvent('page_view', page, null);
}

export function trackClick(label, properties = {}) {
  return trackEvent('click', null, label, properties);
}

export function getFirstTrackingResult() {
  return firstTrackingResult;
}
