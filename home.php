<?php get_header(); ?>
<section class="new main">
	<?php $i=0; 
		$args = array( 'numberposts' => 6,'category' => 2269 );
	    $music = get_posts( $args ); 
	    $idtally = array();
	    foreach($music as $entry) {
	    	$idtally[] = $entry->ID;
	    	if($i == 5) { break; };
	    	$i++;
	    };
	    ?>
			<div class="hentry column header"><div><!--
					<?php	buildEntry($music['1']); ?>
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
				<h3>New</h3>
				<a href="<?php echo home_url() ?>/?cat=2269">More</a>
				</div></div>
			</div>
			</div>
			</div><!--
		--><div class="hentry column"><!--
					<?php	buildEntry($music['2']); ?>
			--><!--
					<?php	buildEntry($music['3']); ?>
			--></div><!--
					<?php	buildEntry($music['0'], true); ?>
			--><div class="hentry column smallscreen"><!--
					<?php	buildEntry($music['4']); ?>
			--><!--
					<?php	buildEntry($music['5']); ?>
			--></div>
	</section><section class="introducing main">
		<?php $i=0; 
		$args = array( 'numberposts' => 6,'category' => 2215 );
	    $art = get_posts( $args ); 
	    foreach($art as $entry) {
	    	$idtally[] = $entry->ID;
	    	if($i == 5) { break; };
	    	$i++;
	    };
	    ?>
			<div class="hentry column"><!--
					<?php	buildEntry($art['1']); ?>
			--><!--
					<?php	buildEntry($art['2']); ?>
			--></div><!--
					<?php	buildEntry($art['0'], true); ?>
			--><div class="hentry column header"><div><!--
					<?php	buildEntry($art['3']); ?>
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
				<h3>Introducing</h3>
				<a href="<?php echo home_url() ?>/?cat=2215">More</a>
				</div></div>
				</div>
				</div>
			</div><!--
		--><div class="hentry column smallscreen"><!--
					<?php	buildEntry($art['4']); ?>
			--><!--
					<?php	buildEntry($art['5']); ?>
			--></div>
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
					<?php	buildEntry($popular['1']); ?>
			--><!--
					<?php	buildEntry($popular['2']); ?>
			--></div><!--
		--><div class="hentry column header"><!--
			--><div class="subhentry hentry options">
				<div class="table-box"><div class="table-cell">
					<h3>Popular today</h3>
				</div></div>
				</div><!--
					<?php	buildEntry($popular['3']); ?>
			--></div><!--
					<?php	buildEntry($popular['0'], true); ?>
			--><div class="hentry column smallscreen"><!--
					<?php	buildEntry($popular['4']); ?>
			--><!--
					<?php	buildEntry($popular['5']); ?>
			--></div>
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
										buildEntry($featured);
									}						 
							}; ?>
--></section><section id="archiveSticky" class="archive infinitescroll">
	<!--
		<?php 
		$i=0; 
		rewind_posts();
		while ( have_posts() ) : the_post(); 
		if(in_array($post->ID, $idtally)) { 
		} else { buildEntry($post, false, 'archive');  }; $i++; endwhile; ?>
--></section>
<?php get_template_part( 'nav', 'below' ); ?>

<?php get_footer(); ?>