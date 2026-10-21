/**
 * Campaign CTA — a native Gutenberg block authored in React JSX.
 *
 * The build uses the React runtime already supplied by WordPress (wp.element).
 * No React bundle or third-party page builder is shipped to visitors.
 *
 * __BLOCK_METADATA__ is injected at build time from src/block.json.
 */
(function () {
    'use strict';
    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InspectorControls, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, ToggleControl, Notice } = wp.components;
    const { __ } = wp.i18n;
    const metadata = { "$schema": "https://schemas.wp.org/trunk/block.json", "apiVersion": 3, "name": "boone/campaign-cta", "version": "1.0.0", "title": "Campaign CTA", "category": "design", "icon": "megaphone", "description": "A reusable, accessible campaign call-to-action with optional GTM click tracking.", "keywords": ["marketing", "lead generation", "conversion", "cta"], "textdomain": "boone-campaign-cta", "supports": { "html": false, "anchor": true, "align": ["wide", "full"], "spacing": { "margin": true } }, "attributes": { "heading": { "type": "string", "default": "Turn interest into action" }, "description": { "type": "string", "default": "Build a faster path from discovery to your next conversation." }, "buttonText": { "type": "string", "default": "Talk to our team" }, "buttonUrl": { "type": "string", "default": "" }, "newTab": { "type": "boolean", "default": false }, "variant": { "type": "string", "default": "light" }, "headingLevel": { "type": "string", "default": "h2" }, "trackClicks": { "type": "boolean", "default": false }, "eventName": { "type": "string", "default": "campaign_cta_click" } }, "editorScript": "file:./index.js", "style": "file:./style-index.css", "viewScript": "file:./view.js" };
    const ALLOWED_FORMATS = ['core/bold', 'core/italic'];
    const EVENT_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,39}$/;
    /** Allow absolute HTTP(S), root-relative and same-page anchor links only. */
    function safeHref(url) {
        const trimmed = typeof url === 'string' ? url.trim() : '';
        if (/^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|#[^\s]+)$/i.test(trimmed)) {
            return trimmed;
        }
        return '';
    }
    function Edit({ attributes, setAttributes }) {
        const { heading, description, buttonText, buttonUrl, newTab, variant, headingLevel, trackClicks, eventName, } = attributes;
        const safeUrl = safeHref(buttonUrl);
        const isValidEvent = EVENT_NAME_PATTERN.test(eventName);
        const blockProps = useBlockProps({
            className: `is-variant-${variant === 'dark' ? 'dark' : 'light'}`,
        });
        const HeadingTag = headingLevel === 'h3' ? 'h3' : 'h2';
        return (wp.element.createElement(wp.element.Fragment, null,
            wp.element.createElement(InspectorControls, null,
                wp.element.createElement(PanelBody, { title: __('CTA settings', 'boone-campaign-cta'), initialOpen: true },
                    wp.element.createElement(SelectControl, { label: __('Appearance', 'boone-campaign-cta'), value: variant, options: [
                            { label: __('Light', 'boone-campaign-cta'), value: 'light' },
                            { label: __('Dark', 'boone-campaign-cta'), value: 'dark' },
                        ], onChange: (value) => setAttributes({ variant: value }) }),
                    wp.element.createElement(SelectControl, { label: __('Heading level', 'boone-campaign-cta'), help: __('Choose the level that fits your page heading hierarchy.', 'boone-campaign-cta'), value: headingLevel, options: [
                            { label: 'H2', value: 'h2' },
                            { label: 'H3', value: 'h3' },
                        ], onChange: (value) => setAttributes({ headingLevel: value }) }),
                    wp.element.createElement(TextControl, { label: __('Button URL', 'boone-campaign-cta'), type: "url", placeholder: "https://example.com/contact/", help: __('Use https://, http://, /path/, or #anchor.', 'boone-campaign-cta'), value: buttonUrl, onChange: (value) => setAttributes({ buttonUrl: value }) }),
                    buttonUrl && !safeUrl && (wp.element.createElement(Notice, { status: "warning", isDismissible: false }, __('Enter a valid HTTP(S) or internal URL; other protocols are blocked.', 'boone-campaign-cta'))),
                    wp.element.createElement(ToggleControl, { label: __('Open link in a new tab', 'boone-campaign-cta'), checked: newTab, onChange: (value) => setAttributes({ newTab: value }) })),
                wp.element.createElement(PanelBody, { title: __('Analytics', 'boone-campaign-cta'), initialOpen: false },
                    wp.element.createElement(ToggleControl, { label: __('Push button clicks to dataLayer', 'boone-campaign-cta'), help: __('Requires a separately configured GTM trigger/tag. Does not send data by itself.', 'boone-campaign-cta'), checked: trackClicks, onChange: (value) => setAttributes({ trackClicks: value }) }),
                    trackClicks && (wp.element.createElement(wp.element.Fragment, null,
                        wp.element.createElement(TextControl, { label: __('dataLayer event name', 'boone-campaign-cta'), value: eventName, onChange: (value) => setAttributes({ eventName: value }), help: __('Start with a letter; use letters, numbers and underscores (max 40).', 'boone-campaign-cta') }),
                        !isValidEvent && (wp.element.createElement(Notice, { status: "warning", isDismissible: false }, __('Invalid name: default campaign_cta_click will be used on the site.', 'boone-campaign-cta'))))))),
            wp.element.createElement("section", { ...blockProps },
                wp.element.createElement("div", { className: "boone-campaign-cta__inner" },
                    wp.element.createElement(RichText, { tagName: HeadingTag, className: "boone-campaign-cta__heading", allowedFormats: ALLOWED_FORMATS, value: heading, placeholder: __('Write your headline…', 'boone-campaign-cta'), onChange: (value) => setAttributes({ heading: value }) }),
                    wp.element.createElement(RichText, { tagName: "p", className: "boone-campaign-cta__description", allowedFormats: ALLOWED_FORMATS, value: description, placeholder: __('Add supporting copy…', 'boone-campaign-cta'), onChange: (value) => setAttributes({ description: value }) }),
                    wp.element.createElement("div", { className: "boone-campaign-cta__button-wrapper" },
                        wp.element.createElement("span", { className: "boone-campaign-cta__button boone-campaign-cta__button--editor" },
                            wp.element.createElement(RichText, { tagName: "span", allowedFormats: [], value: buttonText, placeholder: __('Button label…', 'boone-campaign-cta'), onChange: (value) => setAttributes({ buttonText: value }) }))),
                    !safeUrl && (wp.element.createElement("p", { className: "boone-campaign-cta__editor-note" }, __('Add a button URL in the block settings to make the CTA clickable.', 'boone-campaign-cta')))))));
    }
    function Save({ attributes }) {
        const { heading, description, buttonText, buttonUrl, newTab, variant, headingLevel, trackClicks, eventName, } = attributes;
        const safeUrl = safeHref(buttonUrl);
        const HeadingTag = headingLevel === 'h3' ? 'h3' : 'h2';
        const safeEventName = EVENT_NAME_PATTERN.test(eventName)
            ? eventName : 'campaign_cta_click';
        const blockProps = useBlockProps.save({
            className: `is-variant-${variant === 'dark' ? 'dark' : 'light'}`,
            'data-track-cta': trackClicks ? '1' : undefined,
            'data-cta-event': trackClicks ? safeEventName : undefined,
        });
        return (wp.element.createElement("section", { ...blockProps },
            wp.element.createElement("div", { className: "boone-campaign-cta__inner" },
                wp.element.createElement(RichText.Content, { tagName: HeadingTag, className: "boone-campaign-cta__heading", value: heading }),
                wp.element.createElement(RichText.Content, { tagName: "p", className: "boone-campaign-cta__description", value: description }),
                wp.element.createElement("div", { className: "boone-campaign-cta__button-wrapper" }, safeUrl ? (wp.element.createElement("a", { className: "boone-campaign-cta__button", href: safeUrl, target: newTab ? '_blank' : undefined, rel: newTab ? 'noopener noreferrer' : undefined },
                    wp.element.createElement(RichText.Content, { tagName: "span", value: buttonText }))) : (wp.element.createElement("span", { className: "boone-campaign-cta__button boone-campaign-cta__button--placeholder" },
                    wp.element.createElement(RichText.Content, { tagName: "span", value: buttonText })))))));
    }
    registerBlockType(metadata.name, { ...metadata, edit: Edit, save: Save });
})();
