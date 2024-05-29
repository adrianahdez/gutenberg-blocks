<?php
namespace GutenbergBlocks\Controllers;

use GutenbergBlocks\Services\GetFilesService;
use GutenbergBlocks\Services\GetPostsService;
use GutenbergBlocks\Services\GetPostTypeService;
use GutenbergBlocks\Services\ValidationService;
use WP_REST_Server;

\defined( 'ABSPATH' ) || die;

class ApiController {
    private $files_service;
    private $posts_service;
    private $validation_service;
    private $post_type_service;

    public function __construct() {
        $this->files_service      = new GetFilesService();
        $this->posts_service      = new GetPostsService();
        $this->post_type_service  = new GetPostTypeService();
        $this->validation_service = new ValidationService();
        add_action( 'rest_api_init', [$this, 'register_routes'] );
    }

    public function register_routes() {
        //  TODO: add 'gutenberg-blocks' route to a constant.
        register_rest_route( 'gutenberg-blocks', '/files', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this->files_service, 'get'],
            'permission_callback' => '__return_true',
            'args'                => [
                'post_id' => [
                    'required'          => true,
                    'validate_callback' => [
                        $this->validation_service,
                        'validate_numeric_params',
                    ],
                ],
            ],
        ] );

        register_rest_route( 'gutenberg-blocks', '/posts', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this->posts_service, 'get'],
            'permission_callback' => '__return_true',
            'args'                => [
                'post_type' => [
                    'required'          => true,
                    'validate_callback' => [
                        $this->validation_service,
                        'validate_post_type',
                    ],
                ],
                'per_page'  => [
                    'required'          => true,
                    'validate_callback' => [
                        $this->validation_service,
                        'validate_numeric_params',
                    ],
                ],
                'page'      => [
                    'required'          => true,
                    'validate_callback' => [
                        $this->validation_service,
                        'validate_numeric_params',
                    ],
                ],
                'lang'      => [
                    'required'          => false,
                    'validate_callback' => [
                        $this->validation_service,
                        'validate_required',
                    ],
                ],
            ],
        ] );

        register_rest_route( 'gutenberg-blocks', '/post-types', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this->post_type_service, 'get'],
            'permission_callback' => '__return_true',
            'args'                => [
                'exclude' => [
                    'required'          => false,
                    'validate_callback' => [
                        $this->validation_service,
                        'validate_required',
                    ],
                ],
            ],
        ] );
    }
}