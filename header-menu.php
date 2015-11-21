<div id="hamburger" class="hamburglar is-open">

    <div class="burger-icon">
      <div class="burger-container">
        <span class="burger-bun-top"></span>
        <span class="burger-filling"></span>
        <span class="burger-bun-bot"></span>
      </div>
    </div>
    
    <!-- svg ring containter -->
    <div class="burger-ring">
      <svg class="svg-ring">
	      <path class="path" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="4" d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2" />
      </svg>
    </div>
    <!-- the masked path that animates the fill to the ring -->
    
 		<svg width="0" height="0">
       <mask id="mask">
    <path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff0000" stroke-miterlimit="10" stroke-width="4" d="M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4" />
       </mask>
     </svg>
    <div class="path-burger">
      <div class="animate-path">
        <div class="path-rotation"></div>
      </div>
    </div>
      
  </div>

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