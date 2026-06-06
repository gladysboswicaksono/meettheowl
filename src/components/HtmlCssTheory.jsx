// Theory section — Document Structure + Text Tags reference cards.
// Purely presentational, no state.

export default function HtmlCssTheory() {
  return (
    <div className="lesson">

      {/* ── Document structure ────────────────────────────── */}
      <div className="lesson__divider">Document structure<hr /></div>

      <p className="lesson__p">
        A browser needs to be told what it's reading. HTML does that with tags — labels you wrap
        around content so the browser knows a heading from a paragraph. Every page starts from the
        same small structure, and each tag has an opening and a closing half; everything between
        them belongs to that tag.
      </p>
      <p className="lesson__p">
        <span className="inline-code">&lt;!DOCTYPE html&gt;</span> is the one exception: it's a
        declaration, not a tag, so it stands alone.
      </p>

      <div className="ref-card">
        <div className="ref-card__left">
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;!DOCTYPE html&gt;</span>
            <span className="ref-card__desc">Tells the browser to read the page as modern HTML</span>
          </div>
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;html&gt;</span>
            <span className="ref-card__desc">Wraps every other tag on the page</span>
          </div>
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;head&gt;</span>
            <span className="ref-card__desc">Holds information about the page the visitor doesn't see directly</span>
          </div>
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;title&gt;</span>
            <span className="ref-card__desc">Names the page; shows on the browser tab</span>
          </div>
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;body&gt;</span>
            <span className="ref-card__desc">Holds everything visible on the page</span>
          </div>
        </div>
        <div className="ref-card__right">
          <div className="ref-pane">
            <span className="ref-pane__label">&lt;/&gt; Code</span>
            <pre><code>{`<!DOCTYPE html>
<html>
    <head>
        <title>Page title</title>
    </head>
    <body>
        <!-- content goes here -->
    </body>
</html>`}</code></pre>
          </div>
        </div>
      </div>

      {/* ── Text tags ─────────────────────────────────────── */}
      <div className="lesson__divider" id="section-text-tags">Text tags<hr /></div>

      <p className="lesson__p">
        HTML has six heading levels. Most pages use three. The number sets the rank, not the size —
        browsers render lower numbers larger by default, but the rank is what screen readers and
        search engines read.
      </p>

      <div className="ref-card">
        <div className="ref-card__left">
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;h1&gt;</span>
            <span className="ref-card__desc">The page's main heading. Use it once, for the title of the whole page</span>
          </div>
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;h2&gt;</span>
            <span className="ref-card__desc">A section heading. Use it to break the page into named parts</span>
          </div>
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;h3&gt;</span>
            <span className="ref-card__desc">A subsection heading. Use it when a section needs its own divisions</span>
          </div>
        </div>
        <div className="ref-card__right">
          <div className="ref-pane">
            <span className="ref-pane__label">&lt;/&gt; Code</span>
            <pre><code>{`<h1>Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>`}</code></pre>
          </div>
          <div className="ref-pane">
            <span className="ref-pane__label">Result</span>
            <div className="res-h1">Title</div>
            <div className="res-h2">Section</div>
            <div className="res-h3">Subsection</div>
          </div>
        </div>
      </div>

      <div className="ref-card">
        <div className="ref-card__left">
          <div className="ref-card__tagline">
            <span className="ref-card__tag">&lt;p&gt;</span>
            <span className="ref-card__desc">A paragraph. Use it for any block of text that isn't a heading or a list</span>
          </div>
        </div>
        <div className="ref-card__right">
          <div className="ref-pane">
            <span className="ref-pane__label">&lt;/&gt; Code</span>
            <pre><code>{`<p>Paragraph one</p>
<p>Paragraph two</p>`}</code></pre>
          </div>
          <div className="ref-pane">
            <span className="ref-pane__label">Result</span>
            <div className="res-p">Paragraph one</div>
            <div className="res-p">Paragraph two</div>
          </div>
        </div>
      </div>

    </div>
  );
}
