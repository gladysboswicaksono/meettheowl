# CSS Architecture

The site uses plain CSS loaded globally from `src/main.jsx`. Styles are split by
responsibility so component rules stay easy to find while preserving the
existing cascade.

## Stylesheets

The import order in `src/main.jsx` is intentional:

1. `src/index.css` - reset, design tokens, base typography, and body styles.
2. `src/styles/navigation.css` - sticky navigation and navigation states.
3. `src/styles/site.css` - homepage hero, text helpers, artifact grid, buttons.
4. `src/styles/projects.css` - shared project-page layouts and reusable project UI.
5. `src/styles/expertise.css` - homepage expertise section.
6. `src/styles/ai-course.css` - Own What AI Builds course and editor interfaces.
7. `src/styles/responsive.css` - all viewport media queries.

Because the styles are global, class names should remain descriptive and
namespaced using the existing BEM-style convention, for example
`.project-hero__image` or `.inspect-practice__editor`.

## Responsive Rules

All viewport media queries belong in `src/styles/responsive.css`, ordered from
widest to narrowest:

- `max-width: 1500px` - laptop spacing adjustments.
- `max-width: 1024px` - large tablet and small laptop layouts.
- `max-width: 900px` - tablet layouts and mobile navigation.
- `max-width: 600px` - phone layouts.
- `min-width: 901px` - desktop-only visibility rules.

Keep base component styles in their owning stylesheet and add only the changed
properties to the matching breakpoint. Avoid inline layout styles when a value
must change responsively; use a class instead.

Grid and flex children containing code, images, or other intrinsically wide
content should use `min-width: 0` where needed. This prevents one-column mobile
layouts from expanding beyond the viewport.

## Adding Styles

1. Put the base rule in the stylesheet that owns the component or page.
2. Reuse existing design tokens from `src/index.css`.
3. Add responsive overrides to the existing breakpoint in `responsive.css`.
4. Check both a desktop viewport and a 390px phone viewport for overflow.
5. Run `npm run build` and `npm test`.

Do not restore `src/App.css`; it was an unused Vite starter stylesheet.
