<?php
namespace GutenbergBlocks\Controllers\Blocks;

\defined( 'ABSPATH' ) || die;

class AbstractBlockController {
    protected $block_basedir;
    protected $block_baseurl;
    protected $frontend_script_handle;
    protected $block_name;

    /**
     * The render function for the block.
     *
     * @param array  $attributes The block attributes as defined in the block.json file.
     * @param string $content    The content of the dynamic block.
     */
    public function render_block_with_attributes( $attributes = [], $content = '' ) {
        if ( !is_admin() ) {
            $this->enqueue_frontend_script();
        }

        return $this->add_attributes_to_block( $attributes, $content );
    }

    /**
     * Enqueue the frontend script for the block only when this block is rendered.
     * Currently, this is the way to enqueue extra js files for a block.
     * Copied from @wordpress/dependency-extraction-webpack-plugin docs.
     * @see https://developer.woocommerce.com/2021/11/15/how-does-woocommerce-blocks-render-interactive-blocks-in-the-frontend/
     */
    public function enqueue_frontend_script() {
        if ( is_theme() ) {
            $this->enqueue_frontend_if_is_theme();
        } else {
            $this->enqueue_frontend_if_is_plugin();
        }
    }

    private function enqueue_frontend_if_is_theme() {
        $theme_url  = get_stylesheet_directory_uri();
        $explode    = explode( '/', $theme_url );
        $theme_name = array_pop( $explode );

        $explode                 = explode( 'themes/' . $theme_name, $this->block_basedir );
        $theme_relative_base_dir = array_pop( $explode );

        $script_php_path   = $this->block_basedir . 'frontend.asset.php';
        $script_asset_path = $this->block_basedir . 'frontend.js';
        if ( !file_exists( $script_asset_path ) ) {
            return;
        }

        $script_asset = file_exists( $script_php_path ) ? require $script_php_path : [
            'dependencies' => ['react', 'wp-element', 'wp-i18n'],
            'version'      => filemtime( $script_asset_path ),
        ];
        $script_url = $theme_url . $theme_relative_base_dir . 'frontend.js';

        !wp_script_is( $this->frontend_script_handle, 'enqueued' ) && wp_enqueue_script( $this->frontend_script_handle, $script_url, $script_asset['dependencies'], $script_asset['version'] );
    }

    private function enqueue_frontend_if_is_plugin() {

        $script_php_path   = $this->block_basedir . 'frontend.asset.php';
        $script_asset_path = $this->block_basedir . 'frontend.js';
        if ( !file_exists( $script_asset_path ) ) {
            return;
        }

        $script_asset = file_exists( $script_php_path ) ? require $script_php_path : [
            'dependencies' => ['react', 'wp-element', 'wp-i18n'],
            'version'      => filemtime( $script_asset_path ),
        ];
        $script_url = $this->block_baseurl . 'frontend.js';

        !wp_script_is( $this->frontend_script_handle, 'enqueued' ) && wp_enqueue_script( $this->frontend_script_handle, $script_url, $script_asset['dependencies'], $script_asset['version'] );
    }

    /**
     * Add attributes to the block main div as data attributes.
     * Copied from WooCommerce Blocks.
     *
     *
     * @see https://developer.woocommerce.com/2021/11/15/how-does-woocommerce-blocks-render-interactive-blocks-in-the-frontend/
     *
     * @param  array  $attributes The block attributes.
     * @param  string $content    The block content.
     * @return string The block content with the attributes added.
     */
    public function add_attributes_to_block( $attributes = [], $content = '' ) {
        $escaped_data_attributes = [];

        foreach ( $attributes as $key => $value ) {
            if ( is_bool( $value ) ) {
                $value = $value ? 'true' : 'false';
            }
            if ( !is_scalar( $value ) ) {
                $value = wp_json_encode( $value );
            }
            $escaped_data_attributes[] = 'data-' . esc_attr( strtolower( preg_replace( '/(?<!\ )[A-Z]/', '-$0', $key ) ) ) . '="' . esc_attr( $value ) . '"';
        }

        // Use this to add extra classes to the content, but keeping the previous ones.
        $extra_classes = '';
        $content       = preg_replace( '/^<div class="([^"]*)"/', '<div class="$1 ' . $extra_classes . '"', trim( $content ) );

        return preg_replace( '/^<div /', '<div ' . implode( ' ', $escaped_data_attributes ) . ' ', trim( $content ) );
    }
}