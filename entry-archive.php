--><a href="<?php echo get_permalink(); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'home-small' ); ?>
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