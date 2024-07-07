<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class DMG_Read_More_CLI {

    /**
     * Registers the WP-CLI command.
     */
    public static function register() {
        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            WP_CLI::add_command( 'dmg-read-more search', [ __CLASS__, 'search_posts' ] );
        }
    }

    /**
     * Searches for posts containing the 'dmg-read-more' block.
     *
     * ## OPTIONS
     *
     * [--date-before=<date>]
     * : The end date for the search range.
     *
     * [--date-after=<date>]
     * : The start date for the search range.
     *
     * @param array $args The positional arguments.
     * @param array $assoc_args The associative arguments.
     */
    public static function search_posts( $args, $assoc_args ) {
        $date_before = isset( $assoc_args['date-before'] ) ? $assoc_args['date-before'] : date( 'Y-m-d', current_time( 'timestamp' ) );
        $date_after  = isset( $assoc_args['date-after'] ) ? $assoc_args['date-after'] : date( 'Y-m-d', strtotime( '-30 days', current_time( 'timestamp' ) ) );

        $query_args = [
            'post_type'      => 'post',
            'posts_per_page' => -1,
            'date_query'     => [
                'after'     => $date_after,
                'before'    => $date_before,
                'inclusive' => true,
            ],
        ];

        $query = new WP_Query( $query_args );

        if ( ! $query->have_posts() ) {
            WP_CLI::log( 'No posts found.' );
            return;
        }

        $post_ids = [];
        while ( $query->have_posts() ) {
            $query->the_post();
            $post_content = get_the_content();
            if ( has_block( 'dmg/read-more', $post_content ) ) {
                $post_ids[] = get_the_ID();
            }
        }

        wp_reset_postdata();

        if ( empty( $post_ids ) ) {
            WP_CLI::log( 'No posts containing the "dmg-read-more" block found.' );
        } else {
            WP_CLI::log( 'Found posts: ' . implode( ', ', $post_ids ) );
        }
    }
}

DMG_Read_More_CLI::register();
