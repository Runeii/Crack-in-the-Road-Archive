<?php get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); 
$pattern = '~floatleft~';
preg_match_all($pattern, $post->post_content, $matches);
$iNumberOfmatches = count($matches[0]);
if ( get_post_gallery() || $iNumberOfmatches > 0) { ?>
<section id="content" class="offset" role="main">
<?php } else { ?>
<section id="content" class="none" role="main">
<?php } ?>
<?php get_template_part( 'entry', 'page' ); ?>
</section>
<?php endwhile; endif; 
get_footer(); ?>