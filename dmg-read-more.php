<?php
/**
 * Plugin Name:       DMG Read More
 * Description:       A plugin that adds a custom Gutenberg block for linking to posts and a WP-CLI command for searching posts.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Tj Thouhid
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dmg-read-more
 *
 * @package DmgReadMore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function dmg_read_more_dmg_read_more_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'dmg_read_more_dmg_read_more_block_init' );


// Register WP-CLI command.
if (defined('WP_CLI') && WP_CLI) {
    require_once __DIR__ . '/class-dmg-read-more-cli.php';
}