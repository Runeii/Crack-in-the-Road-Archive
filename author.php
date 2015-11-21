<?php get_header(); ?>
<section id="content" class="main">
<header class="header">
<?php the_post(); ?>
<?php if ( '' != get_the_author_meta( 'user_description' ) ) echo apply_filters( 'archive_meta', '<div class="archive-meta">' . get_the_author_meta( 'user_description' ) . '</div>' ); ?>
<?php rewind_posts(); ?>
</header>
<section class="infinitescroll"><!--
<?php while ( have_posts() ) : the_post(); ?>
		--><a href="<?php echo get_permalink(); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $post->post_title; ?></h4>
						<h5><?php
							$category = get_the_category();
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
<?php endwhile; ?>
--></section>
<?php get_template_part( 'nav', 'below' ); ?>
</section>
<?php get_sidebar(); ?>
<?php get_footer(); ?>