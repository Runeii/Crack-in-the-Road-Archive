<?php /* If there are no posts to display, such as an empty archive page */ ?>
<?php if ( ! have_posts() ) {  ?>
	<div id="post-0" class="post error404 not-found">
		<h1 class="entry-title"><?php _e( 'Not Found', 'twentyten' ); ?></h1>
		<div class="entry-content">
			<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'twentyten' ); ?></p>
			<?php get_search_form(); ?>
		</div><!-- .entry-content -->
	</div><!-- #post-0 -->

<?php } else { while ( have_posts() ) : the_post(); ?>
--><a href="<?php echo get_permalink(); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( ), 'home-small' ); 
					$cdn = 'http://d21cfcvj3lq0rt.cloudfront.net/wp' . ltrim($image[0], 'http://www.crackintheroad.com');
					if(file_exists($cdn)) {
						$image[0] = $cdn;
					}
				?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" src="./wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<?php if(strlen($post->post_title) >= 50) { 
							echo '<h4 class="small">' . $post->post_title . '</h4>'; 
							} else { 
								echo '<h4>' . $post->post_title . '</h4>'; 
								} 
						?>
						<h5><?php
							$category = get_the_category();
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
<?php endwhile; }; // End the loop. Whew. ?>