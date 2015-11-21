
/*jshint smarttabs:true */

// Cache non-dynamic elements and set variables here. Trickle down in to functions, saves repeated caching
/* PRODUCTION VARIABLES*/
siteURL = document.domain;
//siteURL = 'citrdev:8888';
currentPermalink = window.location.href;

//Status of scroll states
changeState = true;
coverOn = true;
poppedState = false;
stickyState = false;
stickyOn = false;
infiniteScrollState = false;
window.playing = false;
round = 0;
// Ajax variables
pageNumber = 2;
processingAjax = false;
pageProgressing = false;

//History variables
newState = false;
domParseSupport = false;
  
//Mobile variables
relatedPane = null;
relatedState = true;

body = document.body;

_docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
window.windowHeight = window.innerHeight;
window.windowWidth = window.innerWidth;
wrapper = document.getElementById("wrapper");
cover = document.getElementById("cover");
//Without an easy 'ready' event, we'll just set a variable that prevents repeat runs
if(typeof domReadyOnce === 'undefined') {
    mobileWidth = 645;
    bodyMin = 0;
    resize();
    startLazyLoader();
    startPjax();
    domReadyOnce = true;
} 

if(document.getElementById("featuredSticky")) {
    stickyOn = true;
    popular = document.getElementById("featuredSticky");
    archives = document.getElementById("archiveSticky");
    archiveOffset = archives.offsetTop;   
}
if(document.querySelector('.infinitescroll') && document.querySelector('.pagination') ) {
    infiniteScrollState = true;
} 


//Window resize actions
window.onresize = function() {
    resize();
};
window.onscroll = function (event) {
    if(pageProgressing == false) {
        if(coverOn === true && stickyOn === true){
            moveCoverSticky();
        } else if (coverOn === true && stickyOn === false){
            moveCover();
        }
        if(relatedPane !== null) {
            captureRelease();
        }
    }
};

function startLazyLoader() {
	jQuery("img.lazy").lazyload({
    effect : "fadeIn"
});
	if(jQuery('#featuredSticky').length) {
		jQuery("img.lazy").lazyload({
			 container: jQuery("#featuredSticky")
		});
	}
}

// Ajax load
function startPjax() {
new Pjax({ 
    elements: "a:not(.noajax)",
    selectors: ["title", "#cover", "#container", "body"],
    analytics: navigationAnalytics,
    debug: false,
    switches: {
        "#container": function(oldEl, newEl) {
            oldEl.outerHTML = newEl.outerHTML;
            this.onSwitch();
        },
        "#cover": function(oldEl, newEl) {
            oldEl.classList.remove('loaded');
            oldEl.classList.add('frozen');
            if(!newEl.classList.contains('disabled')){
								if(newEl.hasAttribute("data-thumb")) {
                	oldEl.style.backgroundImage = "url('" + newEl.getAttribute('data-thumb') + "')";
								} else if (newEl.hasAttribute("data-original")) {
                	oldEl.style.backgroundImage = "url('" + newEl.getAttribute('data-original') + "')";
								}
                oldEl.setAttribute('data-highRes', newEl.style.backgroundImage.slice(4, -1));
                oldEl.classList.remove('disabled');
            } else {
                oldEl.classList.add('disabled');
            }
            oldEl.querySelector('#pageDesc').innerHTML = newEl.querySelector('#pageDesc').innerHTML;
            this.onSwitch();
        },
        "body": function(oldEl, newEl) {
            oldEl.className = newEl.className;
            this.onSwitch();
        }
    }
});
}

document.addEventListener("pjax:send", function() {        
        if(stickyOn === true) {
            popular.classList.remove('stuck');
            archives.classList.remove('stuck'); 
        }
        pageProgressing = true;
        if(!cover.classList.contains('disabled')){
            cover.style.visibility = 'visible';
        }
        scrollTo(document.body, 0, 500); 
        currentPermalink = window.location.href;
})  

document.addEventListener("pjax:complete", function(element) {    
    reset();
    loadHighResCover();
    cover.classList.remove('frozen');
});

function navigationAnalytics(){
            ga('send', 'pageview', {'page': currentPermalink,'title': document.title});
}

function getBgUrl(el) {
    var bg = "";
    if (el.currentStyle) { // IE
        bg = el.currentStyle.backgroundImage;
    } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
        bg = document.defaultView.getComputedStyle(el, "").backgroundImage;
    } else { // try and get inline style
        bg = el.style.backgroundImage;
    }
    return bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
}

//Functions
function resize()
{
        var s = window.pageYOffset;
        window.windowHeight = window.innerHeight;
        window.windowWidth = window.innerWidth;
        if(document.getElementById("featuredSticky")) {
            if(typeof archives === 'undefined') { 
                popular = document.getElementById("featuredSticky");
                archives = document.getElementById("archiveSticky");
                stickyOn = true;
            }
            window.archiveOffset = archives.offsetTop;   
        }
        if (window.windowWidth >= mobileWidth && !cover.classList.contains('disabled')) { 
            // Cover setup //
            //Only enable coverFocus immediately if we're at the top
            if(s < window.windowHeight) {
                body.classList.add('coverFocus');
            }
            wrapper.style.minHeight = window.windowHeight + 'px';
            body.classList.add('coverActive');
            bodyMin = ((window.windowHeight + wrapper.offsetHeight) > (window.windowHeight * 2)) ? (window.windowHeight + wrapper.offsetHeight) + 'px' : (window.windowHeight * 2) + 'px';
            if(body.classList.contains('coverFocus')) {
                /// Add something to catch exception: if below 2 * windowHeight
                body.style.minHeight = bodyMin;
            }
            // Cover size        
            cover.style.height = window.windowHeight + "px";
            coverOn = true;

        } else {
            mobileResize();
        }
}

function infiniteScroll() { 
    if(processingAjax !== true) { 
        processingAjax = true;
        // 1. fetch data from the server
        var posthttp;
        var params;
        var classList = body.classList;
        
        if(classList.contains('search')) {
            params = 'action=infinite_scroll&type=search&query=' + document.getElementById('ajaxRef').innerHTML +'&page_no=' + pageNumber + '&t=' + Math.random();
        } 
        else if(classList.contains('category')) {
            params = 'action=infinite_scroll&type=cat&query=' + document.getElementById('ajaxRef').innerHTML +'&page_no=' + pageNumber + '&t=' + Math.random();
        }
        else if(classList.contains('author')) {
            params = 'action=infinite_scroll&type=auth&query=' + document.getElementById('ajaxRef').innerHTML +'&page_no=' + pageNumber + '&t=' + Math.random();
        } else { 
            params = 'action=infinite_scroll&type=other&page_no=' + pageNumber + '&t=' + Math.random();
        } 
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            posthttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            posthttp=new ActiveXObject("Microsoft.XMLHTTP");
        }  
        posthttp.open("POST",'http://' + siteURL + '/wp-admin/admin-ajax.php', true);

        posthttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        posthttp.onreadystatechange=function(data)
        {
            if (posthttp.readyState==4 && posthttp.status==200)
            {      
                // 2. insert it into the document
                document.querySelector('.infinitescroll').innerHTML += '<!--' + posthttp.responseText; 
                // 3. call done when we are done
                console.log('Loaded page ' + pageNumber);
                pageNumber++;
                processingAjax = false;
                startLazyLoader();
                startPjax();
                pageProgressing = false;
            }  
        };
        posthttp.send(params);
    } else {
        console.log("Caught: Ajax is currently being processed. Ignoring request to prevent duplicates");
    }
}

function moveCoverSticky() {
    var s = window.pageYOffset;

    if(s >= window.windowHeight && changeState === true) {
        body.classList.remove('coverFocus');
        body.style.minHeight = 'initial';
        changeState = false;
    } else if(s <= window.windowHeight && changeState === false) {
        body.classList.add('coverFocus');
        body.style.minHeight = bodyMin;
        changeState = true;
    }

    if(s >= (archiveOffset + window.windowHeight) && stickyState === false) {
        popular.classList.add('stuck');
        archives.classList.add('stuck');
        stickyState = true;
    } else if (s <= (archiveOffset + window.windowHeight) && stickyState === true) {
        popular.classList.remove('stuck');
        archives.classList.remove('stuck');
        stickyState = false;
    }
    if(infiniteScrollState === true && pageProgressing === false) {
        if((s + window.windowHeight) >= document.querySelector('.pagination').offsetTop) {
            infiniteScroll();
        }
    }
}

function moveCover() {
        var s = window.pageYOffset;

        if(s >= window.windowHeight && changeState === true) {
            body.classList.remove('coverFocus');
            body.style.minHeight = 'initial';
            changeState = false;
        } else if(s <= window.windowHeight && changeState === false) {
            body.classList.add('coverFocus');
            body.style.minHeight = bodyMin;
            changeState = true;
        }
    if(infiniteScrollState === true) {
        if((s + window.windowHeight) >= document.querySelector('.pagination').offsetTop) {
            infiniteScroll();
        }
    }
}

function toggleMenu (e) { 
    if (window.windowWidth <= mobileWidth) { 
        document.getElementById('header-navigation').classList.toggle('open-mobile');
    } else {
        body.classList.toggle("menuopen");
        body.classList.remove("playeropen");
    }
}

function togglePlayer () { 
    body.classList.toggle("playeropen");
    body.classList.remove("menuopen");
}

function closeMenus() {
    body.classList.remove("playeropen");
    body.classList.remove("menuopen");
    event.preventDefault;
    return false;   
}

function submitSearch(e) {
    if(e.keyCode == 13 || e.which == 13) {            
        var ajaxCallback = function() {
            var link = 'http://' + siteURL + '/?s=' + document.getElementById('searchForm').value;
            newState = true;
            nextStage(link);
        };
        scrollTo(document.body, 0, 500, ajaxCallback); 
    }
}

/* Ajax links 

function nextStage(link) {
    body.classList.remove('loaded');
    
    if(stickyOn === true) {
        popular.classList.remove('stuck');
        archives.classList.remove('stuck');    
    }

    var xmlhttp;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }  
    xmlhttp.open("GET",link,true);
    xmlhttp.onreadystatechange=function(data)
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            // do something on ajax success
            //scrollTo(document.documentElement, 0, 100); 
            parser = new DOMParser();
            doc = parser.parseFromString(xmlhttp.responseText, "text/html");
            newCover = doc.getElementById('cover');
            if(newCover.classList.contains('disabled') ) {
                cover.classList.add('disabled');
                cover.style.backgroundImage = '';
            } else {
                cover.classList.remove('disabled');
                bgImg = new Image();
                coverSrc = newCover.style.backgroundImage;
                coverSrc = coverSrc.substr(4, coverSrc.length-5);
                bgImg.src = coverSrc;
                bgImg.onload = imageSwap();
            }
            pageNumber = 2;
            containerHtml = doc.getElementById('container').innerHTML;
            document.getElementById('coverTitle').innerHTML = doc.getElementById('coverTitle').innerHTML;
            classList = doc.body.classList;
            if(classList.contains('single')) {
                body.classList.add('single');
                body.classList.remove('home');
                body.classList.remove('category');
                body.classList.remove('author');
            } else if(classList.contains('home')) {
                body.classList.remove('single');
                body.classList.add('home');
                body.classList.remove('author');
                body.classList.remove('category');
            } else if(classList.contains('category')) {
                body.classList.remove('single');
                body.classList.add('category');
                body.classList.remove('author');
                body.classList.remove('home');
            } else if(classList.contains('author')) {
                body.classList.remove('single');
                body.classList.remove('category');
                body.classList.remove('home');
                body.classList.add('author');
            }
            reset();
            resize();
        }
    };
    xmlhttp.send();
}

function imageSwap() {
    cover.style.backgroundImage = 'url(' + bgImg.getAttribute('src') + ')';
}
*/
function reset() {
    processingAjax = false;
    cover = document.getElementById('cover');
    classList = document.body.classList;
    if(document.getElementById("featuredSticky")) {
        popular = document.getElementById("featuredSticky");
        archives = document.getElementById("archiveSticky");
        stickyOn = true;
        window.archiveOffset = archives.offsetTop;   
    } else {
        stickyOn = false;
    }
    if(document.querySelector('.infinitescroll')) {
        infiniteScrollState = true;
    } else {
        infiniteScrollState = false;
    }
    if (window.windowWidth >= mobileWidth && !cover.classList.contains('disabled')) { 
        // Cover setup //
        body.classList.add('coverFocus');
        wrapper.style.minHeight = window.windowHeight + 'px';
        body.classList.add('coverActive');
        bodyMin = ((window.windowHeight + wrapper.offsetHeight) > (window.windowHeight * 2)) ? (window.windowHeight + wrapper.offsetHeight) + 'px' : (window.windowHeight * 2) + 'px';
        if(body.classList.contains('coverFocus')) {
            /// Add something to catch exception: if below 2 * windowHeight
            body.style.minHeight = bodyMin;
        }
        // Cover size        
        cover.style.height = window.windowHeight + "px";
        coverOn = true;

    } else {
        mobileResize();
    }
    startLazyLoader();
    pageProgressing = false;
}

function scrollTo(element, to, duration, ajaxCallback) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        document.body.scrollTop = document.documentElement.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
        else {
            // ajaxCallback();
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

function loadHighResCover() {
        var big_image = new Image();
        var highRes = cover.getAttribute('data-highRes');
        big_image.onload = function () {
            cover.style.backgroundImage = 'url("' + highRes + '")';
            round++;
            console.log(round);
        }
        big_image.src = highRes;
}

/////////////////////////////
// Audio player starts here
////////////////////////////

audioPlaylist = [];
playlistID = 0;

function playAudio() { 
    playlistID = playlistID ? playlistID : 0;
    // If SoundManager object exists, get rid of it...
    if (window.playing === true){
        soundManager.getSoundById('audioplayer').destruct();
        // ...and reset array key if end reached
        if(playlistID == audioPlaylist.length){
            playlistID = 0;
        }
    }
    // Standard Sound Manager play sound function...
    soundManager.onready(function() {
        soundManager.createSound({
            id: 'audioplayer',
            url: audioPlaylist[playlistID].url,
            type: audioPlaylist[playlistID].type,
            flashVersion: 9,
            preferFlash: false,
            autoLoad: true,
            autoPlay: true,
            volume: 50,
            // ...with a recursive callback when play completes
            onplay: function() {
                window.playing = true;
                document.getElementById('play').classList.add('playing');
                document.getElementById('trackStatus').innerHTML = '<span>' + audioPlaylist[playlistID].artist + ' - ' + audioPlaylist[playlistID].title + '</span>';
                console.log('Playing ' + audioPlaylist[playlistID].artist + ' - ' + audioPlaylist[playlistID].title + '. Type: "' + audioPlaylist[playlistID].type +'" Via: "' + audioPlaylist[playlistID].url + '');
                ga('send', 'event', 'Audio', 'Play', audioPlaylist[playlistID].artist + ' - ' + audioPlaylist[playlistID].title);
            },
            onfinish: function(){
                playlistID ++;
                playAudio(playlistID);
                console.log('Playing ' + audioPlaylist[playlistID].artist + ' - ' + audioPlaylist[playlistID].title);
            }
        });
    });
}

function togglePause() {
	var track = document.querySelector('.post-audio-track');
    if(audioPlaylist.length > 0) {
        if(window.playing === true) {
            soundManager.togglePause('audioplayer');
            document.getElementById('play').classList.toggle('playing');
        } else {
            playAudio();
        }
    } else if(track !== null) {
        addAll();
    } 
    else {
	    event.preventDefault();
	    return false;
    }
}

function changeTrack(value) {
    if(audioPlaylist.length > 0) {	
	    playlistID = playlistID + value;
	    playAudio(playlistID);
	}
}

function addTrack(el){
    var artist = el.dataset.artist;
    var title = el.dataset.title; 
    var url = el.dataset.url;
    if(url.indexOf("soundcloud.com") != -1 || url.indexOf("//www.soundcloud.com") != -1) {
        sanitiseSoundcloud(artist, title, url);
    } else if(url.indexOf("bandcamp.com") != -1) {
        sanitiseBandcamp(artist, title, url);
    }else {
        audioPlaylist.push({'artist': artist, 'title': title, 'url' : url, 'type': 'audio/mp3' }); 
        updateAudioDisplay();  
    }
    notifyUser('1 track added');
    trackActive();
}

function addAll(){
    var tracks = document.querySelectorAll('.post-audio-track');
    for(index=0; index < tracks.length; ++index) { 
        addTrack(tracks[index]);
    }
    console.log(tracks.length);
    if(tracks.length == 1) {
    	notifyUser('1 track added');
    } else {
    	notifyUser(tracks.length + ' tracks added');
    }
    trackActive();
}

function trackActive(){
    var tracks = document.querySelectorAll('.post-audio-track');
    for(index=0; index < tracks.length; ++index) { 
        tracks[index].classList.add('used');
    }
}

function updateAudioDisplay() {
    if(document.getElementById('trackStatus').innerHTML == 'No tracks selected') {
        document.getElementById('trackStatus').innerHTML = audioPlaylist[0].artist + ' - ' + audioPlaylist[0].title;
        playAudio();       
    }
}
function sanitiseSoundcloud(artist, title, url, type) {

    var client_id = "543a39f54bd63a00779211590a0f96a8";


    var scGet;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        scGet=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        scGet=new ActiveXObject("Microsoft.XMLHTTP");
    }  
    scGet.open("GET",'http://api.soundcloud.com/resolve.json?url=' + url + '&client_id=' + client_id);

    scGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    scGet.onreadystatechange=function(data)
    {
        if (scGet.readyState==4 && scGet.status==200)
        {   
            response = JSON.parse(scGet.responseText);
            console.log('SC sent: ' + response.stream_url);
            audioPlaylist.push({'artist': artist, 'title': title, 'url' : response.stream_url + '.json?&client_id=' + client_id, 'type': 'audio/mp3' }); 
            updateAudioDisplay();
        }  
    };
    scGet.send();
}
function sanitiseBandcamp(artist, title, url, type) {

    var client_id = "fridanraklendraraedislitill";

    var bcGet;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        bcGet=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        bcGet=new ActiveXObject("Microsoft.XMLHTTP");
    }  
    freshURL = encodeURIComponent('http://api.bandcamp.com/api/url/1/info?key=' + client_id + '&url=' + url);
    bcGet.open("GET", 'http://' + siteURL + '/wp-content/themes/CITRForever/assets/js/proxy.php?url=' + freshURL);

    bcGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    bcGet.setRequestHeader("Access-Control-Allow-Origin", "http://www.crackintheroad.com");

    bcGet.onreadystatechange=function(data)
    {
        if (bcGet.readyState==4 && bcGet.status==200)
        {   
                response = JSON.parse(bcGet.responseText);
                
                trackId = JSON.stringify(response.contents.track_id);

                freshURL = encodeURIComponent('http://api.bandcamp.com/api/track/3/info?key=' + client_id + '&track_id=' + trackId);

                url = 'http://' + siteURL + '/wp-content/themes/CITRForever/assets/js/proxy.php?url=' + freshURL;
                
                bcGet.open("GET", url);

                bcGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                bcGet.onreadystatechange=function(data)
                {
                    if (bcGet.readyState==4 && bcGet.status==200)
                    {   
                        response = JSON.parse(bcGet.responseText);
                        streamUrl = response.contents.streaming_url;
                        console.log('BC sent stream: ' + streamUrl);
                        audioPlaylist.push({'artist': artist, 'title': title, 'url' : streamUrl, 'type': 'audio/mp3' }); 
                        updateAudioDisplay();
                    }  
                };
                bcGet.send();

        }  
    };
    bcGet.send();
}
function notifyUser(note){
	indicator = document.getElementById('audioIndicator');
	indicator.innerHTML = note + ' <i class="icon-plus"></i>';
	indicator.classList.add('notify');
	indicator.addEventListener('webkitAnimationEnd', function(){
	    this.classList.remove('notify');
	});
}

////////////////
//// Mobile /////
function mobileSearch() {
    if (window.windowWidth <= mobileWidth) { 
        document.getElementById('header-search').classList.toggle('open-mobile');
    }
}

// Again needs clear up. Function in loop
function mobileResize() {
            //If it's mobile(ish) lose the cover
            body.classList.remove('coverFocus');
            body.classList.remove('coverActive');
            body.style.minHeight = 'initial';
            coverOn = false;

            if(document.getElementById('mobile-related')) {
                body.style.minHeight = _docHeight + 'px';
                relatedPane = document.getElementById('mobile-related');
                relatedPane.classList.remove('free');
                relatedTriggerHeight = (wrapper.offsetHeight - header.offsetHeight);

                document.querySelector('#mobile-related .header').addEventListener('click', function(event) {  
                    relatedPane.classList.toggle('flip');
                }, false);
            } else if(body.classList.contains('home')) {
                    var panes = document.querySelectorAll('#mobile-panes span');
                    for (var i=panes.length; i--;) {
                        panes[i].addEventListener('click', function(event) { 
                            if(this.classList.contains('active')) {

                            } else {
                                document.getElementById('container').style.left = '-' + this.getAttribute("data-offset")  + '00%'; 
                                document.querySelector('#mobile-panes span.active').classList.remove('active');
                                this.classList.add('active'); 
                            }
                        }, false); 
                    }
            }
}

function captureRelease() {
    var s = window.pageYOffset;

    if(s >= relatedTriggerHeight && relatedState === true) {
        relatedPane.classList.add('free');
        relatedState = false;
    } else if(s <= relatedTriggerHeight && relatedState === false) {
        relatedPane.classList.remove('free');
        relatedState = true;
    }
}
////////////////