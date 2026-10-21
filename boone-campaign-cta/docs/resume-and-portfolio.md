# Resume and portfolio entry

## Resume bullet — independent project (after installing and confirming Gutenberg editor behavior)

**Native React Gutenberg CTA Block — WordPress Plugin** | React JSX, WordPress Block API v3, PHP, CSS, GTM

- Built a reusable native Gutenberg CTA block with React JSX, `RichText`, `InspectorControls`, and `block.json`; added responsive theme variants, accessible link/focus behavior, and configurable `dataLayer` click tracking. Packaged as a WordPress plugin and wrote automated tracking and block serialization checks.

## How to discuss it in an interview

**Problem:** Marketing teams need reusable, editable, consistent campaign CTAs without developer involvement on each page.

**Approach:** Created a WordPress plugin, used native Gutenberg block APIs, React JSX in the editor, and static semantic HTML on the frontend. Styles are responsive and the runtime uses WordPress core React rather than loading a second React copy. Optional dataLayer tracking keeps analytics integration modular.

**Security / quality:** Links allow safe HTTP(S) or internal destinations, new tabs add `noopener noreferrer`, frontend tracking excludes query strings, and tests cover allowed URLs, event fallback, and editor registration. Follow with manual keyboard/axe tests inside WordPress.

**Tradeoff:** The block is static HTML for low overhead and can be reused site-wide, but changes to save markup can trigger block validation after upgrades. A future version could add block deprecations, theme.json integrations, and real E2E editor tests.

**Next steps before describing production use:** Deploy to a local/staging site, confirm editor save/reopen behavior, test on mobile, run accessibility checks, and attach screenshots to GitHub. Do not claim measurable conversion increases until measured.
