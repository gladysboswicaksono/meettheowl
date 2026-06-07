const assert = require('node:assert/strict');
const test = require('node:test');

const {
  createRateLimiter,
  createTrackEventHandler,
  validatePayload,
} = require('./track-event-handler');

function createRequest(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      origin: 'https://meettheowl.com',
      'content-type': 'application/json',
    },
    body: {
      session_id: 'session-1',
      event_type: 'page_view',
      page: '/',
      label: null,
      properties: { device_type: 'desktop' },
    },
    ip: '203.0.113.10',
    is(type) {
      return type === 'application/json';
    },
    ...overrides,
  };
}

function createResponse() {
  return {
    headers: {},
    statusCode: null,
    body: null,
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('accepts a valid analytics event', async () => {
  const inserted = [];
  const handler = createTrackEventHandler({
    insert: async (row) => inserted.push(row),
    now: () => new Date('2026-06-07T12:00:00Z'),
  });
  const res = createResponse();

  await handler(createRequest(), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true });
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].session_id, 'session-1');
  assert.equal(inserted[0].properties, '{"device_type":"desktop"}');
});

test('rejects requests from unapproved or missing origins', async () => {
  const handler = createTrackEventHandler({ insert: async () => {} });

  for (const origin of ['https://example.com', undefined]) {
    const req = createRequest({
      headers: { 'content-type': 'application/json', origin },
    });
    const res = createResponse();
    await handler(req, res);
    assert.equal(res.statusCode, 403);
  }
});

test('rejects non-JSON requests and oversized bodies', async () => {
  const handler = createTrackEventHandler({ insert: async () => {} });

  const nonJsonRes = createResponse();
  await handler(createRequest({ is: () => false }), nonJsonRes);
  assert.equal(nonJsonRes.statusCode, 415);

  const oversizedRes = createResponse();
  await handler(createRequest({
    headers: {
      origin: 'https://meettheowl.com',
      'content-type': 'application/json',
      'content-length': String(16 * 1024 + 1),
    },
  }), oversizedRes);
  assert.equal(oversizedRes.statusCode, 413);
});

test('validates required fields, field types, and properties size', () => {
  assert.match(validatePayload({}).error, /session_id/);
  assert.match(validatePayload({
    session_id: 'session-1',
    event_type: 42,
  }).error, /event_type/);
  assert.match(validatePayload({
    session_id: 'session-1',
    event_type: 'click',
    properties: 'not-an-object',
  }).error, /properties/);
  assert.match(validatePayload({
    session_id: 'session-1',
    event_type: 'click',
    properties: { value: 'x'.repeat(9 * 1024) },
  }).error, /exceeds/);
});

test('rate limiter resets after its configured window', () => {
  const isRateLimited = createRateLimiter({ windowMs: 1000, maxRequests: 2 });

  assert.equal(isRateLimited('client', 0), false);
  assert.equal(isRateLimited('client', 100), false);
  assert.equal(isRateLimited('client', 200), true);
  assert.equal(isRateLimited('client', 1000), false);
});

test('returns 429 before inserting a rate-limited event', async () => {
  let insertCount = 0;
  const handler = createTrackEventHandler({
    insert: async () => { insertCount += 1; },
    isRateLimited: () => true,
  });
  const res = createResponse();

  await handler(createRequest(), res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['Retry-After'], '60');
  assert.equal(insertCount, 0);
});
