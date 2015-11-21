--><div class="subhentry hentry <?php if($large == true) { echo 'wide tall'; } ?>">
		<a href="<?php echo $permalink; ?>">
			<img class="lazy" data-original="<?php echo $image[0]; ?>" src="http://www.crackintheroad.com/wp-content/themes/CITR/assets/img/blank.png" />
			<div class="table-box">
				<div class="table-cell">
					<?php 
						if(strlen($posttitle) >= 50) { 
							echo '<h4 class="small">' . $posttitle . '</h4>'; 
						} else { 
							echo '<h4>' . $posttitle . '</h4>'; 
						}; 
						if($variant == 'archive'){ ?>
							<h5><?php
							$category = get_the_category();
							if ($category) {
							  echo $category[0]->name;
							}
							?>
						</h5>	
					<?php } ?>
				</div>
			</div>
		</a>
	</div><!--