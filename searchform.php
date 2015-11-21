<form id="header-search" role="search" method="get" class="search-form" action="<?php echo home_url( '/' ); ?>">
	<label>
		<i class="icon-search"></i>
		<input id="searchForm" type="search" class="search-field" placeholder="Type and press enter to search" value="" name="s" title="Search for:" onkeypress="return submitSearch(event);" />
	</label>
</form>