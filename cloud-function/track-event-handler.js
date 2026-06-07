const ALLOWED_ORIGINS = new Set([
  'https://meettheowl.com',
  'https://www.meettheowl.com',
  'http://localhost:5173',
]);

const MAX_BODY_BYTES = 16 * 1024;
const MAX_PROPERTIES_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const MAX_RATE_LIMIT_CLIENTS = 10_000;

const FIELD_LIMITS = {
  session_id: 128,
  event_type: 64,
  page: 512,
  label: 512,
};

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter({
  windowMs = RATE_LIMIT_WINDOW_MS,
  maxRequests = RATE_LIMIT_MAX_REQUESTS,
} = {}) {
  const clients = new Map();

  return function isRateLimited(key, now = Date.now()) {
    const current = clients.get(key);
    if (!current || now - current.windowStart >= windowMs) {
      if (!current && clients.size >= MAX_RATE_LIMIT_CLIENTS) {
        clients.delete(clients.keys().next().value);
      }
      clients.set(key, { count: 1, windowStart: now });
      return false;
    }

    current.count += 1;
    return current.count > maxRequests;
  };
}

function validateOptionalString(value, field) {
  if (value == null) return null;
  if (typeof value !== 'string') {
    return { error: `${field} must be a string` };
  }
  if (value.length > FIELD_LIMITS[field]) {
    return { error: `${field} exceeds ${FIELD_LIMITS[field]} characters` };
  }
  return value;
}

function validatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const sessionId = validateOptionalString(body.session_id, 'session_id');
  if (sessionId && typeof sessionId === 'object') return sessionId;
  if (!sessionId?.trim()) {
    return { error: 'session_id is required' };
  }

  const eventType = validateOptionalString(body.event_type, 'event_type');
  if (eventType && typeof eventType === 'object') return eventType;
  if (!eventType?.trim()) {
    return { error: 'event_type is required' };
  }

  const page = validateOptionalString(body.page, 'page');
  if (page && typeof page === 'object') return page;

  const label = validateOptionalString(body.label, 'label');
  if (label && typeof label === 'object') return label;

  if (
    body.properties != null
    && (
      typeof body.properties !== 'object'
      || Array.isArray(body.properties)
    )
  ) {
    return { error: 'properties must be a JSON object' };
  }

  let properties = null;
  if (body.properties != null) {
    try {
      properties = JSON.stringify(body.properties);
    } catch {
      return { error: 'properties must be JSON-serializable' };
    }

    if (Buffer.byteLength(properties, 'utf8') > MAX_PROPERTIES_BYTES) {
      return { error: `properties exceeds ${MAX_PROPERTIES_BYTES} bytes` };
    }
  }

  return {
    value: {
      session_id: sessionId.trim(),
      event_type: eventType.trim(),
      page,
      label,
      properties,
    },
  };
}

function isBodyTooLarge(req) {
  const contentLength = Number(req.headers['content-length']);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return true;
  }

  try {
    return Buffer.byteLength(JSON.stringify(req.body), 'utf8') > MAX_BODY_BYTES;
  } catch {
    return true;
  }
}

function createTrackEventHandler({
  insert,
  isRateLimited = createRateLimiter(),
  now = () => new Date(),
  createTimestamp = (date) => date,
} = {}) {
  if (typeof insert !== 'function') {
    throw new TypeError('createTrackEventHandler requires an insert function');
  }

  return async function trackEvent(req, res) {
    const origin = req.headers.origin;
    if (!ALLOWED_ORIGINS.has(origin)) {
      return res.status(403).send('Origin not allowed');
    }

    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(204).send('');
    }

    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    if (!req.is?.('application/json')) {
      return res.status(415).send('Content-Type must be application/json');
    }

    if (isBodyTooLarge(req)) {
      return res.status(413).send('Request body too large');
    }

    if (isRateLimited(getClientIp(req))) {
      res.set('Retry-After', String(RATE_LIMIT_WINDOW_MS / 1000));
      return res.status(429).send('Too many requests');
    }

    const validated = validatePayload(req.body);
    if (validated.error) {
      return res.status(400).send(validated.error);
    }

    const row = {
      ...validated.value,
      timestamp: createTimestamp(now()),
    };

    try {
      await insert(row);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('BigQuery insert error:', err);
      return res.status(500).send('Internal Server Error');
    }
  };
}

module.exports = {
  createRateLimiter,
  createTrackEventHandler,
  validatePayload,
};
