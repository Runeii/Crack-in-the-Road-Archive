<?php get_header(); ?>
<section class="cat main">
		<?php $i=0; 
		$category = get_category( get_query_var( 'cat' ) );
    		$cat_id = $category->cat_ID;
		$args = array( 'numberposts' => 6,'category' => $cat_id );
	    	$category = get_posts( $args ); 
	   	 foreach($category as $entry) {
	    	$idtally[] = $entry->ID;
	    };
	    ?>
			<div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink( $category['1']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $category['1']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $category['1']->post_title; ?></h4>
						<h5><?php
							$cat = get_the_category($category['1']->ID);
							if ($cat) {
							  echo $cat[0]->name;
							}
							?>
						</h5>	
					</div></div>
				</div>
				</a><!--
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
						<h3><?php single_cat_title(); ?></h3>
						<a href="<?php echo home_url() ?>">Return home</a>
				</div></div>
				</div>
			</div>
			</div><!--
		--><div class="hentry column"><!--
			--><a href="<?php echo get_permalink( $category['2']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $category['2']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $category['2']->post_title; ?></h4>
						<h5><?php
							$cat = get_the_category($category['2']->ID);
							if ($cat) {
							  echo $cat[0]->name;
							}
							?>
						</h5>	
					</div></div>				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $category['3']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $category['3']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $category['3']->post_title; ?></h4>
						<h5><?php
							$cat = get_the_category($category['3']->ID);
							if ($cat) {
							  echo $cat[0]->name;
							}
							?>
						</h5>	
					</div></div>				</div>
				</a><!--
		--></div><!--
	--><a href="<?php echo get_permalink( $category['0']->ID ); ?>"><div class="hentry wide tall">
		<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $category['0']->ID ), 'thumbnail' ); ?>
			<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $category['0']->post_title; ?></h4>
						<h5><?php
							$cat = get_the_category($category['0']->ID);
							if ($cat) {
							  echo $cat[0]->name;
							}
							?>
						</h5>	
					</div></div>		</div></a><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink( $category['4']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $category['4']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $category['4']->post_title; ?></h4>
						<h5><?php
							$cat = get_the_category($category['4']->ID);
							if ($cat) {
							  echo $cat[0]->name;
							}
							?>
						</h5>	
					</div></div>				</div>
				</a><!--
			--><a href="<?php echo get_permalink( $category['5']->ID ); ?>"><div class="subhentry hentry">
					<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $category['5']->ID ), 'thumbnail' ); ?>
					<img class="lazy-load" data-src="<?php echo $image[0]; ?>" src="./wp-content/themes/CITR Forever/assets/img/blank.png" />
					<div class="table-box"><div class="table-cell">
						<h4><?php echo $category['5']->post_title; ?></h4>
						<h5><?php
							$cat = get_the_category($category['5']->ID);
							if ($cat) {
							  echo $cat[0]->name;
							}
							?>
						</h5>	
					</div></div>				</div>
				</a><!--
		--></div>
	</section><section id="popularSticky" class="popular"><!--
			--><div class="subhentry hentry options">
				<h3>Highlights</h3>
				</div><!--
				<?php $i=0; 
					$args = array( 
						'numberposts' => 10,
						'category' => $cat_id, 
						'post__in' => get_option('sticky_posts'),
						'caller_get_posts' => 1
 					);
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
--></section><section id="archiveSticky" class="archive infinitescroll"><!--
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
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
<?php $i++; endwhile; endif; ?>
--></section>
<?php get_template_part( 'nav', 'below' ); ?>
<?php get_footer(); ?>