<div class="clear"></div>
<?php if(is_search()){ ?>
<div id="ajaxRef"><?php echo get_search_query() ?></div>
<?php } else if(is_category()){ ?>
<div id="ajaxRef"><?php echo get_query_var('cat'); ?></div>
<?php } else if(is_author()){ ?>
<div id="ajaxRef"><?php echo get_query_var('author'); ?></div>
<?php }
?>
</div>
<footer id="footer" role="contentinfo">
<div id="copyright">
<?php echo '&copy; ' . '2010 - ' . date( 'Y' ) . ' Crack in the Road'; ?><br />
This bit don't mean shit
</div>
</footer>
</div>
<div id="audioIndicator"></div>
<?php wp_footer(); ?>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-17970339-3', 'crackintheroad.com');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');
	<?php
  if(is_single()) { ?>
  ga('send', 'event', 'Written', 'read', '<?php echo $post->ID; ?>');
  <?php } ?>
</script>
</body>

</html>