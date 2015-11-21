<?php get_header(); ?>
<section class="new main">
	<?php $i=0; 
		$args = array( 'numberposts' => 20,'category' => 2269 );
	    $music = get_posts( $args ); 
	    $idtally = array();
	    foreach($music as $entry) {
	    	$idtally[] = $entry->ID;
	    	if($i == 5) { break; };
	    	$i++;
	    };
	    ?>
			<div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink( $music['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['1']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($music['1']->post_title) >= 50) { 
							echo '<h4 class="small">' . $music['1']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $music['1']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
				<h3>New</h3>
				<a href="<?php echo home_url() ?>/?cat=2269">More</a>
				</div></div>
			</div>
			</div>
			</div><!--
		--><div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $music['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['2']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($music['2']->post_title) >= 50) { 
							echo '<h4 class="small">' . $music['2']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $music['2']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $music['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['3']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($music['3']->post_title) >= 50) { 
							echo '<h4 class="small">' . $music['3']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $music['3']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div><!--
	--><a href="<?php echo get_permalink( $music['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['0']->ID ), 'home-large' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($music['0']->post_title) >= 50) { 
							echo '<h4 class="small">' . $music['0']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $music['0']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
		</div></a><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $music['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['4']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($music['4']->post_title) >= 50) { 
							echo '<h4 class="small">' . $music['4']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $music['4']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $music['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['5']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($music['5']->post_title) >= 50) { 
							echo '<h4 class="small">' . $music['5']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $music['5']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div>
		<?php $i=0; foreach($music as $entry) { 
			if ($i < 6) {
				$i++;
				continue;
			}?>
			<a href="<?php echo get_permalink( $entry->ID ); ?>"><div class="mobile subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $entry->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($entry->post_title) >= 50) { 
							echo '<h4 class="small">' . $entry->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $entry->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
			</a>
		<?php 	} ?>
	</section><section class="introducing main">
		<?php $i=0; 
		$args = array( 'numberposts' => 20,'category' => 2215 );
	    $art = get_posts( $args ); 
	    foreach($art as $entry) {
	    	$idtally[] = $entry->ID;
	    	if($i == 5) { break; };
	    	$i++;
	    };
	    ?>
			<div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $art['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['1']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($art['1']->post_title) >= 50) { 
							echo '<h4 class="small">' . $art['1']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $art['1']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $art['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['2']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($art['2']->post_title) >= 50) { 
							echo '<h4 class="small">' . $art['2']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $art['2']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div><!--
	--><a href="<?php echo get_permalink( $art['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['0']->ID ), 'home-large' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($art['0']->post_title) >= 50) { 
							echo '<h4 class="small">' . $art['0']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $art['0']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
		</div></a><!--
		--><div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink( $art['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['3']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($art['3']->post_title) >= 50) { 
							echo '<h4 class="small">' . $art['3']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $art['3']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
				<h3>Introducing</h3>
				<a href="<?php echo home_url() ?>/?cat=2215">More</a>
				</div></div>
				</div>
				</div>
			</div><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $art['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['4']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($art['4']->post_title) >= 50) { 
							echo '<h4 class="small">' . $art['4']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $art['4']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $art['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['5']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($art['5']->post_title) >= 50) { 
							echo '<h4 class="small">' . $art['5']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $art['5']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div>
		<?php $i=0; foreach($art as $entry) { 
			if ($i < 6) {
				$i++;
				continue;
			}?>
			<a href="<?php echo get_permalink( $entry->ID ); ?>"><div class="mobile subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $entry->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($entry->post_title) >= 50) { 
							echo '<h4 class="small">' . $entry->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $entry->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
			</a>
		<?php 	} ?>
	</section><section class="hot main">
		<?php $i=0; 
			$popular = array();
			$top_posts = get_option('ga_popular_posts');
				foreach($top_posts as $populartemp) {
					$popular[$i] = new StdClass;
					$popular[$i]->ID = $populartemp[1];
					$popular[$i]->post_title = get_the_title($populartemp[1]);
					$i++;
					if($i == 10) break;
				}
				
				?>
			<div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $popular['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['1']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['1']->post_title) >= 50) { 
							echo '<h4 class="small">' . $popular['1']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $popular['1']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $popular['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['2']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['2']->post_title) >= 50) { 
							echo '<h4 class="small">' . $popular['2']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $popular['2']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div><!--
		--><div class="hentry column header"><!--
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
					<h3>Popular today</h3>
				</div></div>
				</div><!--
			--><a href="<?php echo get_permalink( $popular['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['3']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['3']->post_title) >= 50) { 
							echo '<h4 class="small">' . $popular['3']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $popular['3']->post_title . '</h4>'; 
						} 
						?>
					</div>
				</div>
				</div>
				</a>
			</div><!--
	--><a href="<?php echo get_permalink( $popular['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['0']->ID ), 'home-large' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
			<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['0']->post_title) >= 50) { 
							echo '<h4 class="small">' . $popular['0']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $popular['0']->post_title . '</h4>'; 
						} 
						?>
			</div></div>
		</div></a><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $popular['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['4']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['4']->post_title) >= 50) { 
							echo '<h4 class="small">' . $popular['4']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $popular['4']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $popular['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['5']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['5']->post_title) >= 50) { 
							echo '<h4 class="small">' . $popular['5']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $popular['5']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div>
		<?php $i=0; foreach($popular as $entry) { 
			if ($i < 6) {
				$i++;
				continue;
			}?>
			<a href="<?php echo get_permalink( $entry->ID ); ?>"><div class="mobile subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $entry->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($entry->post_title) >= 50) { 
							echo '<h4 class="small">' . $entry->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $entry->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
			</a>
		<?php 	} ?>
	</section><!--
--><section id="popularSticky" class="popular"><!--
			--><div class="subhentry hentry options">
				<h3>Featured</h3>
				</div><!--
				<?php $i=0; 
							// get sticky posts from DB
							$sticky = get_option('sticky_posts');
							// check if there are any
							if (!empty($sticky)) {
									// override the query
									$args = array(
											'post__in' => $sticky
									);
	    
									$featuredposts = get_posts( $args ); 
									// the loop
									foreach($featuredposts as $featured) {
						?>
							--><a href="<?php echo get_permalink( $featured->ID ); ?>"><div class="subhentry hentry">
									<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $featured->ID ), 'home-small' ); ?>
									<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
									<div class="table-box"><div class="table-cell">
									<?php if(strlen($featured->post_title) >= 50) { 
											echo '<h4 class="small">' . $featured->post_title . '</h4>'; 
										} else { 
											echo '<h4>'. $featured->post_title . '</h4>'; 
										} 
										?>
										<h5><?php
											$category = get_the_category($featured->ID);
											if ($category) {
												echo $category[0]->name;
											}
											?>
										</h5>	
									</div></div>
								</div>
								</a>
			<!--
		<?php
							}						 }; ?>
--></section><section id="archiveSticky" class="archive infinitescroll">
	<!--
		<?php 
		$i=0; 
		rewind_posts();
		while ( have_posts() ) : the_post(); 
		if(in_array($post->ID, $idtally)) { 
		} else {  ?>
		--><a href="<?php echo get_permalink(); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
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
		<?php }; $i++; endwhile; ?>
--></section>
<?php get_template_part( 'nav', 'below' ); ?>

<?php get_footer(); ?>