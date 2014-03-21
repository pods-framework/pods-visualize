<?php
/**
 * Class Pods_Visualize
 */
class Pods_Visualize {

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 *
	 * @var     string
	 */
	const VERSION = '1.0.0';

	/**
	 *
	 */
	const PODS_ADMIN_MENU_SLUG_PREFIX = 'pods-admin_page_';

	/**
	 * Unique identifier
	 *
	 * The variable name is used as the text domain when internationalizing strings
	 * of text. Its value should match the Text Domain file header in the main
	 * plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'pods-visualize';

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;

	/**
	 * Initialize the plugin by setting localization and loading scripts
	 * and styles.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {

		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );

		// Activate plugin when new blog is added
		add_action( 'wpmu_new_blog', array( $this, 'activate_new_site' ) );

		// Load admin style sheet and JavaScript.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

		// Add the menu item to Pods Admin menu
		add_filter( 'pods_admin_menu', array( $this, 'add_plugin_admin_menu' ) );

	}

	/**
	 * Return the plugin slug.
	 *
	 * @since    1.0.0
	 *
	 * @return  string  Plugin slug variable.
	 */
	public function get_plugin_slug() {

		return $this->plugin_slug;
	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Register the menu
	 *
	 * @uses     pods_admin_menu filter.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu( $admin_menus ) {

		$this->plugin_screen_hook_suffix = self::PODS_ADMIN_MENU_SLUG_PREFIX . $this->plugin_slug;

		$admin_menus[ $this->plugin_slug ] = array(
			'label' 	=> __( 'Pods Visualize', $this->plugin_slug ),
			'function' 	=> array( $this, 'display_plugin_admin_page' ),
			'access' 	=> 'manage_options'
		);

		return $admin_menus;
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 */
	public function enqueue_admin_styles() {

		if ( !isset( $this->plugin_screen_hook_suffix ) ) {
			return;
		}

		$screen = get_current_screen();
		if ( $this->plugin_screen_hook_suffix == $screen->id ) {
			wp_enqueue_style( $this->plugin_slug .'-admin-styles', PODS_VISUALIZE_URL . 'includes/css/pods-visualize.css', array(), Pods_Visualize::VERSION );
			wp_enqueue_style( 'jointjs-css', PODS_VISUALIZE_URL . 'includes/jointjs/joint.min.css' );
		}

	}

	/**
	 * Register and enqueue admin-specific JavaScript.
	 */
	public function enqueue_admin_scripts() {

		if ( !isset( $this->plugin_screen_hook_suffix ) ) {
			return;
		}

		$screen = get_current_screen();
		if ( $this->plugin_screen_hook_suffix == $screen->id  && function_exists( 'pods' ) ) {

			wp_enqueue_script( 'jointjs', PODS_VISUALIZE_URL . 'includes/jointjs/joint.min.js' );
			wp_enqueue_script( $this->plugin_slug . '-admin-script', PODS_VISUALIZE_URL . 'includes/js/pods-visualize.js', array( 'jquery', 'jointjs' ), Pods_Visualize::VERSION );

			// Pass pod and field info to the js
			$visualize_data = $this->get_data();
			wp_localize_script( $this->plugin_slug . '-admin-script', 'pods_visualization_data', $visualize_data );

		}

	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page() {

		// ToDo: This test is likely unnecessary; this function should now only be triggered by the pods_admin_menu filter hook
		if ( !function_exists( 'pods' ) ) {
			include PODS_VISUALIZE_DIR . 'views/no-pods.php';
		}
		else {
			include PODS_VISUALIZE_DIR . 'views/admin.php';
		}

	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . $domain . '/' . $domain . '-' . $locale . '.mo' );
		load_plugin_textdomain( $domain, FALSE, basename( plugin_dir_path( dirname( __FILE__ ) ) ) . '/languages/' );

	}

	/**
	 * @return array
	 */
	private function get_data() {

		$api = pods_api();
		$all_pods = $api->load_pods();

		$return_data = array();
		foreach ( $all_pods as $this_pod_id => $this_pod ) {

			$relationships = array();
			foreach ( $this_pod[ 'fields' ] as $this_field_name => $this_field ) {

				// Ignore everything except pick fields
				if ( 'pick' != $this_field['type'] ) {
					continue;
				}

				// Related element's name
				$related_pod_name = ( 'pod' == $this_field[ 'pick_object' ] ) ? $this_field[ 'pick_val' ] : $this_field[ 'pick_object' ];

				// Indicate single/multi
				$is_multi = ( 'multi' == $this_field[ 'options' ][ 'pick_format_type' ] );

				// Collect info if it's a bi-directional field
				$bi_directional = array();
				if ( !empty( $this_field[ 'sister_id' ] ) ) {

					$related_pod = $api->load_pod( array( 'name' => $related_pod_name, 'table_info' => false ) );

					foreach ( $related_pod[ 'fields' ] as $this_related_field ) {

						if ( $this_related_field[ 'id' ] == $this_field[ 'sister_id' ] ) {

							$bi_directional = array(
								'sister_field_name' => $this_related_field[ 'name' ],
								'is_multi' => ( 'multi' == $this_related_field[ 'options' ][ 'pick_format_type' ] )
							);
							break;
						}
					}
				}

				$relationships[ $this_field_name ] = array(
					'related_pod_name' => $related_pod_name,
					'type' => $this_field[ 'pick_object' ],
					'is_multi' => $is_multi,
					'bidirectional' => $bi_directional
				);

			}

			$return_data[ $this_pod_id ] = array(
				'name' => $this_pod[ 'name' ],
				'type' => $this_pod[ 'type' ],
				'relationships' => $relationships
			);
		}

		return $return_data;
	}

}
