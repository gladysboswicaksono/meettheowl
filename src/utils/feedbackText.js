const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

export function decodeFeedbackText(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/&(amp|lt|gt|quot|#39);/g, entity => ENTITIES[entity]);
}
