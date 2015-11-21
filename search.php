<?php get_header(); ?>
<section id="content" class="main infinitescroll" role="main">
<?php if ( have_posts() ) : ?>
<!--
<?php while ( have_posts() ) : the_post(); ?>
<?php get_template_part( 'entry', 'archive' ); ?>
<?php endwhile; ?>
-->
<?php endif; ?>
</section>
<?php get_template_part( 'nav', 'below' ); ?>
<?php get_sidebar(); ?>
<?php get_footer(); ?>