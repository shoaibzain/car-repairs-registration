<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );

if ( !function_exists( 'chld_thm_cfg_parent_css' ) ):
    function chld_thm_cfg_parent_css() {
        wp_enqueue_style( 'chld_thm_cfg_parent', trailingslashit( get_template_directory_uri() ) . 'style.css', array(  ) );
    }
endif;
add_action( 'wp_enqueue_scripts', 'chld_thm_cfg_parent_css', 10 );
         
if ( !function_exists( 'child_theme_configurator_css' ) ):
    function child_theme_configurator_css() {                
        wp_enqueue_style( 'chld_thm_cfg_child', trailingslashit( get_stylesheet_directory_uri() ) . 'style.css', array( 'chld_thm_cfg_parent' ) );
        wp_enqueue_script('main-js', trailingslashit(get_stylesheet_directory_uri()) . 'assets/js/main.js', array('jquery'), '1.7', true);

        // Localize the script with ajaxurl
        wp_localize_script('main-js', 'ajax_object', array(
            'ajaxurl' => admin_url('admin-ajax.php') // This will add the ajaxurl variable to the script
        ));
    }
endif;
add_action( 'wp_enqueue_scripts', 'child_theme_configurator_css', 10 );

// END ENQUEUE PARENT ACTION


function add_custom_footer_code() {
    ?>
<!-- The Popup -->
<div id="popup" class="popup">
    <div class="popup-content">
        <span class="close-btn">&times;</span>
        <div class="popup-content_form">
            <div class="logopopup">
                <?php $logo = theme_get_logo(array(
            'default_src' => "/images/UroojZaidi.png",
            'default_url' => "https://nicepage.com"
        )); $url = stripos($logo['url'], 'http') === 0 ? esc_url($logo['url']) : $logo['url']; ?>
                <img <?php if ($logo['svg']) { echo 'style="width:'.$logo['width'].'px"'; } ?>src="<?php echo esc_url($logo['src']); ?>"
                    class="u-logo-image u-logo-image-1">
            </div>

            <h2 class="heading">Fixing your car just got easier</h2>
            <?php echo do_shortcode('[fluentform id="3"]'); ?>
        </div>
    </div>
</div>

<!-- The Popup -->
<?php
}
add_action('wp_footer', 'add_custom_footer_code');

add_action('wp_ajax_get_vehicle_data', 'get_vehicle_data');
add_action('wp_ajax_nopriv_get_vehicle_data', 'get_vehicle_data');

function get_vehicle_data() {
    $registration_number = isset($_POST['registrationNumber']) ? sanitize_text_field($_POST['registrationNumber']) : '';
    $api_key = 'CK3bQnrp7J3oTVVh5Qx4C3f5PsqY643S3DqcwBUn'; // Replace with your actual API key

    $api_url = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';

    $body = json_encode(array('registrationNumber' => $registration_number));

    $response = wp_remote_post($api_url, array(
        'body' => $body,
        'headers' => array(
            'x-api-key' => $api_key,
            'Content-Type' => 'application/json'
        )
    ));

    if (is_wp_error($response)) {
        wp_send_json_error('API Request Failed');
    }

    wp_send_json_success(wp_remote_retrieve_body($response));
}


