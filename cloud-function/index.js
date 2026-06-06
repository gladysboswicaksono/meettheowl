const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery({ projectId: 'meettheowl' });
const DATASET = 'portfolio_analytics';
const TABLE = 'events';

const ALLOWED_ORIGINS = [
  'https://meettheowl.com',
  'https://www.meettheowl.com',
  'http://localhost:5173',
];

exports.trackEvent = async (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { session_id, event_type, page, label, properties } = req.body || {};

  if (!session_id || !event_type) {
    return res.status(400).send('Missing required fields: session_id, event_type');
  }

  const row = {
    session_id,
    timestamp: BigQuery.timestamp(new Date()),
    event_type,
    page: page || null,
    label: label || null,
    properties: properties ? JSON.stringify(properties) : null,
  };

  try {
    await bigquery.dataset(DATASET).table(TABLE).insert([row]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('BigQuery insert error:', err);
    return res.status(500).send('Internal Server Error');
  }
};
