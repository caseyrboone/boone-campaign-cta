<?php
/**
 * Plugin Name: Boone Campaign CTA Block
 * Description: An accessible, responsive React-powered Gutenberg CTA block with optional GTM dataLayer tracking.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Author: Casey R. Boone
 * License: GPL-2.0-or-later
 * Text Domain: boone-campaign-cta
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register the block and its automatically discovered editor/view assets.
 * The compiled /build directory ships with the plugin (npm is not needed on the WP server).
 */
function boone_campaign_cta_register_block() {
    $build_directory = __DIR__ . '/build';
    if ( file_exists( $build_directory . '/block.json' ) ) {
        register_block_type( $build_directory );
    }
}
add_action( 'init', 'boone_campaign_cta_register_block' );
