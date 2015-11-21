<footer class="entry-footer">
<?php echo get_avatar(get_the_author_meta( 'ID' )) ?><br />
<span class="auth-links">By <?php the_author() ?></span><br />
<?php 
$oneweek = 7 * 86400;
$onemonth = 28 * 86400;
$oneyear = 365 * 86400;
$post_age = date('U') - mysql2date('U', $post->post_date_gmt);
if($post_age < $oneweek) { ?>
	<span class="date-links">on <?php the_date('l') ?></span><br />
<?php } elseif ($post_age < $onemonth) { ?>
	<span class="date-links">on <?php the_date('l jS') ?></span><br />
<?php } elseif ($post_age < $oneyear) { ?>
	<span class="date-links">on <?php the_date('jS F') ?></span><br />
<?php } else { ?>
	<span class="date-links">on <?php the_date('jS M Y') ?></span><br />
<?php }; ?>
<span class="cat-links">in 
<?php
	$category = get_the_category();
	if ($category) {
	  echo '<a href="' . get_category_link( $category[0]->term_id ) . '" title="' . sprintf( __( "View all posts in %s" ), $category[0]->name ) . '" ' . '>' . $category[0]->name.'</a> ';
	}
	?>
</span>
</footer> 