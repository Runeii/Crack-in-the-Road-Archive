<?php
add_action( 'after_setup_theme', 'blankslate_setup' );
function blankslate_setup()
{
load_theme_textdomain( 'blankslate', get_template_directory() . '/languages' );
add_theme_support( 'automatic-feed-links' );
add_theme_support( 'post-thumbnails' );
global $content_width;
if ( ! isset( $content_width ) ) $content_width = 640;
register_nav_menus(
array( 'main-menu' => __( 'Main Menu', 'blankslate' ) )
);
}
add_action( 'wp_enqueue_scripts', 'blankslate_load_scripts' );
function blankslate_load_scripts()
{
wp_enqueue_script( 'jquery' );
}
add_action( 'comment_form_before', 'blankslate_enqueue_comment_reply_script' );
function blankslate_enqueue_comment_reply_script()
{
if ( get_option( 'thread_comments' ) ) { wp_enqueue_script( 'comment-reply' ); }
}
add_filter( 'the_title', 'blankslate_title' );
function blankslate_title( $title ) {
if ( $title == '' ) {
return '&rarr;';
} else {
return $title;
}
}
add_filter( 'wp_title', 'blankslate_filter_wp_title' );
function blankslate_filter_wp_title( $title )
{
return $title . esc_attr( get_bloginfo( 'name' ) );
}
add_action( 'widgets_init', 'blankslate_widgets_init' );
function blankslate_widgets_init()
{
register_sidebar( array (
'name' => __( 'Sidebar Widget Area', 'blankslate' ),
'id' => 'primary-widget-area',
'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
'after_widget' => "</li>",
'before_title' => '<h3 class="widget-title">',
'after_title' => '</h3>',
) );
}
function blankslate_custom_pings( $comment )
{
$GLOBALS['comment'] = $comment;
?>
<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo comment_author_link(); ?></li>
<?php 
}
add_filter( 'get_comments_number', 'blankslate_comments_number' );
function blankslate_comments_number( $count )
{
if ( !is_admin() ) {
global $id;
$comments_by_type = &separate_comments( get_comments( 'status=approve&post_id=' . $id ) );
return count( $comments_by_type['comment'] );
} else {
return $count;
}
}

//Scripts and styles
if ( !is_admin() ) wp_deregister_script('jquery');
add_filter( 'wp_default_scripts', 'dequeue_jquery_migrate' );

function dequeue_jquery_migrate( &$scripts){
	if(!is_admin()){
		$scripts->remove( 'jquery');
	}
}

// Custom
add_filter('show_admin_bar', '__return_false');
add_theme_support('html5', array('search-form'));
add_image_size( 'home-small', '300', '300', true );
add_image_size( 'home-large', '600', '600', true );
add_image_size( 'cover', '1280', '800', true );
add_image_size( 'mobile-micro', '100', '100', true );

if(!is_admin())  {  
    wp_enqueue_style( 'core', get_stylesheet_uri(), false, '1.0', 'all' );
    wp_enqueue_style( 'styles', get_stylesheet_directory_uri() . '/assets/styles/stylesheets/screen.css', array('core'), '0.8', 'all' );

    wp_enqueue_script( 'shiv', get_stylesheet_directory_uri() . '/assets/js/shiv.js', false, '0.1', true );
    wp_enqueue_script( 'sources', get_stylesheet_directory_uri() . '/assets/js/sources.js', false, '0.2', true );
    wp_enqueue_script( 'scripts', get_stylesheet_directory_uri() . '/assets/js/scripts.js', array('sources'), '0.7.1', true );
   // wp_enqueue_script( 'mobile', get_stylesheet_directory_uri() . '/assets/js/mobile.js', array('scripts'), '0.1', true );

};

function filter_ptags_on_images($content){
   return preg_replace('/<p>\s*(<a .*>)?\s*(<img .* \/>)\s*(<\/a>)?\s*<\/p>/iU', '\1\2\3', $content);
}
add_filter('the_content', 'filter_ptags_on_images');

add_action('pre_get_posts', 'wpse74620_ignore_sticky');
// the function that does the work
function wpse74620_ignore_sticky($query)
{
    // sure we're were we want to be.
    if (is_home() && $query->is_main_query())
        $query->set('ignore_sticky_posts', true);
}

function wp_infinitepaginate(){ 
    $paged = $_POST['page_no'];
    $type = $_POST['type'];
    $cat = $_POST['cat'];
    $query = $_POST['query'];

    $ppp  = get_option('posts_per_page');
    
    wp_reset_query();

    # Load the posts
    if($type == 'search') {
    	query_posts(array('paged' => $paged, 's' => $query, 'post_status' => 'publish', 'posts_per_page' => $ppp)); 
    } else if($type == 'cat') {
    	query_posts(array('paged' => $paged, 'cat' => $query, 'post_status' => 'publish', 'posts_per_page' => $ppp)); 
    } else if($type == 'auth') {
        query_posts(array('paged' => $paged, 'author' => $query, 'post_status' => 'publish', 'posts_per_page' => $ppp)); 
    } else {
    	query_posts(array('paged' => $paged, 'post_status' => 'publish', 'posts_per_page' => $ppp)); 
    } 
    echo 'header: ' . $paged;
    get_template_part( 'loop' );
 
    exit;
}
add_action('wp_ajax_infinite_scroll', 'wp_infinitepaginate');           // for logged in user
add_action('wp_ajax_nopriv_infinite_scroll', 'wp_infinitepaginate');    // if user not logged in


remove_shortcode('gallery', 'gallery_shortcode');
add_shortcode('gallery', 'gallery_shortcode_custom');

/**
 * The Gallery shortcode.
 *
 * This implements the functionality of the Gallery Shortcode for displaying
 * WordPress images on a post.
 *
 * @since 2.5.0
 *
 * @param array $attr Attributes of the shortcode.
 * @return string HTML content to display gallery.
 */
function gallery_shortcode_custom($attr) {
    $post = get_post();

    static $instance = 0;
    $instance++;

    if ( ! empty( $attr['ids'] ) ) {
        // 'ids' is explicitly ordered, unless you specify otherwise.
        if ( empty( $attr['orderby'] ) )
            $attr['orderby'] = 'post__in';
        $attr['include'] = $attr['ids'];
    }

    // Allow plugins/themes to override the default gallery template.
    $output = apply_filters('post_gallery', '', $attr);
    if ( $output != '' )
        return $output;

    // We're trusting author input, so let's at least make sure it looks like a valid orderby statement
    if ( isset( $attr['orderby'] ) ) {
        $attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
        if ( !$attr['orderby'] )
            unset( $attr['orderby'] );
    }

    extract(shortcode_atts(array(
        'order'      => 'ASC',
        'orderby'    => 'menu_order ID',
        'id'         => $post ? $post->ID : 0,
        'itemtag'    => 'dl',
        'icontag'    => 'dt',
        'captiontag' => 'dd',
        'columns'    => 3,
        'size'       => 'thumbnail',
        'include'    => '',
        'exclude'    => '',
        'link'       => ''
    ), $attr, 'gallery'));

    $id = intval($id);
    if ( 'RAND' == $order )
        $orderby = 'none';

    if ( !empty($include) ) {
        $_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

        $attachments = array();
        foreach ( $_attachments as $key => $val ) {
            $attachments[$val->ID] = $_attachments[$key];
        }
    } elseif ( !empty($exclude) ) {
        $attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
    } else {
        $attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
    }

    if ( empty($attachments) )
        return '';

    if ( is_feed() ) {
        $output = "\n";
        foreach ( $attachments as $att_id => $attachment )
            $output .= wp_get_attachment_link($att_id, $size, true) . "\n";
        return $output;
    }

    $itemtag = tag_escape($itemtag);
    $captiontag = tag_escape($captiontag);
    $icontag = tag_escape($icontag);
    $valid_tags = wp_kses_allowed_html( 'post' );
    if ( ! isset( $valid_tags[ $itemtag ] ) )
        $itemtag = 'dl';
    if ( ! isset( $valid_tags[ $captiontag ] ) )
        $captiontag = 'dd';
    if ( ! isset( $valid_tags[ $icontag ] ) )
        $icontag = 'dt';

    $columns = intval($columns);
    $itemwidth = $columns > 0 ? floor(100/$columns) : 100;
    $float = is_rtl() ? 'right' : 'left';

    $selector = "gallery-{$instance}";

    $gallery_style = $gallery_div = '';

    $size_class = sanitize_html_class( $size );
    $gallery_div = "<div id='$selector' class='gallery galleryid-{$id} gallery-columns-{$columns} gallery-size-{$size_class}'>";
    $output =  $gallery_div;

    $i = 0;
    foreach ( $attachments as $id => $attachment ) {
        if ( ! empty( $link ) && 'file' === $link )
            $image_output = wp_get_attachment_link( $id, $size, false, false );
        elseif ( ! empty( $link ) && 'none' === $link )
            $image_output = wp_get_attachment_image( $id, $size, false );
        else
            $image_output = wp_get_attachment_link( $id, $size, true, false );

        $image_meta  = wp_get_attachment_metadata( $id );

        $orientation = '';
        if ( isset( $image_meta['height'], $image_meta['width'] ) )
            $orientation = ( $image_meta['height'] > $image_meta['width'] ) ? 'portrait' : 'landscape';

        $output .= "<{$itemtag} class='gallery-item'>";
        $output .= "
            <{$icontag} class='gallery-icon {$orientation}'>
                $image_output
            </{$icontag}>";
        if ( $captiontag && trim($attachment->post_excerpt) ) {
            $output .= "
                <{$captiontag} class='wp-caption-text gallery-caption'>
                " . wptexturize($attachment->post_excerpt) . "
                </{$captiontag}>";
        }
        $output .= "</{$itemtag}>";
    }

    $output .= "
        </div>\n";

    return $output;
}

add_action( 'wp_head', 'tgm_tame_disqus_comments' );
/**
 * Tames DISQUS comments so that it only outputs JS on specified
 * pages in the site.
 */
function tgm_tame_disqus_comments() {
 
    /** If we are viewing a single post, we need the code, so return early */
    if ( is_singular( 'post' ) )
        return;
        
    /** Tame Disqus from outputting JS on pages where comments are not available */
    remove_action( 'loop_end', 'dsq_loop_end' );
    remove_action( 'wp_footer', 'dsq_output_footer_comment_js' );
 
}

//Admin
// using Fieldmanager for a slideshow - any number of slides, with any number of related links
add_action( 'init', function() {
  $fm = new Fieldmanager_Group( array(
		'name' => 'tracks',
		'limit' => 0,
		'label' => 'Audio track',
		'label_macro' => array( 'Track: %s', 'artist', 'title' ),
		'add_more_label' => 'Add another track',
		'collapsed' => true,
		'children' => array(
			'artist' => new Fieldmanager_Textfield( 'Artist' ),
			'title' => new Fieldmanager_Textfield( 'Title' ),
			'url' => new Fieldmanager_Link( 'URL' )		),
	) );
	$fm->add_meta_box( 'Attach audio links', array( 'post' ), 'normal', 'high');
} );

    // Add Artist taxonomy, make it hierarchical (like categories)
    $artisttax = array( 
        'name' => __( 'Artist', 'taxonomy general name' ),
        'singular_name' => __( 'Artist', 'taxonomy singular name' ),
        'search_items' =>  __( 'Search Artists' ),
        'popular_items' => __( 'Popular Artists' ),
        'all_items' => __( 'All Artists' ),
        'parent_item' => __( 'Parent Artist' ),
        'parent_item_colon' => __( 'Parent Artist:' ),
        'edit_item' => __( 'Edit Artist' ), 
        'update_item' => __( 'Update Artist' ),
        'add_new_item' => __( 'Add New Artist' ),
        'new_item_name' => __( 'New Artist' ),
    );  

    register_taxonomy('ha_artist', array('ha_artist', 'post'), array(
        'hierarchical' => true,
        'labels' => $artisttax,
        'show_ui' => true,
        'query_var' => true,
        'rewrite' => array( 'slug' => 'artist' ),
        'capabilities' =>  array(
            'edit_terms' => 'edit_posts',
            'assign_terms' => 'edit_posts'
            )
      ));
function filter_pre_get_posts( $query ) {
    if ( $query->is_main_query ) {
        $query->set( 'ignore_sticky_posts', '1' );
    }
}
add_action( 'pre_get_posts', 'filter_pre_get_posts' );

add_action( 'admin_head', 'remove_my_meta_boxes' );
function remove_my_meta_boxes() {
    remove_meta_box( 'postexcerpt', 'post', 'advanced' );
    remove_meta_box( 'postcustom', 'post', 'advanced' );
    remove_meta_box( 'trackbacksdiv', 'post', 'advanced' );
    remove_meta_box( 'commentsdiv', 'post', 'advanced' );
    remove_meta_box( 'commentstatusdiv', 'post', 'advanced' );
}

// Cover post option
add_action( 'init', function() {
  $fm =  new Fieldmanager_Checkbox( 'Is this a cover story?', array(
            'name' => 'cover_checkbox'
    ) );
    $fm->add_meta_box( 'Cover Settings', array( 'post' ), 'side', 'high' );
} );

add_shortcode("soundcloud", "soundcloud_shortcode");


/**
 * SoundCloud shortcode handler
 * @param  {string|array}  $atts     The attributes passed to the shortcode like [soundcloud attr1="value" /].
 *                                   Is an empty string when no arguments are given.
 * @param  {string}        $content  The content between non-self closing [soundcloud]…[/soundcloud] tags.
 * @return {string}                  Widget embed code HTML
 */
function soundcloud_shortcode($atts, $content = null) {

    $freshatts = shortcode_atts( array(
        'artist' => 'Blank',
        'track' => 'Blank',
        'title' => 'Blank',
        'url' => 'Blank'
    ), $atts );

if(is_null($content)) {
    $url = $content;
} else {
    $url = $freshatts['url'];
}

return '<div class="inline-audio"><ul><li><a href="#" class="noajax post-audio-track" onclick="if ( event.preventDefault ) event.preventDefault(); event.returnValue = false; addTrack(this);" data-artist="'. $freshatts['artist'] . '" data-title="' . $freshatts['title'] . '" data-url="' . $url . '"><i class="icon-play"></i>' . $freshatts['artist'] . ' - ' . $freshatts['title'] . '</a></li></ul></div>';
}

/* Display custom column */
function display_new_columns( $column, $post_id ) {
    switch ( $column ) {
    case 'cover' :
        echo '<input type="checkbox" disabled ', (get_post_meta($post_id, 'cover_checkbox', true) == 1 ? ' checked' : ''), '/>';
        break;
    case 'approval' :
        echo '<input type="checkbox" disabled ', (get_post_status($post_id) == 'pending' ? ' checked' : ''), '/>';
        break;
    case 'imagesize' :
        if(has_post_thumbnail($post_id)) {
            $thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post_id), 'original' );
            if($thumb[1] > 850) { 
                echo 'Cover size';
            }
            else {
                echo 'Small size';
            }
        }else {
            echo '';
        }
        break;
    }
}
add_action( 'manage_posts_custom_column' , 'display_new_columns', 10, 2 );

/* Add custom column to post list */
function add_columns( $columns ) {
    return array_merge( $columns,
        array( 'imagesize' => __( 'Image size' ) ),
        array( 'cover' => __( 'Cover story' ) ),
        array( 'approval' => __( 'Needs approval' ) )
    );
}
add_filter( 'manage_posts_columns' , 'add_columns' );

add_filter( 'wpseo_use_page_analysis', '__return_false' );

/* Handy function to  have external image archives 
function s3_image_archives($value = false, $id, $size) { 

    $img_url = wp_get_attachment_url($id);
    $meta = wp_get_attachment_metadata($id);
    $width = $height = 0;
    $is_intermediate = false;
    $img_url_basename = wp_basename($img_url);
    if (strpos($img_url,'uploads/2011') !== false || strpos($img_url,'uploads/2010') !== false ) {
        $img_url = str_replace('http://www.crackintheroad.com/wp-content/uploads/', 'https://s3-eu-west-1.amazonaws.com/citrmain/', $img_url);
    }

    // try for a new style intermediate size
    if ( $intermediate = image_get_intermediate_size($id, $size) ) {
        $img_url = str_replace($img_url_basename, $intermediate['file'], $img_url);
        $width = $intermediate['width'];
        $height = $intermediate['height'];
        $is_intermediate = true;
    }
    elseif ( $size == 'thumbnail' ) {
        // fall back to the old thumbnail
        if ( ($thumb_file = wp_get_attachment_thumb_file($id)) && $info = getimagesize($thumb_file) ) {
            $img_url = str_replace($img_url_basename, wp_basename($thumb_file), $img_url);
            $width = $info[0];
            $height = $info[1];
            $is_intermediate = true;
        }
    }
    if ( !$width && !$height && isset( $meta['width'], $meta['height'] ) ) {
        // any other type: use the real image
        $width = $meta['width'];
        $height = $meta['height'];
    }

    if ( $img_url) {
        // we have the actual image size, but might need to further constrain it if content_width is narrower
        list( $width, $height ) = image_constrain_size_for_editor( $width, $height, $size );

        return array( $img_url, $width, $height, $is_intermediate );
    }
    return false;
}
add_filter( 'image_downsize', 's3_image_archives', 1, 3 );
*/
function getService()
{
  // Creates and returns the Analytics service object.

  // Load the Google API PHP Client Library.
  require_once __DIR__ . '/classes/google-api-php-client/src/Google/autoload.php';

  // Use the developers console and replace the values with your
  // service account email, and relative location of your key file.
  $service_account_email = 'account-1@citr-test.iam.gserviceaccount.com';
  $key_file_location = __DIR__ . '/classes/google-api-php-client/CITR-9a6b358a6eb9.p12';

  // Create and configure a new client object.
  $client = new Google_Client();
  $client->setApplicationName("CITR");
  $analytics = new Google_Service_Analytics($client);

  // Read the generated client_secrets.p12 key.
  $key = file_get_contents($key_file_location);
  $cred = new Google_Auth_AssertionCredentials(
      $service_account_email,
      array(Google_Service_Analytics::ANALYTICS_READONLY),
      $key
  );
  $client->setAssertionCredentials($cred);
  if($client->getAuth()->isAccessTokenExpired()) {
    $client->getAuth()->refreshTokenWithAssertion($cred);
  }

  return $analytics;
}

function getResults(&$analytics) {
  // Calls the Core Reporting API and queries for the number of sessions
  // for the last seven days.
  $optParams = array(
      'dimensions' => 'ga:eventAction,ga:eventLabel',
			'sort' => '-ga:totalEvents',
			'filters' => 'ga:eventAction%3D%3Dread',
		'max-results' => 10
	);
   return $analytics->data_ga->get(
       'ga:49013870',
       'yesterday',
       'today',
       'ga:totalEvents',
		 	$optParams
		 );
}

function updateResults(&$results) {
	require( __DIR__ . '/../../../wp-load.php');
	update_option('ga_popular_posts', $results->getRows());
	echo get_option('ga_popular_posts');
}

if ( ! wp_next_scheduled( 'getPopularPosts_hook' ) ) {
  wp_schedule_event( time(), 'daily', 'getPopularPosts_hook' );
}

add_action( 'getPopularPosts_hook', 'getPopularPosts' );

function getPopularPosts() {
	$analytics = getService();
	$results = getResults($analytics);
	updateResults($results);			
}