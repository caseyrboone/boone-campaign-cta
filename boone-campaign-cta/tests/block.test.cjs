const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup() {
  let registration;
  const Element = (type, props, ...children) => ({ type, props: { ...props, children } });
  const wp = {
    element: { createElement: Element, Fragment: Symbol('Fragment') },
    blocks: { registerBlockType: (name, config) => { registration = { name, config }; } },
    blockEditor: {
      RichText: { Content: function RichTextContent(){} },
      InspectorControls: function InspectorControls(){},
      useBlockProps: Object.assign(
        (props) => props,
        { save: (props) => ({ ...props, className: 'wp-block-boone-campaign-cta ' + props.className }) }
      ),
    },
    components: {
      PanelBody: function PanelBody(){}, SelectControl: function SelectControl(){},
      ToggleControl: function ToggleControl(){}, TextControl: function TextControl(){},
      Notice: function Notice(){},
    },
    i18n: { __: text => text },
  };
  const builtCode = fs.readFileSync(path.join(__dirname, '../build/index.js'), 'utf8');
  assert.ok(!builtCode.includes('React.Fragment'), 'compiled JSX must use wp.element.Fragment');
  vm.runInNewContext(builtCode, { wp });
  return registration;
}

function nodes(root, type) {
  const collected = [];
  const visit = x => {
    if (!x || typeof x !== 'object') return;
    if (x.type === type) collected.push(x);
    (x.props?.children || []).forEach(visit);
  };
  visit(root);
  return collected;
}

function attrs(overrides = {}) {
  return {
    heading: 'Talk with us', description: 'Let us help', buttonText: 'Contact',
    buttonUrl: 'https://example.com/contact/', newTab: false, variant: 'light',
    headingLevel: 'h2', trackClicks: false, eventName: 'campaign_cta_click',
    ...overrides,
  };
}

test('native block metadata and React editor load with WordPress externals', () => {
  const { name, config } = setup();
  assert.equal(name, 'boone/campaign-cta');
  assert.equal(config.apiVersion, 3);
  assert.doesNotThrow(() => config.edit({ attributes: attrs(), setAttributes: () => {} }));
});

test('published CTA has safe HTTPS URL, new-tab protections and tracking attributes', () => {
  const { config } = setup();
  const tree = config.save({ attributes: attrs({ newTab: true, trackClicks: true }) });
  const anchors = nodes(tree, 'a');
  assert.equal(anchors.length, 1);
  assert.equal(anchors[0].props.href, 'https://example.com/contact/');
  assert.equal(anchors[0].props.rel, 'noopener noreferrer');
  assert.equal(tree.props['data-track-cta'], '1');
});

test('unsafe javascript: URL is never published as a clickable link', () => {
  const { config } = setup();
  const tree = config.save({ attributes: attrs({ buttonUrl: 'javascript:alert(1)' }) });
  assert.equal(nodes(tree, 'a').length, 0);
});

test('supports semantic H3 and dark style variation', () => {
  const { config } = setup();
  const tree = config.save({ attributes: attrs({ variant: 'dark', headingLevel: 'h3' }) });
  assert.ok(tree.props.className.includes('is-variant-dark'));
  assert.ok(tree.props.children[0].props.children[0].props.tagName === 'h3');
});
