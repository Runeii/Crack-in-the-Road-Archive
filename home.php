<?php get_header(); ?>
<section class="music main">
	<?php $i=0; 
		$args = array( 'numberposts' => 20,'category' => 301 );
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
				<h3>Music</h3>
				<a href="<?php echo home_url() ?>/?cat=301">More</a>
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
	</section><section class="art main">
		<?php $i=0; 
		$args = array( 'numberposts' => 20,'category' => 304 );
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
				<h3>Art</h3>
				<a href="<?php echo home_url() ?>/?cat=304">More</a>
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
	</section><section class="introducing main">
		<?php $i=0; 
		$args = array( 'numberposts' => 20,'category' => 2215 );
	    $intro = get_posts( $args );
	    foreach($intro as $entry) {
	    	$idtally[] = $entry->ID;
	    	if($i == 5) { break; };
	    	$i++;
	    };
	    ?>
			<div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $intro['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['1']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($intro['1']->post_title) >= 50) { 
							echo '<h4 class="small">' . $intro['1']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $intro['1']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $intro['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['2']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($intro['2']->post_title) >= 50) { 
							echo '<h4 class="small">' . $intro['2']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $intro['2']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div><!--
		--><div class="hentry column header"><!--
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
					<h3>Introducing</h3>
					<a href="<?php echo home_url() ?>/?cat=2215">More</a>
				</div></div>
				</div><!--
			--><a href="<?php echo get_permalink( $intro['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['3']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($intro['3']->post_title) >= 50) { 
							echo '<h4 class="small">' . $intro['3']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $intro['3']->post_title . '</h4>'; 
						} 
						?>
					</div>
				</div>
				</div>
				</a>
			</div><!--
	--><a href="<?php echo get_permalink( $intro['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['0']->ID ), 'home-large' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
			<div class="table-box"><div class="table-cell">
					<?php if(strlen($intro['0']->post_title) >= 50) { 
							echo '<h4 class="small">' . $intro['0']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $intro['0']->post_title . '</h4>'; 
						} 
						?>
			</div></div>
		</div></a><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $intro['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['4']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($intro['4']->post_title) >= 50) { 
							echo '<h4 class="small">' . $intro['4']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $intro['4']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $intro['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['5']->ID ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($intro['5']->post_title) >= 50) { 
							echo '<h4 class="small">' . $intro['5']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $intro['5']->post_title . '</h4>'; 
						} 
						?>
					</div></div>
				</div>
				</a><!--
		--></div>
		<?php $i=0; foreach($intro as $entry) { 
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
	</section><section class="about main"><!--
	--><div class="hentry options offset1">
				<div class="table-box"><div class="table-cell">
				<h3>About</h3>
				<ul>
					<li><a href="/about">Read</a></li>
				</ul>
				</div></div>
			</div><!--
	--><div class="hentry options offset1 dropOffset">
				<div class="table-box"><div class="table-cell">
				<h3>People</h3>
				<ul>
					<li><a href="/people">Read</a></li>
				</ul>
				</div></div>
			</div><!--
--></section><section class="events main">
		<?php $i=0; 
		$args = array( 'numberposts' => 4,'category' => 3791 );
	    $events = get_posts( $args ); 
	    foreach($events as $entry) {
	    	$idtally[] = $entry->ID;
	    };
	    ?>
			<!--
	--><a href="<?php echo get_permalink( $events['0']->ID ); ?>"><div class="hentry">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $events['0']->ID ), 'home-small' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
			<div class="table-box"><div class="table-cell">
					<?php if(strlen($events['0']->post_title) >= 50) { 
							echo '<h4 class="small">' . $events['0']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $events['0']->post_title . '</h4>'; 
						} 
						?>
			</div></div>
		</div></a><!--
	--><a href="<?php echo get_permalink( $events['1']->ID ); ?>"><div class="hentry">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $events['1']->ID ), 'home-small' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
			<div class="table-box"><div class="table-cell">
					<?php if(strlen($events['1']->post_title) >= 50) { 
							echo '<h4 class="small">' . $events['1']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $events['1']->post_title . '</h4>'; 
						} 
						?>
			</div></div>
		</div></a><!--
		--><div class="hentry options">
				<div class="table-box"><div class="table-cell">
				<h3>Events</h3>
				</div></div>
			</div><!--
	--><a href="<?php echo get_permalink( $events['2']->ID ); ?>"><div class="hentry">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $events['2']->ID ), 'home-small' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
			<div class="table-box"><div class="table-cell">
					<?php if(strlen($events['2']->post_title) >= 50) { 
							echo '<h4 class="small">' . $events['2']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $events['2']->post_title . '</h4>'; 
						} 
						?>
			</div></div>
		</div></a><!--
	--><a href="<?php echo get_permalink( $events['3']->ID ); ?>"><div class="hentry">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $events['3']->ID ), 'home-small' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
			<div class="table-box"><div class="table-cell">
					<?php if(strlen($events['3']->post_title) >= 50) { 
							echo '<h4 class="small">' . $events['3']->post_title . '</h4>'; 
						} else { 
							echo '<h4>' . $events['3']->post_title . '</h4>'; 
						} 
						?>
			</div></div>
		</div></a><!--
		--></section><section class="socialMedia main"><!--
	--><div class="hentry options clear">
				<div class="table-box"><div class="table-cell">
				<h3><i class="icon-mail"></i></h3>
				<ul>
					<li>&nbsp;</li>
					<li><a href="mailto:site@crackintheroad.com">Email</a></li>
				</ul>
				</div></div>
			</div><!--
	--><div class="hentry options clear">
				<div class="table-box"><div class="table-cell">
				<h3><i class="icon-twitter"></i></h3>
				<ul>
					<li>&nbsp;</li>
					<li><a href="http://www.twitter.com/crackintheroad">Twitter</a></li>
				</ul>
				</div></div>
			</div><!--
	--><div class="hentry options clear instagram">
				<div class="table-box"><div class="table-cell">
				<h3><i class="icon-instagram"></i></h3>
				<ul>
					<li>&nbsp;</li>
					<li><a href="http://www.instagram.com/crackintheroad">Instagram</a></li>
				</ul>
				</div></div>
			</div><!--
	--><div class="hentry options clear">
				<div class="table-box"><div class="table-cell">
				<h3><i class="icon-facebook"></i></h3>
				<ul>
					<li>&nbsp;</li>
					<li><a href="http://www.facebook.com/crackintheroad">Facebook</a></li>
				</ul>
				</div></div>
			</div><!--
	--><div class="hentry options clear">
				<div class="table-box"><div class="table-cell">
				<h3><i class="icon-soundcloud"></i></h3>
				<ul>
					<li>&nbsp;</li>
					<li><a href="http://www.soundcloud.com/crackintheroad">Soundcloud</a></li>
				</ul>
				</div></div>
			</div><!--
--></section><section id="popularSticky" class="popular"><!--
			--><div class="subhentry hentry options">
				<h3>Popular</h3>
				</div><!--
				<?php $i=0; 
					if ( function_exists('stats_get_csv')) {
					$top_posts = stats_get_csv('postviews', 'days=30&limit=23'); 
				    foreach($top_posts as $popular) {  
				    if($popular['post_title'] != 'Home page' && $popular['post_title'] != 'Front Page' && $popular['post_id'] != 8901 ) { ?>
			--><a href="<?php echo get_permalink( $popular['post_id'] ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular['post_id'] ), 'home-small' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITRForever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
					<?php if(strlen($popular['post_title']) >= 50) { 
							echo '<h4 class="small">' . get_the_title($popular['post_id']) . '</h4>'; 
						} else { 
							echo '<h4>' . get_the_title($popular['post_id']) . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($popular['post_id']);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
				</div>
				</a>
			<!--
		<?php } } }; ?>
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