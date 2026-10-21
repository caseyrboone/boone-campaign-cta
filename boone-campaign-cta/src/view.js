/**
 * Optional frontend event tracking. No cookies, network requests, or personal data.
 * GTM must be separately configured to listen for this dataLayer event.
 */
( function () {
    'use strict';
    document.addEventListener( 'click', function ( event ) {
        const target = event.target;
        const link = target && typeof target.closest === 'function'
            ? target.closest( 'a.boone-campaign-cta__button' ) : null;
        if ( ! link ) return;

        const wrapper = link.closest( '.wp-block-boone-campaign-cta[data-track-cta="1"]' );
        if ( ! wrapper ) return;

        let eventName = wrapper.getAttribute( 'data-cta-event' ) || 'campaign_cta_click';
        if ( ! /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test( eventName ) ) {
            eventName = 'campaign_cta_click';
        }

        // Only include the destination's hostname + path; intentionally exclude
        // search parameters/fragments to avoid leaking UTM or personal data.
        let destination = '';
        try {
            const url = new URL( link.href, window.location.href );
            destination = url.hostname + url.pathname;
        } catch ( ignored ) {
            destination = '';
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push( {
            event: eventName,
            cta_text: ( link.textContent || '' ).trim().slice( 0, 100 ),
            cta_destination: destination,
        } );
    }, false );
} )();
