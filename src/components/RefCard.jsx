// Layout-only component. All content comes from props.
//
// Props:
//   tags        [{ tag: string, desc: string }]  — left panel rows
//   codeSample  string                            — right code pane (optional)
//   result      ReactNode                         — right result pane (optional)

export default function RefCard({ tags = [], codeSample, result }) {
  return (
    <div className="ref-card">
      <div className="ref-card__left">
        {tags.map(({ tag, desc }) => (
          <div className="ref-card__tagline" key={tag}>
            <span className="ref-card__tag">{tag}</span>
            <span className="ref-card__desc">{desc}</span>
          </div>
        ))}
      </div>
      <div className="ref-card__right">
        {codeSample != null && (
          <div className="ref-pane">
            <span className="ref-pane__label">&lt;/&gt; Code</span>
            <pre><code>{codeSample}</code></pre>
          </div>
        )}
        {result != null && (
          <div className="ref-pane">
            <span className="ref-pane__label">Result</span>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
