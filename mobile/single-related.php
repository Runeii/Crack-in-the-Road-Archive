<section id="mobile-related" class="free">
	<div class="header"><h4><span class="related">Related</span> / <span class="popular"><?php echo $category[0]->name; ?></span></h4></div>
	<div class="content">
		<section class="related main">
			<ul>
				<?php	
			   	foreach($related as $entry) {
			   		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $entry->ID ), 'mobile-micro' );
					echo '<li class="entry"><a href="'. get_permalink($entry->ID) . '"><img class="mobile-micro" src="'. $image[0] .'" alt="'. $entry->post_title .'" />';
					echo '<div>' . $entry->post_title . '</div>'; 
					echo '</a></li>';
			    };
			    ?>
			</ul>
		</section><section class="morecategory main">
			<ul>
				<?php	
			   	foreach($morecategory as $entry) {
			   		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $entry->ID ), 'mobile-micro' );
					echo '<li class="entry"><a href="'. get_permalink($entry->ID) . '"><img class="mobile-micro" src="'. $image[0] .'" alt="'. $entry->post_title .'" />';
					echo '<div>' . $entry->post_title . '</div>'; 
					echo '</a></li>';
			    };
			    ?>
			</ul>
		</section>
	</div>
</section>