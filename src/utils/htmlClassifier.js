// ── HTML structure classifier for the HTML & CSS course exercises ──────────────
// Pure functions — no DOM side-effects except normalizeHTML (DOMParser).

export const EXERCISES = {
  'html-text-tags': {
    required: ['h1', 'h2', 'h3', 'p', 'p'],
    bonusAttrs: ['style', 'class'],
  },
};

export function extractNodes(parent) {
  const result = [];
  for (const child of parent.children) {
    result.push({
      tag: child.tagName.toLowerCase(),
      attrs: Array.from(child.attributes).map(a => a.name),
      children: extractNodes(child),
    });
  }
  return result;
}

export function normalizeHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return extractNodes(doc.body);
}

export function findTagsDeep(nodes) {
  const found = new Set();
  for (const n of nodes) {
    found.add(n.tag);
    findTagsDeep(n.children).forEach(t => found.add(t));
  }
  return found;
}

export const INLINE_TAGS = new Set(['strong','em','span','a','code','mark','b','i','u','small','sub','sup']);

export function findDeepExtras(nodes, bonusAttrs) {
  let hasStyleOrClass = false;
  const inlineTags = new Set();
  function walk(ns) {
    for (const n of ns) {
      if (n.attrs.some(a => bonusAttrs.includes(a))) hasStyleOrClass = true;
      if (INLINE_TAGS.has(n.tag)) inlineTags.add(n.tag);
      walk(n.children);
    }
  }
  walk(nodes);
  return { hasStyleOrClass, inlineTags };
}

export function classify(nodes, exerciseId) {
  const spec = EXERCISES[exerciseId];
  if (!spec) return { type: 'DIVERGENT', missing: [], extraTags: [] };
  if (nodes.length === 0) return { type: 'EMPTY' };

  const required      = spec.required;
  const uniqueRequired = [...new Set(required)];

  const submittedCounts = {};
  for (const n of nodes) submittedCounts[n.tag] = (submittedCounts[n.tag] || 0) + 1;

  const requiredCounts = {};
  for (const t of required) requiredCounts[t] = (requiredCounts[t] || 0) + 1;

  const missing = [];
  let hasAllRequired = true;
  for (const t of uniqueRequired) {
    const need = requiredCounts[t] || 0;
    const have = submittedCounts[t] || 0;
    if (have < need) {
      hasAllRequired = false;
      for (let i = 0; i < need - have; i++) missing.push(t);
    }
  }

  const extraTags = [];
  for (const t of Object.keys(submittedCounts)) {
    const extra = submittedCounts[t] - (requiredCounts[t] || 0);
    for (let i = 0; i < extra; i++) extraTags.push(t);
  }

  const recognisedCount = uniqueRequired.filter(t => submittedCounts[t] > 0).length;

  const deepExtras = findDeepExtras(nodes, spec.bonusAttrs);
  const extraAttrs  = deepExtras.hasStyleOrClass;
  const extraInline = deepExtras.inlineTags;
  const hasExtras   = extraTags.length > 0 || extraAttrs || extraInline.size > 0;

  // DIVERGENT: too few required tags recognised at top level
  if (!hasAllRequired && recognisedCount < Math.ceil(uniqueRequired.length / 2)) {
    const deepFound = findTagsDeep(nodes);
    if (uniqueRequired.every(t => deepFound.has(t))) {
      // Tags exist but are nested — PARTIAL with nesting flag
      return { type: 'PARTIAL', missing, extraTags, nesting: true };
    }
    return { type: 'DIVERGENT', missing, extraTags };
  }

  if (!hasAllRequired) return { type: 'PARTIAL', missing, extraTags, extraInline, extraAttrs };
  if (hasExtras)        return { type: 'SUPERSET', extraTags, extraAttrs, extraInline };
  return { type: 'MATCH' };
}

export function buildFeedbackText(result) {
  switch (result.type) {
    case 'EMPTY':
      return null;

    case 'MATCH':
      return 'That matches. h1, h2, h3, and two p elements, all five in place. Well done!';

    case 'SUPERSET': {
      const parts = [];
      if (result.extraInline?.size)
        parts.push(`used ${[...result.extraInline].map(t => `&lt;${t}&gt;`).join(' and ')} inside your tags`);
      if (result.extraAttrs) parts.push('added inline styling');
      if (result.extraTags.length) {
        const tagList = [...new Set(result.extraTags)].map(t => `&lt;${t}&gt;`).join(', ');
        parts.push(`included ${tagList} beyond what was asked`);
      }
      const detail = parts.length
        ? `You also ${parts.join(' and ')} which goes further than the practice asked, really great work!`
        : '';
      return `The required structure is there. ${detail}`.trim();
    }

    case 'PARTIAL': {
      if (result.nesting) {
        return 'The right tags are all there, but they need to sit directly in the body — not inside a &lt;div&gt; or any other wrapper. Remove the container and place your tags at the top level.';
      }
      const missingList = [...new Set(result.missing)].map(t => {
        const count = result.missing.filter(x => x === t).length;
        return count > 1 ? `${count} &lt;${t}&gt; elements` : `a &lt;${t}&gt;`;
      });
      const missingDesc = missingList.join(' and ');
      const niceExtras = [];
      if (result.extraInline?.size) niceExtras.push([...result.extraInline].map(t => `&lt;${t}&gt;`).join(' and '));
      if (result.extraAttrs) niceExtras.push('inline styling');
      if (niceExtras.length) {
        return `Almost! You're missing ${missingDesc}. The ${niceExtras.join(' and ')} you added is a nice touch, though! Get the missing tags in place and you're done.`;
      }
      return `Almost! you're missing ${missingDesc}. Check that each tag has an opening and a closing half.`;
    }

    case 'DIVERGENT':
      return undefined; // caller handles async

    default:
      return null;
  }
}
