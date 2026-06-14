# Course 2 Coaching Exercises

**Course file:** `public/OwnWhatAIBuilds/practice/02-edit-existing/index.html`

This is the complete coaching ladder for learning to read and edit an
AI-generated standalone HTML course. The course also uses:

- `../shared/course.css`
- `../shared/sidenav.js`

## Progress

| # | Level | Status | Task |
|---|---|---|---|
| 1 | Orientation | Done | Find and change the H1 heading. |
| 2 | Orientation | Done | Change a paragraph of static body text. |
| 3 | Orientation | Done | Rewrite the callout box. |
| 4 | Orientation | Done | Change a lesson divider label. |
| 5 | Orientation | Done | Trace where the "Up next" button label comes from. |
| 6 | Shared structure | Done | Identify which CSS class controls the H1 size and color. |
| 7 | Shared structure | Done | Change one CSS design token safely. |
| 8 | Shared structure | Done | Add a background color to the `.callout` class. |
| 9 | Shared structure | Done | Adjust the spacing above a section heading. |
| 10 | Shared structure | Done | Improve the hover state on the download button. |
| 11 | JS content | Done | Find `DEMO_STEPS` and identify what each property does. |
| 12 | JS content | Done | Rewrite the body text of one demo step. |
| 13 | JS content | Done | Add a sixth step to `DEMO_STEPS`. |
| 14 | Layout | Done | Distinguish a fixed row count from a maximum number of buttons per row. |
| 15 | Layout | Done | Set a maximum of three buttons per row with CSS Grid. |
| 16 | Layout | Done | Remove the obsolete Flexbox property from `.stepper__step`. |
| 17 | Layout | Done | Test how the layout behaves with fewer and more than six buttons. |
| 18 | JS content | Done | Find `demoRender()` and explain in plain English what it does. |
| 19 | JS content | Done | Change the counter format from "1 of 6" to something different. |
| 20 | Behavior | Done | Change what the "Next step" button says. |
| 21 | Behavior | Done | Make the Previous button say "Back" instead. |
| 22 | Behavior | Done | Add a visible "Step N" label above the detail panel title. |
| 23 | Behavior | Done | Add a "Start over" button that resets the stepper to step 1. |
| 24 | Tooltip | Done | Add a native browser tooltip to the step buttons using `title`. |
| 25 | Tooltip | Done | Build a custom CSS tooltip that replaces the native one. |
| 26 | Coachmark | In progress | Add a hidden coachmark beside the Next button. |
| 27 | Coachmark | Not started | Use `setTimeout()` to show it a few seconds after render. |
| 28 | Coachmark | Not started | Hide it when the learner clicks Next. |
| 29 | Coachmark | Not started | Ensure it does not repeatedly interrupt the learner. |
| 30 | Reusable thinking | Not started | Document the timed coachmark as a standalone reusable pattern. |
| 31 | New session practice | Not started | Draft a prompt for a fresh AI session requesting a new course component. |

## Layout Outcomes

The layout section is complete when the learner can explain and apply:

- The difference between a fixed number of rows and a maximum number of items
  per row.
- `display: grid` to create a grid layout.
- `grid-template-columns: repeat(3, 1fr)` to create three equal columns.
- Why six items produce two rows when the grid has three columns.
- Why Flexbox properties do not affect children of a Grid container.
- Why adding data can expose an earlier layout assumption.

Flexbox sizing is not required for this layout goal.

## Coaching Rules

- Orientation tasks get an outcome and a one-line description only.
- After every "Done," read the file and confirm the change before moving on.
- Read-only tasks require the learner to explain what they found before the
  explanation is expanded.
- Do not complete an exercise for the learner unless they explicitly ask for
  the implementation rather than coaching.

## Do Not Touch

- `sidenav.js`
- `CourseNav.init()`, `renderCta()`, or `unlockSection()` in `index.html`
- The `EXERCISES` array validators
- The `SOURCE` string structure

## Resume Point

Resume at **Task 26: add a hidden coachmark beside the Next button**.

## Custom tooltip

/* 1. The element anchors its tooltip */
.trigger {
  position: relative;
}

/* 2. CSS creates a hidden tooltip from stored HTML data */
.trigger::after {
  content: attr(data-tooltip);
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* 3. Hover reveals it */
.trigger:hover::after {
  opacity: 1;
}

-- HTML

<button class="trigger" data-tooltip="Helpful message">
  Hover me
</button>
