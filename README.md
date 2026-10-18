# PRISM: Student Finance Tracker

A responsive, accessible expense tracker for students, built with plain HTML, CSS and JavaScript (no frameworks).

- **Theme chosen:** Student Finance Tracker
- **Live site (GitHub Pages):** https://k-gloire.github.io/student-finance-tracker/
- **Demo video (unlisted):** [paste your video link here]
- **Author:** Umuhendakazi Keza Gloire GitHub: k-gloire https://github.com/k-gloire, g.umuhendak@alustudent.com

## Features

- **Records:** add, edit and delete transactions (description, amount, category, date). Every record has a unique id and `createdAt` / `updatedAt` timestamps.
- **Validation:** six regex rules with inline error messages that are announced to screen readers.
- **Sorting:** by date, description (A to Z) and amount, ascending or descending.
- **Live regex search:** type a pattern, toggle case-insensitive, matches are highlighted with `<mark>`. An invalid pattern never crashes the app.
- **Dashboard:** total records, total spent, top category, a last-7-days bar chart and a spending cap with remaining or over-cap messages.
- **Settings:** a base currency plus two others with manual exchange rates, an editable category list and a spending cap.
- **Data:** everything saves automatically to `localStorage`. Records can be exported to JSON and imported from JSON, with the file checked before anything is loaded.
- **Responsive:** mobile first, with breakpoints at about 360px (base), 768px and 1024px.
- **Accessible:** landmarks, skip link, labelled fields, visible focus, live regions, keyboard-only use.

## Project structure

```
index.html          the page (About, Dashboard, Records, Add/Edit, Settings)
tests.html          small assertions for the validators (run with Live Server)
seed.json           14 sample records with edge cases
styles/             main.css, form.css, records.css, dashboard.css
scripts/
  main.js           starts everything
  ui.js             form, records list, dashboard rendering
  state.js          records and settings in memory, saved through storage.js
  storage.js        localStorage load and save
  validators.js     all regex rules and checks
  search.js         safe regex compiler, matching and highlighting
  sort.js           sorting
  stats.js          dashboard calculations
  currency.js       currency settings and conversion
  categories.js     editable categories
  dataio.js         export and import of JSON
assets/             wireframes
```

## Data model

```json
{
  "id": "txn_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2026-09-25",
  "createdAt": "2026-09-25T10:00:00.000Z",
  "updatedAt": "2026-09-25T10:00:00.000Z"
}
```

Saved in `localStorage` under `prism:data` (records) and `prism:settings` (cap, base currency, rates, categories).

## Regex catalog

| Rule | Pattern | Valid examples | Invalid examples |
| --- | --- | --- | --- |
| Description (no leading or trailing space) | `^\S(?:.*\S)?$` | `Lunch`, `a` | ` lunch`, `lunch ` |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `0`, `12.5`, `89.99` | `012`, `12.555`, `-5` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2026-10-11` | `2026-13-01`, `26-10-11` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Food`, `Fast-food` | `Food2`, `Food  Drinks` |
| Advanced: repeated word  | `\b(\w+)\s+\1\b` (case-insensitive) | `Coffee with friends` | `coffee coffee`, `Coffee coffee` |
| Exchange rate | `^(0\|[1-9]\d*)(\.\d{1,6})?$` | `1450`, `1.08` | `0`, `012`, `1,5` |

Notes:

- The date pattern only checks the shape, so `2026-02-31` passes it. `checkDate` also builds a real date and rejects days that do not exist.
- Double spaces in a description are collapsed to one space before saving.
- The repeated-word rule guards the form only. Imported files may contain repeated words, so the seed data can be used to demonstrate the search pattern.
- Search examples to try: `\.\d{2}\b` (amounts with cents), `(coffee|tea)`, `\b(\w+)\s+\1\b` (repeated words), `^2026-10`.

## Keyboard map

| Key | What it does |
| --- | --- |
| `Tab` / `Shift+Tab` | Move forward / backward. The first stop is the "Jump to content" skip link. |
| `Enter` | Follow a link, press a button, submit a form |
| `Space` | Press a button, tick "Ignore case" |
| Arrow keys | Change the selected option in a dropdown |
| `Enter` / `Esc` | Confirm or cancel the browser's delete and import confirmation boxes |

After saving a record, the cursor returns to the Description field. After a failed save it jumps to the first field with an error.

## Accessibility notes

- Landmarks: `header`, `nav`, `main`, `section`, `footer`, one `h1` and an `h2` per section.
- A skip link is the first focusable element and becomes visible when focused.
- Every input has a bound `<label>`; errors use `aria-invalid`, `aria-describedby` and `aria-live="polite"`.
- Status messages use `role="status"`. The cap message is polite when under the cap and assertive when over it.
- Sort buttons use `aria-pressed`; the records table has header cells with `scope` and a hidden caption.
- The 7-day chart is decorative, with exact amounts available as hidden text for screen readers.
- Visible focus outlines on every interactive element; buttons and links have at least 44px touch targets.
- Animations (the skip link slide, button fades, chart bars growing) are switched off when the device asks for reduced motion.
- Contrast: Text and background color combinations were checked using the WebAIM Contrast Checker. WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. The measured ratios included 10.12:1, 15.14:1, 5.6:1, 12.28:1 and 6.42:1, which meet the normal-text minimum. Any failing color combinations were identified for correction and rechecking.

## Design decisions

- **Top category** means the category with the highest total spent.
- **Spending cap** is compared with the total of all records. Cap left = cap - total spent.
- **Currency:** a rate means how many units of the base currency equal 1 unit of the other currency (base RWF, USD rate 1450 means 1 USD = 1450 RWF). Totals are converted by dividing. Rates are saved separately for each base currency. Amounts are stored as plain numbers, so changing the base currency changes the label, not the saved amounts.
- **Categories:** names follow the category regex and cannot repeat (ignoring case). A category used by any record cannot be removed, and at least one category must remain.
- **Import:** the file must be a list of records. Everything is checked first (types, formats, real dates, unique ids). If anything is wrong, a list of problems is shown and nothing changes. A valid file replaces the current records after confirmation.
- **Editing:** the Edit button loads the record into the Add/Edit form rather than editing inside the table row.

## Testing

1. Start the project with Live Server in VS Code (ES modules do not load from a double-clicked file).
2. Open `tests.html`. It runs the validator and import-file checks and prints PASS or FAIL for each (59 of 59 tests passed).
3. Manual checks I ran; 
- I tested repeated-word validation and regex search, including invalid search pattern. 
- I checked keyboard navigation, visible focus and the "Jump to content" skip link. 
- I checked the website at mobile and desktop viewport widths.
- Tested JSON import validation and confirmed that invalid files are rejected.
- I checked the spending-cap messages and dashboard calculations.
- Verified form validation for invalid amounts, dates, descriptions and categories.

## Seed data and import / export

`seed.json` holds 14 records with edge cases: a leap day, year boundaries, 0 and very large amounts, a single-character description, special characters (`&`, `<b>`, quotes), an accented name, a very long description and a repeated word. Use Settings > Import JSON to load it. Export JSON downloads the current records in the same format.


## References

- Assignment brief: Starter snippets for the safe regex compiler and persistent state.
- WebAIM contrast checker. https://webaim.org/resources/contrastchecker/
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/