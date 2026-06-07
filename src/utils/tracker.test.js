import assert from 'node:assert/strict';
import test from 'node:test';

import { getDeviceContext, trackEvent } from './tracker.js';

function setBrowserGlobals({ innerWidth = 1280, screenWidth = 1920 } = {}) {
  const storage = new Map([['_sid', 'session-1']]);
  globalThis.window = {
    innerWidth,
    location: { pathname: '/training-impact', search: '' },
    screen: { width: screenWidth },
  };
  globalThis.sessionStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
}

test('classifies phone, tablet, and desktop viewport widths', () => {
  setBrowserGlobals({ innerWidth: 600, screenWidth: 1170 });
  assert.deepEqual(getDeviceContext(), {
    device_type: 'phone',
    viewport_width: 600,
    screen_width: 1170,
  });

  window.innerWidth = 900;
  assert.equal(getDeviceContext().device_type, 'tablet');

  window.innerWidth = 901;
  assert.equal(getDeviceContext().device_type, 'desktop');
});

test('adds all device context fields to event properties', () => {
  setBrowserGlobals({ innerWidth: 820, screenWidth: 1440 });
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return { ok: true };
  };

  trackEvent('click', null, 'report-link', { destination: 'power-bi' });

  const payload = JSON.parse(request.options.body);
  assert.deepEqual(payload.properties, {
    device_type: 'tablet',
    viewport_width: 820,
    screen_width: 1440,
    destination: 'power-bi',
  });
});
