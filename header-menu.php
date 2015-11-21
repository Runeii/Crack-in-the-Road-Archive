
<header id="header" class="site-header" role="banner">
<nav class="title">
    <ul>
            <li id="mobile-menu"><a href="#" class="noajax" onclick="toggleMenu(event); return false;"><i class="icon-menu"></i></a></li>
    	<li><a href="<?php echo home_url() ?>" class="sitetitle">CRACK IN THE ROAD</a></li>
    	<li id="standard-menu">
    			<?php get_search_form(); ?>
    		<a href="#" class="noajax" onclick="toggleMenu(event); return false;"><i class="icon-menu"></i></a>
	    		<nav id="header-navigation" class="navigation" role="navigation">
				    <ul>
				    	<li><a href="<?php echo home_url() ?>">Home</a></li>
				    	<li><a href="<?php echo home_url() ?>">Store</a></li>
				    	<li><a href="<?php echo home_url() ?>">Events</a></li>
				    	<li><a href="<?php echo home_url() ?>">People</a></li>
				    	<li><a href="<?php echo home_url() ?>">About</a></li>
				    </ul>
				</nav>
			<div id="player">
				<ul>
	            	<li><a href="#" class="noajax" onclick="togglePlayer(); return false; event.preventDefault()"><i class="icon-headphones"></i></a></li>
	            	<li><a href="#" class="noajax" onclick="togglePause(); return false; event.preventDefault()"><i id="play" class="icon-play"></i></a></li>
	            	<li><a href="#" class="noajax" onclick="changeTrack(-1); return false; event.preventDefault()"><i class="icon-to-start"></i></a></li>
	            	<li><a href="#" class="noajax" onclick="changeTrack(1); return false; event.preventDefault()"><i class="icon-to-end"></i></a></li>
	            	<li id="trackStatus">No tracks selected</li>
	            </ul>
        	</div>
    		<a href="#" class="noajax" onclick="closeMenus(); return false;"><i class="icon-cancel-circled"></i></a>
    	</li>
    </ul>
</nav>
</header>