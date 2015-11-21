<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<header class="title">
	<h2 class="entry-title"><?php the_title(); ?></h2>
	<div class="edit">
		<a class="noajax post-edit-link" href="http://ec2-54-194-224-129.eu-west-1.compute.amazonaws.com/wp-admin/post.php?post=<?php echo $post->ID ?>&amp;action=edit"><i class="icon-pencil"></i></a><?php // edit_post_link(); ?>
	</div>
</header>
<section class="entry-content">
<?php get_template_part( 'entry', ( is_archive() || is_search() ? 'summary' : 'content' ) ); ?>
<?php if ( !is_search() ) get_template_part( 'entry-footer' ); ?>
</section>
<footer class="footer">
</footer>
</article>