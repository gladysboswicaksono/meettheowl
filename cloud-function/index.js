const { BigQuery } = require('@google-cloud/bigquery');
const { createTrackEventHandler } = require('./track-event-handler');

const bigquery = new BigQuery({ projectId: 'meettheowl' });
const DATASET = 'portfolio_analytics';
const TABLE = 'events';

async function insertEvent(row) {
  await bigquery.dataset(DATASET).table(TABLE).insert([row]);
}

exports.trackEvent = createTrackEventHandler({
  insert: insertEvent,
  createTimestamp: (date) => BigQuery.timestamp(date),
});
