/**
 * Campaign CTA — a native Gutenberg block authored in React JSX.
 *
 * The build uses the React runtime already supplied by WordPress (wp.element).
 * No React bundle or third-party page builder is shipped to visitors.
 *
 * __BLOCK_METADATA__ is injected at build time from src/block.json.
 */
( function () {
    'use strict';

    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InspectorControls, RichText } = wp.blockEditor;
    const { PanelBody, SelectControl, TextControl, ToggleControl, Notice } = wp.components;
    const { __ } = wp.i18n;
    const metadata = __BLOCK_METADATA__;

    const ALLOWED_FORMATS = [ 'core/bold', 'core/italic' ];
    const EVENT_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,39}$/;

    /** Allow absolute HTTP(S), root-relative and same-page anchor links only. */
    function safeHref( url ) {
        const trimmed = typeof url === 'string' ? url.trim() : '';
        if ( /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|#[^\s]+)$/i.test( trimmed ) ) {
            return trimmed;
        }
        return '';
    }

    function Edit( { attributes, setAttributes } ) {
        const {
            heading, description, buttonText, buttonUrl,
            newTab, variant, headingLevel, trackClicks, eventName,
        } = attributes;
        const safeUrl = safeHref( buttonUrl );
        const isValidEvent = EVENT_NAME_PATTERN.test( eventName );
        const blockProps = useBlockProps( {
            className: `is-variant-${ variant === 'dark' ? 'dark' : 'light' }`,
        } );
        const HeadingTag = headingLevel === 'h3' ? 'h3' : 'h2';

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __( 'CTA settings', 'boone-campaign-cta' ) } initialOpen={ true }>
                        <SelectControl
                            label={ __( 'Appearance', 'boone-campaign-cta' ) }
                            value={ variant }
                            options={ [
                                { label: __( 'Light', 'boone-campaign-cta' ), value: 'light' },
                                { label: __( 'Dark', 'boone-campaign-cta' ), value: 'dark' },
                            ] }
                            onChange={ ( value ) => setAttributes( { variant: value } ) }
                        />
                        <SelectControl
                            label={ __( 'Heading level', 'boone-campaign-cta' ) }
                            help={ __( 'Choose the level that fits your page heading hierarchy.', 'boone-campaign-cta' ) }
                            value={ headingLevel }
                            options={ [
                                { label: 'H2', value: 'h2' },
                                { label: 'H3', value: 'h3' },
                            ] }
                            onChange={ ( value ) => setAttributes( { headingLevel: value } ) }
                        />
                        <TextControl
                            label={ __( 'Button URL', 'boone-campaign-cta' ) }
                            type="url"
                            placeholder="https://example.com/contact/"
                            help={ __( 'Use https://, http://, /path/, or #anchor.', 'boone-campaign-cta' ) }
                            value={ buttonUrl }
                            onChange={ ( value ) => setAttributes( { buttonUrl: value } ) }
                        />
                        { buttonUrl && ! safeUrl && (
                            <Notice status="warning" isDismissible={ false }>
                                { __( 'Enter a valid HTTP(S) or internal URL; other protocols are blocked.', 'boone-campaign-cta' ) }
                            </Notice>
                        ) }
                        <ToggleControl
                            label={ __( 'Open link in a new tab', 'boone-campaign-cta' ) }
                            checked={ newTab }
                            onChange={ ( value ) => setAttributes( { newTab: value } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ __( 'Analytics', 'boone-campaign-cta' ) } initialOpen={ false }>
                        <ToggleControl
                            label={ __( 'Push button clicks to dataLayer', 'boone-campaign-cta' ) }
                            help={ __( 'Requires a separately configured GTM trigger/tag. Does not send data by itself.', 'boone-campaign-cta' ) }
                            checked={ trackClicks }
                            onChange={ ( value ) => setAttributes( { trackClicks: value } ) }
                        />
                        { trackClicks && (
                            <>
                                <TextControl
                                    label={ __( 'dataLayer event name', 'boone-campaign-cta' ) }
                                    value={ eventName }
                                    onChange={ ( value ) => setAttributes( { eventName: value } ) }
                                    help={ __( 'Start with a letter; use letters, numbers and underscores (max 40).', 'boone-campaign-cta' ) }
                                />
                                { ! isValidEvent && (
                                    <Notice status="warning" isDismissible={ false }>
                                        { __( 'Invalid name: default campaign_cta_click will be used on the site.', 'boone-campaign-cta' ) }
                                    </Notice>
                                ) }
                            </>
                        ) }
                    </PanelBody>
                </InspectorControls>
                <section { ...blockProps }>
                    <div className="boone-campaign-cta__inner">
                        <RichText
                            tagName={ HeadingTag }
                            className="boone-campaign-cta__heading"
                            allowedFormats={ ALLOWED_FORMATS }
                            value={ heading }
                            placeholder={ __( 'Write your headline…', 'boone-campaign-cta' ) }
                            onChange={ ( value ) => setAttributes( { heading: value } ) }
                        />
                        <RichText
                            tagName="p"
                            className="boone-campaign-cta__description"
                            allowedFormats={ ALLOWED_FORMATS }
                            value={ description }
                            placeholder={ __( 'Add supporting copy…', 'boone-campaign-cta' ) }
                            onChange={ ( value ) => setAttributes( { description: value } ) }
                        />
                        <div className="boone-campaign-cta__button-wrapper">
                            <span className="boone-campaign-cta__button boone-campaign-cta__button--editor">
                                <RichText
                                    tagName="span"
                                    allowedFormats={ [] }
                                    value={ buttonText }
                                    placeholder={ __( 'Button label…', 'boone-campaign-cta' ) }
                                    onChange={ ( value ) => setAttributes( { buttonText: value } ) }
                                />
                            </span>
                        </div>
                        { ! safeUrl && (
                            <p className="boone-campaign-cta__editor-note">
                                { __( 'Add a button URL in the block settings to make the CTA clickable.', 'boone-campaign-cta' ) }
                            </p>
                        ) }
                    </div>
                </section>
            </>
        );
    }

    function Save( { attributes } ) {
        const {
            heading, description, buttonText, buttonUrl, newTab,
            variant, headingLevel, trackClicks, eventName,
        } = attributes;
        const safeUrl = safeHref( buttonUrl );
        const HeadingTag = headingLevel === 'h3' ? 'h3' : 'h2';
        const safeEventName = EVENT_NAME_PATTERN.test( eventName )
            ? eventName : 'campaign_cta_click';
        const blockProps = useBlockProps.save( {
            className: `is-variant-${ variant === 'dark' ? 'dark' : 'light' }`,
            'data-track-cta': trackClicks ? '1' : undefined,
            'data-cta-event': trackClicks ? safeEventName : undefined,
        } );

        return (
            <section { ...blockProps }>
                <div className="boone-campaign-cta__inner">
                    <RichText.Content
                        tagName={ HeadingTag }
                        className="boone-campaign-cta__heading"
                        value={ heading }
                    />
                    <RichText.Content
                        tagName="p"
                        className="boone-campaign-cta__description"
                        value={ description }
                    />
                    <div className="boone-campaign-cta__button-wrapper">
                        { safeUrl ? (
                            <a
                                className="boone-campaign-cta__button"
                                href={ safeUrl }
                                target={ newTab ? '_blank' : undefined }
                                rel={ newTab ? 'noopener noreferrer' : undefined }
                            >
                                <RichText.Content tagName="span" value={ buttonText } />
                            </a>
                        ) : (
                            <span className="boone-campaign-cta__button boone-campaign-cta__button--placeholder">
                                <RichText.Content tagName="span" value={ buttonText } />
                            </span>
                        ) }
                    </div>
                </div>
            </section>
        );
    }

    registerBlockType( metadata.name, { ...metadata, edit: Edit, save: Save } );
} )();
