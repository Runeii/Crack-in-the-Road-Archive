<?php get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); 
$pattern = '~floatleft~';
preg_match_all($pattern, $post->post_content, $matches);
$iNumberOfmatches = count($matches[0]);
if ( get_post_gallery() || $iNumberOfmatches > 0 || $GLOBALS['noCover'] == true) { ?>
<section id="content" class="offset" role="main">
<?php } else { ?>
<section id="content" class="none" role="main">
<?php } ?>
<?php get_template_part( 'entry' ); ?>
<?php if ( ! post_password_required() ) comments_template( '', true ); ?>
<div class="invisibleMeta">
<div id="postID"><?php echo $post->ID; ?></div>
<div id="postGUID"><?php echo $post->guid ?></div>
</div>
</section>
<?php 
$category = get_the_category();
endwhile; endif; ?>
<?php 
	$i=0; 
	$args = array( 'numberposts' => 10);
	$related = get_posts( $args ); 

	$args = array( 'numberposts' => 10,'category' => $category[0]->cat_ID, 'offset' => 6 );
	$morecategory = get_posts( $args ); 
?>
	<?php include(locate_template('single-related.php')); ?>
	<?php // include(locate_template('mobile/single-related.php')); ?>
<?php get_footer(); ?>