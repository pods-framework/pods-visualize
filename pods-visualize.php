<?php
/*
Plugin Name: Pods Visualize
Plugin URI: http://pods.io/
Description: Display a visual representation of your Pods relationships
Version: 1.0
Author: Pods Framework Team
Author URI: http://pods.io/about/

Copyright 2013-2014  Pods Foundation, Inc  (email : contact@podsfoundation.org)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

define( 'PODS_VISUALIZE_URL', plugin_dir_url( __FILE__ ) );
define( 'PODS_VISUALIZE_DIR', plugin_dir_path( __FILE__ ) );

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/*
 * If you want to include Ajax within the dashboard, change the following
 * conditional to:
 *
 * if ( is_admin() ) {
 *   ...
 * }
 *
 * The code below is intended to to give the lightest footprint possible.
 */
if ( is_admin() && ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) ) {

	require_once PODS_VISUALIZE_DIR . 'class-pods-visualize.php';
	add_action( 'plugins_loaded', array( 'Pods_Visualize', 'get_instance' ) );
}
