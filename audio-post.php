<div id="post-audio">
<ul>
<?php $trackList = get_post_meta($post->ID, 'tracks', true);
if(count($trackList) > 0 && is_array($trackList)) { 
	if(count($trackList) > 1)  {
		echo '<li><a href="#" class="noajax post-audio-play-all" onclick="if ( event.preventDefault ) event.preventDefault(); event.returnValue = false; addAll(); "><i class="icon-play"></i>All</a></li>';
	}
	foreach($trackList as $track){
		echo '<li><a href="#" class="noajax post-audio-track" onclick="if ( event.preventDefault ) event.preventDefault(); event.returnValue = false; addTrack(this);" data-artist="'. $track['artist'] . '" data-title="' . $track['title'] . '" data-url="' . $track['url'] . '"><i class="icon-play"></i>' . $track['artist'] . ' - ' . $track['title'] . '</a></li>';
	}
}
?>
</ul>
</div>