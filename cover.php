<?php 
    $force = false;
if (is_home()){
    $args = array(
    	"post_type" => 'post',
    	 'meta_query' => array(
    	 	'relation' => 'AND',
     		array(
			'key' => 'cover_checkbox',
			'value' => 1,
        			'compare' => '='
       		)
       	),
    	'order' => 'DESC',
    	'posts_per_page' => 1,
    	'ignore_sticky_posts' => 1
    );
    $sticky = get_posts($args);
    $image = wp_get_attachment_image_src( get_post_thumbnail_id( $sticky['0']->ID ), 'cover' );
    $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $sticky['0']->ID ), 'home-small' );
    $force = true;
} else if (is_category()){
	$category = get_category( get_query_var( 'cat' ) );
	$cat_id = $category->cat_ID;
    $args = array(
    	"post_type" => 'post',
    	 'meta_query' => array(
    	 	'relation' => 'AND',
     		array(
			'key' => 'cover_checkbox',
			'value' => 1,
        			'compare' => '='
       		)
       	),
    	'order' => 'DESC',
    	'posts_per_page' => 1,
    	'ignore_sticky_posts' => 1,
    	'category' => $cat_id
    );
    $sticky = get_posts($args);
    $image = wp_get_attachment_image_src( get_post_thumbnail_id( $sticky['0']->ID ), 'cover' );
    $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $sticky['0']->ID ), 'home-small' );
    $force = true;
} else {
    $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'cover' );
    $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'home-small' );
}	
?>
<div id="cover" data-thumb="<?php echo $thumb[0] ?>"<?php 
if($image[1] >= '850' || $force == true) { 
    echo 'style="background-image:url('.  $image[0] .')" >'; 
    $GLOBALS['noCover'] = false; 
} 
else { 
	echo 'class="disabled" >'; 
	$GLOBALS['noCover'] = true;
	} ?>
<div class="menuRow">
</div>

<ul id="coverTitle">
    <div class="holder">
        <li class="siteEmail"><a href="mailto:site@crackintheroad.com">site@crackintheroad.com</a></li>
        <li class="logoBox">
            <div class="logoRow">
                <div class="initial"><a href="http://www.crackintheroad.com/">C</a></div>
                <div class="initial"><a href="http://www.crackintheroad.com/">I</a></div>
            </div>
            <div class="logoRow">
                <div class="initial"><a href="http://www.crackintheroad.com/">T</a></div>
                <div class="initial"><a href="http://www.crackintheroad.com/">R</a></div>
            </div>
        </li>
        <li class="siteTitle"><a href="http://www.crackintheroad.com/">Crack in the Road</a></li>
    </div>
    <?php if(is_single()) {  ?>
            <div id="pageDesc"><?php the_title() ?></div>
    <?php } else if(is_category()) {  ?>
            <div id="pageDesc" ><?php single_cat_title(); ?> archives</div>
    <?php } else if(is_search()) {  ?>
            <div id="pageDesc" >Results for '<?php echo get_search_query() ?>'</div>
    <?php } else if(is_author()) {  ?>
            <div id="pageDesc" >Words what <?php echo get_the_author_meta( 'first_name' ) ?> did write</div>
    <?php } else { ?>
            <div id="pageDesc"></div>
    <?php }  ?>
</ul>
</div>
