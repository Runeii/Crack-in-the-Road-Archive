<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<header class="title">
	<h2 class="entry-title"><?php the_title(); ?></h2>
	<div class="edit">
		<a href="" class="noajax post-author-link">(<?php the_author(); ?>)</a>
			<br />
		<a class="noajax post-edit-link" href="http://www.crackintheroad.com/wp-admin/post.php?post=<?php echo $post->ID ?>&amp;action=edit"><i class="icon-pencil"></i></a><?php // edit_post_link(); ?>
	</div>
</header>
<section class="entry-content">
<?php 
if($GLOBALS['noCover'] == true) {
$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'medium' ); 
echo '<img src="' . $image[0] .'" class="smallCover floatleft" />';
}
?>
<?php get_template_part( 'entry', ( is_archive() || is_search() ? 'summary' : 'content' ) ); ?>
<?php if ( !is_search() ) get_template_part( 'entry-footer' ); ?>
</section>
<footer class="footer">
<?php get_template_part( 'audio', 'post' ); ?>
</footer>
</article>