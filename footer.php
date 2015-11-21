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
<div id="pageTitle"></div>
<div id="permalink">
<?php 
  $current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
 echo $current_url;?></div>
<?php wp_footer(); ?>
<?php if(is_home() || is_category() || is_search() || is_author() ) { ?>
<!--<div id="disqus_thread" style="display:none"></div>

<script type="text/javascript">
/* <![CDATA[ */
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'crackintheroad'; // Required - Replace example with your forum shortname

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
/* ]]> */    })();

</script>
-->
<?php
} ?>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-17970339-3', 'crackintheroad.com');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');

</script>
</body>

</html>