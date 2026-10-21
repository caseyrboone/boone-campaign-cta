const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup() {
    let handler;
    const document = { addEventListener: (type, cb) => { if (type === 'click') handler = cb; } };
    const window = { location: { href: 'https://example.com/origin/' } };
    const script = fs.readFileSync(path.join(__dirname, '../build/view.js'), 'utf8');
    vm.runInNewContext(script, { document, window, URL });
    function click({ track = true, eventName = 'campaign_cta_click', href = 'https://example.com/contact/?email=secret%40example.com&utm_source=test' } = {}) {
        const wrapper = track ? { getAttribute: () => eventName } : null;
        const link = { href, textContent: 'Talk to our team', closest: () => wrapper };
        handler({ target: { closest: () => link } });
    }
    return { window, click };
}

test('pushes valid dataLayer event and drops URL query parameters', () => {
    const { window, click } = setup();
    click();
    assert.equal(window.dataLayer.length, 1);
    assert.equal(window.dataLayer[0].event, 'campaign_cta_click');
    assert.equal(window.dataLayer[0].cta_destination, 'example.com/contact/');
    assert.ok(!JSON.stringify(window.dataLayer).includes('secret'));
});

test('does not push an event when tracking is disabled', () => {
    const { window, click } = setup();
    click({ track: false });
    assert.equal(window.dataLayer, undefined);
});

test('falls back to safe event name for invalid strings', () => {
    const { window, click } = setup();
    click({ eventName: 'bad name !' });
    assert.equal(window.dataLayer[0].event, 'campaign_cta_click');
});
