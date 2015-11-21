<section class="home">
<section class="related main">
			<div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink($related['1']->ID); ?>"><div class="subhentry hentry">
				<?php 
				$posttitle = $related['1']->post_title;
				$image = wp_get_attachment_image_src( get_post_thumbnail_id( $related['1']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($related['1']->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
			--><div class="subhentry hentry options">
					<div class="table-box"><div class="table-cell">
						<h3>Recent</h3>
					</div></div>
						</div>
			</div>
			</div><!--
		--><div class="hentry column"><!--
			--><a href="<?php echo get_permalink($related['2']->ID); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $related['2']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					$posttitle = $related['2']->post_title;
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($related['2']->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
			--><a href="<?php echo get_permalink($related['3']->ID); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $related['3']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					$posttitle = $related['3']->post_title;
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($related['3']->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
		--></div><!--
	--><a href="<?php echo get_permalink($related['0']->ID); ?>"><div class="hentry wide tall">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $related['0']->ID ), 'home-large' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					$posttitle = $related['0']->post_title;
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($related['0']->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
		--><div class="hentry column smallscreen"><!--
		--><a href="<?php echo get_permalink($related['4']->ID); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $related['4']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					$posttitle = $related['4']->post_title;
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($related['4']->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
			--><a href="<?php echo get_permalink($related['5']->ID); ?>"><div class="subhentry hentry">
				<?php $image = wp_get_attachment_image_src( get_post_thumbnail_id( $related['5']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					$posttitle = $related['5']->post_title;
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						} 
						?>
						<h5><?php
							$category = get_the_category($related['5']->ID);
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					</div></div>
			</div></a><!--
		--></div>
	</section><section class="morecategory main">
			<div class="hentry column"><!--
			--><a href="<?php echo get_permalink($morecategory['1']->ID); ?>"><div class="subhentry hentry">
				<?php 
					$posttitle = $morecategory['1']->post_title;
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $morecategory['1']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
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
			--><a href="<?php echo get_permalink($morecategory['2']->ID); ?>"><div class="subhentry hentry">
				<?php 
					$posttitle = $morecategory['2']->post_title;
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $morecategory['2']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
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
		--></div><!--
		--><div class="hentry column smallscreen"><!--
			--><a href="<?php echo get_permalink($morecategory['3']->ID); ?>"><div class="subhentry hentry">
				<?php 
					$posttitle = $morecategory['3']->post_title;
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $morecategory['3']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
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
			--><a href="<?php echo get_permalink($morecategory['4']->ID); ?>"><div class="subhentry hentry">
				<?php 
					$posttitle = $morecategory['4']->post_title;
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $morecategory['4']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
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
	--></div><div class="hentry column header"><div><!--
			--><a href="<?php echo get_permalink($morecategory['5']->ID); ?>"><div class="subhentry hentry">
				<?php 
					$posttitle = $morecategory['5']->post_title;
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $morecategory['5']->ID ), 'home-small' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
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
		 --><div class="subhentry hentry options">
					<div class="table-box"><div class="table-cell">
					<h3>Elsewhere in <?php echo $category[0]->name; ?></h3>
					</div></div>
			</div><!--
		--></div></div><a href="<?php echo get_permalink($morecategory['0']->ID); ?>"><div class="subhentry hentry wide tall">
				<?php 
					$posttitle = $morecategory['0']->post_title;
					$image = wp_get_attachment_image_src( get_post_thumbnail_id( $morecategory['0']->ID ), 'home-large' ); ?>
					<img class="lazy" data-original="<?php echo $image[0]; ?>" data-thumb="<?php echo $image[0]; ?>" src="/wp-content/themes/CITRForever/assets/img/blank.png"  alt="<?php echo $posttitle; ?>"/>
					<div class="table-box"><div class="table-cell">
					<?php 
					if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
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
		--></section>
</section>