<?php
namespace GutenbergBlocks\Repositories;

use WP_oEmbed;
use WP_Query;

\defined( 'ABSPATH' ) || die;

class PostsRepository {

    /**
     * Get the posts.
     *
     * @param  string  $post_type The post type.
     * @param  int     $per_page  The number of posts per page.
     * @param  int     $page      The page number.
     * @param  string  $page_lang The page language.
     * @return array
     */
    public function get_posts( $post_type, $per_page, $page, $page_lang ) {
        $response = [];
        $args     = [
            'post_type'      => $post_type,
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'orderby'        => 'date',
            'order'          => 'DESC',
            'post_status'    => 'publish',
        ];

        if ( $this->is_plugin_active( 'polylang/polylang.php' ) ) {
            $args['lang'] = $page_lang;
        }

        $query = new WP_Query( $args );

        $total_posts             = $this->get_total_posts( $post_type, $page_lang );
        $response['total_posts'] = $total_posts;
        $response['total_pages'] = ceil( $total_posts / $per_page );
        $response['posts']       = [];

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $id = get_the_ID();

                // TODO: Create this meta field in the Gallery post type.
                $video_url   = get_post_meta( $id, 'video_url', true );
                $o_embed     = new WP_oEmbed();
                $video_embed = $o_embed->get_html( $video_url );
                $image       = get_the_post_thumbnail_url( $id, 'large' ) ?: '';

                $response['posts'][] = [
                    'id'         => $id,
                    'title'      => get_the_title(),
                    'url'        => get_the_permalink(),
                    'date'       => get_the_modified_date(),
                    'excerpt'    => get_the_excerpt() ?: '',
                    'image'      => $image,
                    'videoEmbed' => $video_embed,
                    'srcset'     => wp_get_attachment_image_srcset( get_post_thumbnail_id( $id ) ) ?: '',
                ];
            }
        } else {
            return $response;
        }
        wp_reset_postdata();

        return $response;
    }

    /**
     * Get the total number of posts.
     *
     * @param  string $post_type The post type.
     * @param  string $page_lang The page language.
     * @return int
     */
    public function get_total_posts( $post_type, $page_lang ) {
        $args = [
            'post_type'   => $post_type,
            'post_status' => 'publish',
        ];

        if ( $this->is_plugin_active( 'polylang/polylang.php' ) ) {
            $args['lang'] = $page_lang;
        }

        $query = new WP_Query( $args );

        return $query->found_posts;
    }

    /**
     * Check if a plugin is active.
     *
     * @param  string $plugin The plugin name (folder/file.php).
     * @return bool
     */
    public function is_plugin_active( $plugin ) {
        $active_plugins = get_option( 'active_plugins', [] );

        return in_array( $plugin, $active_plugins );
    }

    /**
     * Get post types
     *
     * @param  array   $exclude The post types to exclude.
     * @return array
     */
    public function get_post_types( $exclude = [] ) {
        $response = [];

        $post_types = get_post_types( [
            'public' => true,
        ], 'objects' );

        if ( !empty( $post_types ) ) {
            foreach ( $post_types as $post_type ) {
                if ( in_array( $post_type->name, $exclude ) ) {
                    continue;
                }

                $response[] = [
                    'slug'  => $post_type->name,
                    'label' => $post_type->label,
                ];
            }
        }

        return $response;
    }
}