<?php
namespace GutenbergBlocks\Services;

use GutenbergBlocks\Repositories\PostsRepository;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

\defined( 'ABSPATH' ) || die;

class GetPostTypeService {
    private $posts_repository;

    public function __construct() {
        $this->posts_repository = new PostsRepository();
    }

    /**
     * Get the posts.
     *
     * @param  WP_REST_Request    $request The request object.
     * @return WP_REST_Response
     */
    public function get( WP_REST_Request $request ): WP_REST_Response {
        if ( $request->get_method() !== WP_REST_Server::READABLE ) {
            return new WP_REST_Response(
                [
                    'code'    => 'method_not_allowed',
                    'message' => __( 'Method not allowed.', PLUGIN_TEXTDOMAIN ),
                ],
                405 );
        }

        $exclude  = !empty( $request->get_param( 'exclude' ) ) ? $request->get_param( 'exclude' ) : [];
        $exclude  = is_array( $exclude ) ? $exclude : explode( ',', $exclude );
        $response = $this->posts_repository->get_post_types( $exclude );

        // if is wp error
        if ( is_wp_error( $response ) ) {
            return new WP_REST_Response(
                [
                    'code'    => $response->get_error_code(),
                    'message' => __( "Error getting post types: ", PLUGIN_TEXTDOMAIN ) . $response->get_error_message(),
                ],
                500 );
        }

        if ( empty( $response['posts'] ) ) {
            return new WP_REST_Response(
                [
                    'code'    => 'no_items_found',
                    'message' => __( 'No items were found. ', PLUGIN_TEXTDOMAIN ),
                ],
                404 );
        }

        return new WP_REST_Response( $response, 200 );
    }
}