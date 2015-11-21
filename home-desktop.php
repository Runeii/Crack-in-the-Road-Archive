<?php get_header(); ?>
DESKTOP
<section class="music main">
		<?php $i=0; 
		$args = array( 'numberposts' => 6,'category' => 301 );
	    $music = get_posts( $args ); 
	    foreach($music as $entry) {
	    	$idtally[] = $entry->ID;
	    };
	    ?>
			<div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink( $music['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['1']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-thumb="" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $music['1']->post_title; ?></h4>
				</div>
				</a><!--
			--><div class="subhentry hentry options">
				<h3>desktop</h3>
				<a href="<?php echo home_url() ?>/?cat=301">More</a>
				</div>
			</div>
			</div><!--
		--><div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $music['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['2']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $music['2']->post_title; ?></h4>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $music['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['3']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $music['3']->post_title; ?></h4>
				</div>
				</a><!--
		--></div><!--
	--><a href="<?php echo get_permalink( $music['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['0']->ID ), 'thumbnail' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $music['0']->post_title; ?></h4>
		</div></a><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $music['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['4']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $music['4']->post_title; ?></h4>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $music['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $music['5']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $music['5']->post_title; ?></h4>
				</div>
				</a><!--
		--></div>
	</section><section class="art main">
		<?php $i=0; 
		$args = array( 'numberposts' => 6,'category' => 304 );
	    $art = get_posts( $args ); 
	   	foreach($art as $entry) {
	    	$idtally[] = $entry->ID;
	    };
	    ?>
			<div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $art['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['1']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $art['1']->post_title; ?></h4>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $art['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['2']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $art['2']->post_title; ?></h4>
				</div>
				</a><!--
		--></div><!--
	--><a href="<?php echo get_permalink( $art['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['0']->ID ), 'thumbnail' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $art['0']->post_title; ?></h4>
		</div></a><!--
		--><div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink( $art['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['3']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $art['3']->post_title; ?></h4>
				</div>
				</a><!--
			--><div class="subhentry hentry options">
				<h3>Art</h3>
				<a href="<?php echo home_url() ?>/?cat=304">More</a>
				</div></div>
			</div><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $art['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['4']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $art['4']->post_title; ?></h4>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $art['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $art['5']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $art['5']->post_title; ?></h4>
				</div>
				</a><!--
		--></div>
	</section><section class="introducing main">
		<?php $i=0; 
		$args = array( 'numberposts' => 6,'category' => 2215 );
	    $intro = get_posts( $args );
	    foreach($intro as $entry) {
	    	$idtally[] = $entry->ID;
	    }; 
	    ?>
			<div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $intro['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['1']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $intro['1']->post_title; ?></h4>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $intro['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['2']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $intro['2']->post_title; ?></h4>
				</div>
				</a><!--
		--></div><!--
		--><div class="hentry column header"><div><!--
			--><div class="subhentry hentry options">
				<h3>Introducing</h3>
				<a href="<?php echo home_url() ?>/?cat=2215">More</a>
				</div><!--
			--><a href="<?php echo get_permalink( $intro['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['3']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $intro['3']->post_title; ?></h4>
				</div>
				</div>
				</a>
			</div><!--
	--><a href="<?php echo get_permalink( $intro['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['0']->ID ), 'thumbnail' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
			<h4><?php echo $intro['0']->post_title; ?></h4>
		</div></a><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $intro['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['4']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $intro['4']->post_title; ?></h4>
				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $intro['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $intro['5']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<h4><?php echo $intro['5']->post_title; ?></h4>
				</div>
				</a><!--
		--></div>
	</section><section class="events main">
		<?php $i=0; 
		$args = array( 'numberposts' => 2,'category' => 3791 );
	    $events = get_posts( $args ); 
	    foreach($events as $entry) {
	    	$idtally[] = $entry->ID;
	    };
	    ?>
			<!--
	--><a href="<?php echo get_permalink( $events['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $events['0']->ID ), 'thumbnail' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
			<h4><?php echo $events['0']->post_title; ?></h4>
		</div></a><!--
		--><div class="hentry tall">
				<div class="options">
				<h3>Events</h3>
				<ul>
					<li><a href="">Upcoming</a></li>
					<li><a href="">Previous</a></li>
				</ul>
				</div>
			</div><!--
	--><a href="<?php echo get_permalink( $events['1']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $events['1']->ID ), 'thumbnail' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
			<h4><?php echo $events['1']->post_title; ?></h4>
		</div></a><!--
		--></section><section id="popularSticky" class="popular"><!--
			--><div class="subhentry hentry options">
				<h3>Popular</h3>
				</div><!--
				<?php $i=0; 
					$args = array( 'numberposts' => 10,'category' => 3791 );
				    $pop = get_posts( $args ); 
				    foreach($pop as $popular) {  ?>
			--><a href="<?php echo get_permalink( $popular->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $popular->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $popular->post_title; ?></h4>
						<h5><?php
							$category = get_the_category($popular->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
				</div>
				</a>
			<!--
		<?php }; ?>
--></section><section id="archiveSticky" class="archive infinitescroll">
	<!--
		<?php $i=0; while ( have_posts() ) : the_post(); 
		if(in_array($post->ID, $idtally)) { 
		} else { 
			if($i == 4) { ?>
			--><div class="hentry options">
					<h3>Latest</h3>
				</div><div class="hentry spacer"></div><!--
			<?php } ?>
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
		<?php }; $i++; endwhile; ?>
--></section>
<?php get_template_part( 'nav', 'below' ); ?>

<?php get_footer(); ?>