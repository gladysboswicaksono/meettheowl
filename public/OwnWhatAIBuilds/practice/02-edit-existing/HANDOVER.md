# Course 2 Handover

## 1. Files changed

- `public/OwnWhatAIBuilds/practice/02-edit-existing/index.html`
  - Course copy and demo stepper content/behavior were edited.
- `public/OwnWhatAIBuilds/practice/shared/course.css`
  - Shared design tokens, spacing, buttons, stepper layout, labels, reset
    button, and tooltip styles were edited.
  - This file is shared, so its changes can affect other practice courses.
- `public/OwnWhatAIBuilds/practice/02-edit-existing/COACHING-EXERCISES.md`
  - Stores the coaching progress and revised exercise ladder.
- `public/OwnWhatAIBuilds/practice/02-edit-existing/HANDOVER.md`
  - This current-state handover.

`public/OwnWhatAIBuilds/practice/shared/sidenav.js`, the protected course navigation functions,
the exercise validators, and the `SOURCE` string structure were not edited.

## 2. Features currently present

- Rewritten course heading, introduction, divider text, and VS Code callout.
- Cream value stored under the existing `--gold` design token.
- Green-tinted callout background and adjusted section spacing.
- Download button hover movement.
- Six demo steps with revised body copy.
- Step buttons displayed in a maximum of three columns using CSS Grid.
- Counter format: `Step 1 / 6`.
- Navigation labels: `Back` and `Next`.
- A visible `Step N` badge above the active step title.
- A separate `Start over` button that returns to Step 1.
- A custom hover tooltip generated from each button's `data-tooltip`.

## 3. JavaScript concepts introduced

- Arrays of objects containing `title` and `body` properties.
- Zero-based array indexes and why displayed step numbers use `+ 1`.
- `DEMO_STEPS.length` and why the last index is `length - 1`.
- `map()` and `join()` for generating button markup.
- Template literals and `${...}` interpolation.
- `getElementById()` for finding existing elements.
- `innerHTML` for inserting generated markup.
- `textContent` for updating visible text.
- Function arguments such as `demoGo(-1)` and `demoGo(1)`.
- Updating state with `demoActive`, then calling `demoRender()`.
- Resetting state to index `0`.
- Developer-created Boolean state was discussed but not implemented.
- `setTimeout()` and `clearTimeout()` were discussed but not implemented.

## 4. Incomplete or experimental

- The timed Next-button coachmark is not implemented.
- No coachmark HTML, timer variable, dismissal state, or timer cleanup exists.
- The current custom tooltip repeats the title already visible on each button,
  so its practical value is limited.
- The tooltip works on pointer hover only; keyboard-focus behavior was
  intentionally not added.
- The tooltip has not been checked for clipping, overlap, mobile behavior, or
  viewport edges.
- The six-step demo and shared CSS were not mirrored into the embedded
  `SOURCE` practice file. They are separate examples.

## 5. Changes worth keeping

- Revised course copy.
- Six-step `DEMO_STEPS` data.
- Three-column Grid layout if three buttons per row is the intended maximum.
- Updated counter and navigation labels.
- Visible active-step badge.
- Working `Start over` behavior and its corrected opacity transition.
- The coaching exercise and handover documents.

## 6. Changes to consider reverting

- Revert the custom step-button tooltip unless it will contain useful
  information that is not already visible.
- Reconsider global changes in `shared/course.css` if they were intended only
  for Course 2, especially `--gold`, `.callout`, section spacing, and shared
  stepper rules.
- Reconsider `transition: all` on `.download-btn`; listing only the properties
  that animate is more controlled.
- Reconsider the green callout tint if it does not fit the final visual system.

## 7. Guidance for a fresh JavaScript coaching session

- Start from the existing working demo; do not rebuild the stepper.
- Keep explanations concrete and introduce one concept at a time.
- Explain built-in JavaScript names separately from developer-created names.
- Do not mark work complete until the file has been checked.
- Focus the next session on a realistic timed coachmark beside the Next button.
- Before coding it, define the exact behavior: when the timer starts, where the
  coachmark appears, what dismisses it, and whether it may appear again.
- Teach timer lifecycle in this order: schedule, show, cancel, dismiss, prevent
  duplicate timers.
- Preserve `sidenav.js`, `CourseNav.init()`, `renderCta()`,
  `unlockSection()`, the validators, and the `SOURCE` string structure.

  ## 8. Why the current COACHING0-EXERCISE is really poor

  - It moves too fast from editing to building features
  The first 10 tasks are mostly HTML/CSS orientation, then it jumps into DEMO_STEPS, adding a sixth step, grid layout, behavior changes, tooltips, and coachmarks. By Task 23 you are already adding a “Start over” button, and by Tasks 26–29 you are dealing with a timed coachmark using delayed behavior and dismissal logic. That is a lot before the foundations are secure.

    For someone trying to learn JavaScript basics, a timed coachmark is not a beginner-friendly next step. It introduces state, timers, DOM changes, conditional logic, and learner interruption all at once.

  - It treats “done” as success, not “understood” as success

  The progress table says almost everything is “Done,” but the document does not define how you prove understanding. There is no checkpoint like:

    Can you explain what this variable remembers?
    Can you identify which names are custom and which are JavaScript features?
    Can you predict what happens if this line changes?

    That matters because you were completing tasks without feeling more capable. The plan tracks outputs, not comprehension.

  - It does not teach JavaScript concepts in a logical order
  A good JavaScript learning ladder would go something like:

    What is a variable?
    What is an array?
    What is an object?
    What is a function?
    How does JS find HTML?
    How does JS change text?
    How does JS listen for clicks?
    How does JS add/remove classes?
    What is state?
    What are timers?

    This plan instead organizes around features: stepper edits, layout edits, tooltip, coachmark. It uses JavaScript concepts, but it does not teach them as concepts.


  - It introduces a custom tooltip, then jumps to coachmark complexity

  Task 24 is a native browser tooltip using title, Task 25 is a custom CSS tooltip, then Task 26 starts a hidden coachmark beside the Next button.
  That’s not a smooth progression. A tooltip and a coachmark are different interaction patterns. A tooltip explains an element. A coachmark nudges behavior. They have different UX purposes. The plan treats them like technical steps in a ladder rather than asking whether each pattern is useful for the learner.

  - It lacks “why this matters” for learning design

  There is no consistent question like: What learner problem does this solve?

  That is why it can assign tasks that are technically valid but instructionally weak. For example, making a tooltip keyboard-accessible is good in principle, but if the tooltip repeats visible text, the feature itself is not useful. The plan does not protect against that.

  - The “Coaching Rules” are too mechanical
  The rules say orientation tasks get only an outcome and one-line description, changes should be confirmed after “Done,” and read-only tasks require the learner to explain what they found.

Those are process rules, not teaching rules. Missing are rules like:

Explain the concept before the task.
Separate official JavaScript features from custom project names.
Ask the learner to predict the result before changing code.
Check whether the feature has learning value before adding it.
Do not introduce new syntax without naming the concept.

That’s exactly why you got stuck on coachmarkDismissed. A good coach would have explained upfront that it was a custom variable name, not something to Google.