# Campaign CTA — Native React Gutenberg Block

An installable WordPress block plugin by **Casey R. Boone**. It lets marketing teams publish responsive campaign calls-to-action without changing PHP templates or copying page-builder layouts.

## Features

- **Real React JSX block editor** using WordPress's built-in React runtime (`wp.element`), `RichText`, `InspectorControls`, and native block metadata (`block.json`, Block API v3).
- Editable headline, supporting copy, button label and URL.
- Selectable H2/H3 heading hierarchy, dark/light variants, responsive layouts, visible keyboard focus styles.
- Link safety: permits HTTP(S), root-relative and anchor URLs; new tabs use `rel="noopener noreferrer"`.
- Optional frontend GTM `dataLayer` click event with configurable event name. No tracking is enabled by default. Tracking sends **button label and destination hostname/path only**, not URL query parameters.
- Metadata-driven PHP registration, frontend-only view script, no bundled React or third-party form dependencies.
- A small Node test suite for event tracking and data-minimization behavior.

## Install in WordPress (without Node)

1. Download the ZIP from ChatGPT (named `boone-campaign-cta.zip`).
2. In a WordPress 6.5+ site, choose **Plugins → Add New → Upload Plugin** and select the ZIP.
3. Activate **Boone Campaign CTA Block**.
4. Open a post/page in the Gutenberg editor, insert **Campaign CTA**, fill the fields, and publish.
5. Set a valid URL in the block sidebar. Without a URL the CTA is a non-clickable placeholder.

A compiled `build/` folder is included, so you do **not** need npm or Node to install the plugin on your website.

## Develop and rebuild

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
npm test
```

This project intentionally uses a minimal TypeScript JSX transform with `wp.element.createElement` rather than bundling a separate React runtime. The React JSX source is in `src/index.jsx`; compiled, ready-to-install editor code is in `build/index.js`. All Gutenberg UI APIs are loaded from WordPress core. For larger real-world projects, the official `@wordpress/scripts` tooling is also a good choice.

## Connect the click event to Google Tag Manager

1. In the block's **Analytics** panel, turn on **Push button clicks to dataLayer**. Default event: `campaign_cta_click`.
2. In GTM, create a **Custom Event** trigger named `campaign_cta_click`.
3. Create Data Layer Variables named `cta_text` and `cta_destination`.
4. Configure your GA4 Event tag for the trigger and publish the GTM container.
5. Test using GTM Preview. **The block does not add GTM and does not send data to GA4 by itself.**

Sample payload:

```javascript
window.dataLayer.push({
  event: 'campaign_cta_click',
  cta_text: 'Talk to our team',
  cta_destination: 'example.com/contact/'
});
```

## Manual test checklist

- [ ] Insert/edit/publish block; reopen post and confirm block remains valid (no block recovery prompt).
- [ ] Edit headline, copy, button label, button URL; confirm changes persist on frontend.
- [ ] Toggle light/dark variants; check color contrast and responsive layout on mobile.
- [ ] Tab to CTA and confirm a clearly visible focus indicator; activate using Enter.
- [ ] Confirm button opens same tab / a new tab according to the setting.
- [ ] Test internal /path, external https:// links, and rejected javascript: URLs.
- [ ] Confirm no `dataLayer` push before enabling analytics; then verify event using GTM Preview.
- [ ] Run axe/WAVE and test keyboard navigation; if available, test with a screen reader.
- [ ] Compare Chrome, Firefox, Safari on desktop and mobile.

## What this project does *not* claim

This is a **working code deliverable** with build and automated tracking tests. It is **not yet verified in a real WordPress editor/runtime**. Before listing it as deployed production experience, install it on a local/staging site, complete the manual checklist, and publish the source to your own GitHub repository. No claimed traffic, conversion lift, or production accessibility certification is implied.

## Resume-ready bullet (after you run/test the block)

> Developed a native React-based Gutenberg CTA block using WordPress Block API v3, RichText and InspectorControls, with reusable responsive variants, accessible markup, and optional GTM dataLayer click tracking; packaged it as a standalone PHP/JavaScript plugin with automated event tests.

**Suggested portfolio title:** React Gutenberg Campaign CTA Block — WordPress Plugin, PHP, JavaScript, GTM.

**License:** GPL-2.0-or-later.
