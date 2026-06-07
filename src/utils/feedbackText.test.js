import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { decodeFeedbackText } from './feedbackText.js';

test('decodes feedback entities for safe React text rendering', () => {
  assert.equal(
    decodeFeedbackText('Add &lt;h1&gt; and use &amp; carefully.'),
    'Add <h1> and use & carefully.',
  );
});

test('React escapes malicious-looking feedback instead of rendering it as HTML', () => {
  const output = renderToStaticMarkup(
    createElement('div', null, decodeFeedbackText('<img src=x onerror=alert(1)>')),
  );

  assert.equal(output, '<div>&lt;img src=x onerror=alert(1)&gt;</div>');
});

test('preserves non-string feedback nodes', () => {
  const node = { type: 'code' };
  assert.equal(decodeFeedbackText(node), node);
});
