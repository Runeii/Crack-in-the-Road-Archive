/*
name: exfm
author: Extension Entertainment, Inc.
*/

/** config_values */
EXFM_IMGHOST = "https://s3.amazonaws.com/static.extension.fm/"
EXFM_CSSHOST = "https://s3.amazonaws.com/static.extension.fm/";
EXFM_XDHOST = "http://ex.fm/static/html/player.html";
EXFM_JSHOST = "https://s3.amazonaws.com/static.extension.fm/exfm.js";
EXFM_XDORIGIN = "http://ex.fm";
EXFM_API = "http://ex.fm/";
EXFM_SITE_PLAYER_URL = "http://ex.fm/site-player";
EXFM_PARSE = true;
EXAudioSwfUrl = "http://static.extension.fm/EXAudio.swf";
EXFM_WEBSITE = "http://ex.fm";
EXFM_REF_FROM = "?from=ext_player";
EXFM_EXTERNAL_CSSHOST = "http://static.extension.fm/";
/** end_config_values */
if (typeof(EXFM) == 'undefined'){
	EXFM = {};
}
EXFM.Playlist = [];
EXFM.OriginalPlaylist = [];
EXFM.Browser = null;
EXFM.Owner = null;
EXFM.QueryParams = {};
EXFM.PageHasSongs = false;
EXFM.Initialized = false;
EXFM.DOM_WINDOW = this;
EXFM.CurrentPlaylistPlayButton = null;
EXFM.CurrentSite = null;
try {
    onEXFMVarsSet();
} catch(e){}
EXFM.Init = function(shouldBuild){
    if (EXFM.Initialized == false){
        if (window.top == window){
            EXFM.Initialized = true;
            EXFM.Event.add(document, "keyup", EXFM.KeyBoardShortcuts.keyup);
            EXFM.Event.add(window, "message", EXFM.XD.receive);
            var scripts = document.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++){
                var script = scripts[i];
                if (script.src.indexOf('exfm.js') != -1){
                    EXFM.Utils.getQueryParams(script.src, EXFM.QueryParams);
                }
            }
            if (EXFM.QueryParams.has_extension){
                EXFM_HAS_EXTENSION = true;
            }
            if (typeof(EXFM_HAS_EXTENSION) == "undefined" && typeof(EXFM_HAS_FIREFOX_EXTENSION) == "undefined"){
                EXFM_REF_FROM = "?from=site_player";
            }
            var exfmOnPage = document.getElementById("exfm_on_page");
            if (EXFM.QueryParams.autoplay && EXFM.QueryParams.autoplay == "true"){
                if (typeof(EXFM_HAS_EXTENSION) == "undefined" && typeof(EXFM_HAS_FIREFOX_EXTENSION) == "undefined"){
                    EXFM.Event.add(window, "exfmPageHasSongs", EXFM.Autoplay);
                }
            }
            if (EXFM_PARSE == true){
                EXFM.Parse.init();
            }
            if (shouldBuild == true){
                EXFM.CSS.add();
                EXFM.CSS.external();
                EXFM.Event.add(window, "exfmPageHasSongs", EXFM.Bottom.build);
                EXFM.Event.add(window, "exfmPageHasSongs", EXFM.Bottom.attachEvents);
                if (EXFM.PageHasSongs == true){
                    EXFM.Bottom.build(null, true);
                } 
            } else {
                EXFM.Event.add(window, "exfmPageHasSongs", EXFM.Bottom.attachEvents);
                if (EXFM.PageHasSongs == true){
                    EXFM.Bottom.attachEvents();
                }
            }
            if (typeof(EXFM_HAS_POSTMESSAGE) == "undefined"){
                EXFM.XD.create();
            }
            if (EXFM.QueryParams.user != undefined && EXFM.QueryParams.show_loved != "false"){
                EXFM.User.loved.request(EXFM.QueryParams.user);
            }
            var exfmOnPage = document.createElement("div");
            exfmOnPage.setAttribute("id", "exfm_on_page");
            exfmOnPage.className = "exfm_invisible";
            document.body.appendChild(exfmOnPage);
            EXFM.Event.fire(window, "exfmPlayerInit");
        }
    }
}
EXFM.Autoplay = function(){
    EXFM.Bottom.showFull();
    EXFM.Player.play(0);
}
EXFM.Reset = function(){
    EXFM.PlaylistObj.obj = {};
    EXFM.Playlist = [];
    EXFM.Player.loaded = false;
    EXFM.Bottom.resizeHandle.hide();
    EXFM.Bottom.controls.playPauseButton.showPlay();
}
EXFM.Parse = {
    init : function(){
        EXFM.Parse.objects = document.getElementsByTagName("object");
        EXFM.Parse.iframes = document.getElementsByTagName("iframe");
        EXFM.Parse.anchorTags = document.getElementsByTagName("a");
        EXFM.Parse.audioTags = document.getElementsByTagName("audio");
        EXFM.Parse.scripts = document.getElementsByTagName("script");
        EXFM.Parse.isLiveMusicArchive = false;
        if (location.href.indexOf("archive.org") != -1){
            EXFM.Parse.isLiveMusicArchive = true;
        }
        EXFM.Parse.anchors.request();
        EXFM.Parse.audioElements.request();
        EXFM.Parse.tumblr.init();
        EXFM.Parse.soundcloud.init();
        EXFM.Parse.bandcamp.init();
        EXFM.Parse.officialfm.init();
        EXFM.Parse.wpAudioPlayer.scrape();
        EXFM.Parse.apiScripts.scrape();
        if (location.href.indexOf("twitter.com") != -1){
            setTimeout(EXFM.Parse.anchors.request, 3000);
            setInterval(EXFM.Parse.anchors.request, 10000);
        }
    },
    songHelper : function(song, domain){
        if (EXFM.QueryParams.user){
            song.context = EXFM.QueryParams.user;
        }
    },
    anchors : {
        request : function(){
            var added = 0;
            var v3Songs = [];
            var len = EXFM.Parse.anchorTags.length;
            var source = EXFM.Utils.getSource();
            if (EXFM.Parse.isLiveMusicArchive == true){
                try {
                    var keys = EXFM.Utils.getByClass("key");
                    for (var k in keys){
                        if ( keys[k].innerHTML == "Date:" ){
                            var publish_date = new Date(keys[k].nextElementSibling.innerText.split(" (check for other copies)")[0]).getTime();
                        }
                    }
                } catch(e){}
            }
            for (var i = 0; i < len; i++){
                var anchor = EXFM.Parse.anchorTags[i];
                var lastIndex = anchor.href.lastIndexOf('.');
                var sub = anchor.href.substr(lastIndex, 4);
  		        var hrefLen = anchor.href.length;
  		        if (sub == '.mp3' && (hrefLen - lastIndex) == 4 || EXFM.Utils.hasClass(anchor, "exfm_song")){
  		            if (EXFM.Parse.isLiveMusicArchive == true && anchor.href.lastIndexOf('64') != -1){
  		            } else {
      		            var song = new EXFM_Song();
      		            song.title = anchor.innerHTML.replace(/(<([^>]+)>)/ig,"");
      		            if (song.title == ""){
                            try {
                                var lastSlash = anchor.href.lastIndexOf('/');
                                song.title = anchor.href.substring(lastSlash+1, lastIndex);
                            } catch(e){}
      		            }
      		            EXFM.Utils.getSongAttributes(anchor, song);
      		            song.url = EXFM.Utils.cleanEncode(anchor.href);
      		            song.source = source;
      		            EXFM.Parse.songHelper(song, location.hostname);
      		            var position = EXFM.PlaylistObj.add(song, false);
      		            if (position != -1){
      		                added++;
      		            }
      		            if (EXFM.Parse.isLiveMusicArchive == true){
      		                song.sort_value = position;
      		                if (publish_date){
      		                    song.publish_date = publish_date;
      		                }
      		            }
      		            EXFM.Inline.create(anchor, song, position, false);
      		        }
  		        } else {
  		            var testString = anchor.href;
  		            if (anchor.getAttribute('data-expanded-url')){
  		                testString = anchor.getAttribute('data-expanded-url');
  		            }
  		            if (testString.indexOf(EXFM_WEBSITE+'/song/') != -1){
  		                if (EXFM.Utils.hasClass(anchor.parentNode, "exfm_post_via") != true && EXFM.Utils.hasClass(anchor, "exfm_current_playlist_songtitle") != true){
      		                var songId = testString.substr((EXFM_WEBSITE+'/song/').length);
      		                if (!EXFM.SongAPI.v3.checked[songId]){
      		                    EXFM.SongAPI.v3.checked[songId] = anchor;
      		                    v3Songs.push(songId);
      		                }
      		            }
  		            }
  		        }
            }
            if (v3Songs.length > 0){
                EXFM.SongAPI.v3.request(v3Songs);
            }
            if (added > 0){
                EXFM.PlaylistObj.done();
            }
            EXFM.Event.fire(window, "exfmInlineButtonsBuilt");
        }
    },
    audioElements : {
        request : function(){
            var added = 0;
            var source = EXFM.Utils.getSource();
            var len = EXFM.Parse.audioTags.length;
            for (var i = 0; i < len; i++){
                var audioElement = EXFM.Parse.audioTags[i];
                if (audioElement.src != "" && audioElement.src != undefined){
                    var song = new EXFM_Song();
                    try {
                        var lastSlash = audioElement.src.lastIndexOf('/');
                        var lastDot = audioElement.src.lastIndexOf('.');
                        song.title = sourceElement.src.substring(lastSlash+1, lastDot);
                    } catch(e){}
                    EXFM.Utils.getSongAttributes(audioElement, song);
                    song.url = audioElement.src;
    	            song.source = source;
    	            EXFM.Parse.songHelper(song, location.hostname);
  		            var position = EXFM.PlaylistObj.add(song, false);
    	            if (position != -1){
    	               added++;
    	            }
    	            EXFM.Inline.create(audioElement, song, position, false);
                } else {
                    var sourceElements = audioElement.getElementsByTagName('source');
                    for (var j = 0; j < sourceElements.length; j++){
                        var sourceElement = sourceElements[j];
                        var lastIndex = sourceElement.src.lastIndexOf('.');
                        var sub = sourceElement.src.substr(lastIndex, 4);
  		                var hrefLen = sourceElement.src.length;
  		                if (sub == '.mp3' && (hrefLen - lastIndex) == 4){
                            var song = new EXFM_Song();
                            try {
                                var lastSlash = sourceElement.src.lastIndexOf('/');
                                song.title = sourceElement.src.substring(lastSlash+1, lastIndex);
                            } catch(e){}  
                            EXFM.Utils.getSongAttributes(audioElement, song);
                            song.url = sourceElement.src;
    	                    song.source = source;
    	                    EXFM.Parse.songHelper(song, location.hostname);
  		                    var position = EXFM.PlaylistObj.add(song, false);
  		                    if (position != -1){
  		                        added++;
  		                    }
    	                }
                    }
                }
            }
            if (added > 0){
                EXFM.PlaylistObj.done();
            }
            EXFM.Event.fire(window, "exfmInlineButtonsBuilt");
        }
    },
    tumblr : {
        init : function(){
            var len = EXFM.Parse.iframes.length;
            for (var i = 0; i < len; i++){
                var iframe = EXFM.Parse.iframes[i];
                if (iframe.id != null){
                    if (iframe.id == 'tumblr_controls'){
                        EXFM.Parse.tumblr.site.scrape();
                        EXFM.Parse.tumblr.site.api.request(location.hostname);	
                    }
                }
            }
            if (location.href.indexOf('tumblr.com/dashboard') != -1){
                EXFM.Parse.tumblr.dashboard.scrape();
                EXFM.Parse.tumblr.dashboard.api.request();
                setInterval(EXFM.Parse.tumblr.dashboard.scrape, 10000);
            }
            if (EXFM.QueryParams.tumblr_username){
                EXFM.Parse.tumblr.site.api.request(EXFM.QueryParams.tumblr_username+".tumblr.com");
            }
        },
        dashboard : {
            scrape : function(){
                var lis = EXFM.Utils.getByClass("audio");
                var added = 0;
    			var len = lis.length;
    			for (var i = 0; i < len; i++){
                    try {
    					var li = lis[i];
    					var embeds = li.getElementsByTagName("embed");
    					var embed = embeds[0];
    					var srcAttr = embed.getAttribute('src');
    					var audioFile = srcAttr.split("audio_file=")[1];
    					var url = decodeURIComponent(audioFile.split("&color=")[0])+'?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio';
    					var song = new EXFM_Song();
    	  				song.url = url;
    	  				song.source = location.href;
    	  				var domain = location.hostname;
    	  				var postBodies = EXFM.Utils.getByClass("post_body", li);
    	  				var postBody = postBodies[0];
    				    var albumArts = EXFM.Utils.getByClass("album_art", li);
						if (albumArts.length > 0){
							var albumArt = albumArts[0];
							song.image.small = albumArt.getAttribute("src");
							song.image.medium = albumArt.getAttribute("src");
							song.image.large = albumArt.getAttribute("src");
							var title = albumArt.getAttribute("title");
							var titleSplit = title.split(' - ');
							song.artist = titleSplit[0];
							song.title = titleSplit[1];
						} else {
							song.title = EXFM.Utils.shortenString(postBody.innerHTML.replace(/(<([^>]+)>)/ig,""), 200);
						}
						var permalink = EXFM.Utils.getByClass("permalink", li);
                        if (permalink.length > 0){
                            song.source = permalink[0].href;
                            domain = EXFM.Utils.cleanHref(song.source);
                        }
                        EXFM.Parse.songHelper(song, domain);
						var position = EXFM.PlaylistObj.add(song, false);
						if (position != -1){
                            added++;
						}
						EXFM.Inline.create(embed, song, position, true);
      		        } catch(e){}
    			}
    			if (added > 0){
                    EXFM.PlaylistObj.done();
                }
    			EXFM.Event.fire(window, "exfmInlineTumblrDashboardButtonsBuilt");
            },
            api : {
                request : function(){
                    if (typeof(EXFM_HAS_EXTENSION) != "undefined"){
                       var url = EXFM_API+"api/v3/settings/services/tumblr/dashboard";
                       EXFM.XD.post(
                          {
                              "func" : "IframePlayer.xhr.request", 
                              "callback" : "EXFM.Parse.tumblr.dashboard.api.response",
                              "args" : [{"url" : url, "type" : "GET", "dataType" : "json"}]
                          }
                        )   
                    }
                },
                response : function(jqXhr){
                    if (jqXhr.status == 200){
                        var obj = JSON.parse(jqXhr.responseText);
                        try {
                            var added = 0;
                            var len = obj.posts.length;
                            for (var i = 0; i < len; i++){
                                try {
                                    var post = obj.posts[i];
                                    if(post.audio_url){
                                        var song = new EXFM_Song();
                                        var url = post.audio_url;
                                        if(post.audio_url.indexOf('https://') != -1){
                                            url = post.audio_url.replace('https://', 'http://');
                                        }
                                        song.url = url+'?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio';
                                        song.source = post.post_url;
                                        if(post.track_name){
                                            song.title = post.track_name;
                                            song.confidence = .7;
                                        }
                                        if(post.artist){
                                            song.artist = post.artist;
                                            song.confidence = .7;
                                        }
                                        if(post.album){
                                            song.album = post.album;
                                            song.confidence = .7;
                                        }
                                        if(song.title && song.artist){
                                            song.confidence = 1;
                                        }
                                        if(post.album_art){
                                            var coverart = post.album_art
                                            if(post.album_art.indexOf('https://') != -1){
                                                coverart = post.album_art.replace('https://', 'http://');
                                            }
                                            song.image.small = coverart;
                        				    song.image.medium = coverart;
                        				    song.image.large = coverart;
                                        }
                                        var domain = EXFM.Utils.cleanHref(song.source);
                                        song.publish_date = new Date(post.date).getTime();
            				            song.sort_value = post.timestamp * 1000;
            				            EXFM.Parse.songHelper(song, domain);
                                        var position = EXFM.PlaylistObj.add(song, false);
                        				if (position != -1){
                        				    added++;
                        				}
                                    }
        				        } catch(e){}
                            }
                            if (added > 0){
                                EXFM.PlaylistObj.done();
                            }
                            EXFM.Event.fire(window, "tumblrDashboardAPIResponse");
                        } catch(e){}
                    }
                }
            }
        },
        site : {
            scrape : function(){
                var divs = EXFM.Utils.getByClass("audio_player");
                var added = 0;
    			var len = divs.length;
    			for (var i = 0; i < len; i++){
    				try {
    					var div = divs[i];
    					var embeds = div.getElementsByTagName("embed");
    					var embed = embeds[0];
    					var srcAttr = embed.getAttribute('src');
    					var audioFile = srcAttr.split("audio_file=")[1];
    					var url = decodeURIComponent(audioFile.split("&color=")[0])+'?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio';
    					var song = new EXFM_Song();
    	  				song.url = url;
    	  				song.source = location.href;
    	  				EXFM.Parse.songHelper(song, location.hostname);
  		                var position = EXFM.PlaylistObj.add(song, false);
    	  				if (position != -1){
    	  	                added++;
    	  				}
      		            EXFM.Inline.create(embed, song, position, true);
    				} catch(e){}
    			}
    			if (added > 0){
                    EXFM.PlaylistObj.done();
                }
    			EXFM.Event.fire(window, "exfmInlineTumblrButtonsBuilt");
            },
            api : {
                request : function(tumblr_url){
                    if (typeof(EXFM_HAS_AJAX) == "undefined"){
                        EXFM.Ajax.request("http://"+tumblr_url+"/api/read/json?type=audio&start=0&num=50", "callback", "EXFM.Parse.tumblr.site.api.response");
                    } else {
        				EXFM.Ajax.request("http://"+tumblr_url+"/api/read/json?debug=1&type=audio&start=0&num=50", "callback", "EXFM.Parse.tumblr.site.api.response", "get");
                    }
                },
                response : function(obj){
                    try {
                        var added = 0;
                        for (var i = 0; i < obj.posts.length; i++){
        					var item = obj.posts[i];
        				    if (item['audio-player'].indexOf('audio_file=') != -1){
            					var src = item['audio-player'].split('audio_file=');
            					var file = src[1].split('&color=');
            					var song = new EXFM_Song();
              		            song.url = decodeURIComponent(file[0])+'?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio';
              		            song.source = item['url-with-slug'];
              		            song.publish_date = item['unix-timestamp'] * 1000;
              		            song.sort_value = item['unix-timestamp'] * 1000;
              		            song.title = EXFM.Utils.shortenString(item['audio-caption'].replace(/(<([^>]+)>)/ig,""), 200);
              		            if (obj.tumblelog.cname) {
                                    var domain = obj.tumblelog.cname;
        					    } else {
        						    var domain = obj.tumblelog.name+".tumblr.com";
        					    }
              		            try {
    				                if (item['id3-title'] != undefined){
    					               song.title = item['id3-title'];
    					               song.confidence = .7;
    					            }
    				            } catch(e){}
                				try {
                				    if (item['id3-artist'] != undefined){
                					   song.artist = item['id3-artist'];
                					   song.confidence = .7;
                				    }
                				} catch(e){}
                				try {
                				    if (item['id3-album'] != undefined){
                					   song.album = item['id3-album'];
                					   song.confidence = .7;
                				    }
                				} catch(e){}
                				try {
                				    if (item['id3-album-art'] != undefined){
                				        song.image.small = item['id3-album-art'];
                				        song.image.medium = item['id3-album-art'];
                				        song.image.large = item['id3-album-art'];
                				        song.confidence = .7;
                				    }
                				} catch(e){}
                				EXFM.Parse.songHelper(song, domain);
      		                    var position = EXFM.PlaylistObj.add(song, false);
              		            if (position != -1){
              		                added++;
              		            }
              		        }
          		        }
        				if (added > 0){
        				    EXFM.PlaylistObj.done();
        				}
        				EXFM.Event.fire(window, "tumblrAPIResponse");
                    } catch(e){}
                }
            }
        }
    },
    soundcloud : {
        api : "https://api.soundcloud.com",
        key : "leL50hzZ1H8tAdKCLSCnw",
        embedEls : {},
        init : function(){
            if (location.href.indexOf('soundcloud.com') != -1){
                EXFM.Parse.soundcloud.site.request();
            }
            EXFM.Parse.soundcloud.embeds();
        },
        site : {
            request : function(){
                var currentUser = null;
                try {
                    currentUser = EXFM.Utils.getByClass('current-user')[0].innerHTML;
                } catch(e){}
                var url = null;
                if (location.href.indexOf("soundcloud.com/tracks") != -1){
                    url = EXFM.Parse.soundcloud.api+"/tracks?order=hotness";
                }
                if (location.href.indexOf("soundcloud.com/tracks?order=hotness") != -1){
                    url = EXFM.Parse.soundcloud.api+"/tracks?order=hotness";
                }
                if (location.href.indexOf("soundcloud.com/tracks?order=latest") != -1){
                    url = EXFM.Parse.soundcloud.api+"/tracks?order=latest";
                }
                if (location.href.indexOf("soundcloud.com/tracks/search") != -1){
                    url = null;
                }
                if (location.href.indexOf("soundcloud.com/search?q") != -1){
                    var s = {};
                    EXFM.Utils.getQueryParams(location.href, s);
                    var query = s['q%5Bfulltext%5D'];
                    url = EXFM.Parse.soundcloud.api+"/tracks?q="+query;
                }
                if (location.href.indexOf("soundcloud.com/you/tracks") != -1){
                    if (currentUser != null) {
                        url = EXFM.Parse.soundcloud.api+"/users/"+currentUser+"/tracks?x=l";
                    }
                }
                if (location.href.indexOf("soundcloud.com/you/favorites") != -1){
                    if (currentUser != null) {
                        url = EXFM.Parse.soundcloud.api+"/users/"+currentUser+"/favorites?x=l";
                    }
                }
		        if (url != null){
                    EXFM.Ajax.request(url+"&format=json&consumer_key="+EXFM.Parse.soundcloud.key, "callback", "EXFM.Parse.soundcloud.site.response", "get", {"on_site" : true});
                } else {
                    EXFM.Ajax.request(EXFM.Parse.soundcloud.api+"/resolve?url="+escape(location.href)+"&format=json&consumer_key="+EXFM.Parse.soundcloud.key, "callback", "EXFM.Parse.soundcloud.site.resolved", "get", {"on_site" : true});
                }
            },
            response : function(array){
                var onSite = this.on_site || false;
                var added = 0;
                var len = array.length;
                for (var i = 0; i < len; i++){
    				try {
    					var trackObj = array[i];
    					var song = EXFM.Parse.soundcloud.parseTracks(trackObj, null, onSite, null, i);
    					if (song != null){
                            var position = EXFM.PlaylistObj.add(song, false);
          		            if (position != -1){
                                added++;
                            }
    					}
    				} catch(e){}
                }
                if (added > 0){
                    EXFM.PlaylistObj.done();
                }
                EXFM.Event.fire(window, "soundcloudAPIResponse");
            },
            resolved : function(obj){
                var onSite = this.on_site || false;
                var added = 0;
                var set_permalink_url = null;
                if (obj.permalink_url){
                    if (obj.permalink_url.indexOf("/sets/") != -1){
                        set_permalink_url = obj.permalink_url;
                    }
                }
                if (obj.length > 0){
                    var len = obj.length;
                    var album = null;
                    if (obj.title != undefined){
                        album = obj.title;
                    }
                    for (var i = 0; i < len; i++){
        				try {
        					var trackObj = obj[i];
        					var song = EXFM.Parse.soundcloud.parseTracks(trackObj, album, onSite, set_permalink_url, i);
        					if (song != null){
                                var position = EXFM.PlaylistObj.add(song, false);
          		                if (position != -1){
                                    added++;
                                }
        					}
        				} catch(e){}
                    }
                } else {
                    if (obj.tracks != undefined){
                        var len = obj.tracks.length;
                        var album = null;
                        if (obj.title != undefined){
                            album = obj.title;
                        }
                        for (var i = 0; i < len; i++){
            				try {
            					var trackObj = obj.tracks[i];
            					var song = EXFM.Parse.soundcloud.parseTracks(trackObj, album, onSite, set_permalink_url, i);
            					if (song != null){
                                    var position = EXFM.PlaylistObj.add(song, false);
                                    if (position != -1){
                                        added++;
                                    }
            					}
            				} catch(e){}
                        }
                    }
                    if (obj.username != undefined){
                        var url = null;
                        url = EXFM.Parse.soundcloud.api+"/users/"+obj.permalink+"/tracks?x=l"
                        if (location.href.indexOf("/favorites") != -1){
                            url = EXFM.Parse.soundcloud.api+"/users/"+obj.permalink+"/favorites?x=l"
                        }
                        if (location.href.indexOf("/sets") != -1){
                            url = null;
                        }
                        if (url != null){
                            EXFM.Ajax.request(url+"&format=json&consumer_key="+EXFM.Parse.soundcloud.key, "callback", "EXFM.Parse.soundcloud.site.response", "get", {"on_site" : onSite});
                        }
    				}
    				if (obj.permalink_url.indexOf("/groups/") != -1){
    				    EXFM.Ajax.request(EXFM.Parse.soundcloud.api+"/groups/"+obj.id+"/tracks?format=json&consumer_key="+EXFM.Parse.soundcloud.key, "callback", "EXFM.Parse.soundcloud.site.response", "get", {"on_site" : onSite});
    				}
    				if (obj.stream_url != undefined){
    				    var song = EXFM.Parse.soundcloud.parseTracks(obj, null, onSite, set_permalink_url);
    					if (song != null){
                            var position = EXFM.PlaylistObj.add(song, false);
          		            if (position != -1){
                                added++;
                            }
    					}
    				}
                }
                if (added > 0){
                    EXFM.PlaylistObj.done();
                }
                if ( EXFM.QueryParams.replace_soundcloud_mini == "true" && this.paramObj.player_type && this.paramObj.player_type == "tiny" ) {
                    var el = EXFM.Parse.soundcloud.embedEls[this.elHash]
                    EXFM.Inline.create(el, song, position, true);
                }
                EXFM.Event.fire(window, "soundcloudResolveAPIResponse");
            }
        },
        parseTracks : function(trackObj, album, onSite, set_permalink_url, sort_value){
            var song = null;
            var source = EXFM.Utils.getSource();
            var siteUrl = set_permalink_url || source;
            EXFM.Utils.setLogoLink(siteUrl);
            try {
                if (trackObj.stream_url){
                    song = new EXFM_Song();
                    if (trackObj.streamable == true && trackObj.sharing == "public"){
                        song.url = trackObj.stream_url;
        			    song.title = trackObj.title;
        			    if (onSite == true){
                            song.source = trackObj.permalink_url;
                            if (set_permalink_url != null){
                                song.source = set_permalink_url;
                            }
                            song.publish_date = new Date(trackObj.created_at).getTime();
                            if (sort_value !== 'undefined'){
                                song.sort_value = sort_value;
                            }
        			    } else {
                            song.source = source;
                        }
                        song.artist = trackObj.user.username;
                        song.soundcloud_title = trackObj.title;
                        song.souncloud_track_id = trackObj.id;
        			    if (trackObj.artwork_url != null){
                            var artwork = trackObj.artwork_url.replace('large', 't500x500'); 
                            song.image.small = trackObj.artwork_url;
        				    song.image.medium = artwork;
        				    song.image.large = artwork;
        			    }
        			    if (album != null){
        				    song.album = album;
        			    }
        			    if (trackObj.release != undefined && trackObj.release != ""){
        				    song.album = trackObj.release;
        			    }
        			    if (trackObj.purchase_url != undefined){
        				    song.buy_link = trackObj.purchase_url;
        			    } else {
                            song.buy_link = trackObj.permalink_url;
        			    }
            	  	    song.confidence = 1;
            	  	    song.soundcloud_track_id = trackObj.id;
            	  	    EXFM.Parse.songHelper(song, location.hostname);
            	  	    if (trackObj.genre != ""){
            	  	        song.tags.push(trackObj.genre);
            	  	    }
            	  	}
                }
            } catch(e){}
            return song;
        },
        checkUrlForApi : function(url){
            if (url.indexOf("api.soundcloud.com") != -1){
                return url;
            } else {
                return EXFM.Parse.soundcloud.api+"/resolve?url="+url;
            }
        },
        embeds : function(){
            var len = EXFM.Parse.objects.length;
			for (var i = 0; i < len; i++){
				var object = EXFM.Parse.objects[i];
				try {
    				var innerHTML = object.innerHTML;
    				if (innerHTML.indexOf('player.soundcloud.com/player.swf') != -1){
    				    if (innerHTML.indexOf('player.soundcloud.com/player.swf?playlist=') == -1){
    				        var params = object.getElementsByTagName("param");
    						if (params.length > 0){
        	 					for (var j = 0; j < params.length; j++){
                                    var param = params[j];
                                    try {
                                        if (param.getAttribute("name") == "movie" || param.getAttribute("name") == "src" || param.getAttribute("name") == "data"){
                                            var value = param.getAttribute("value");
                                            var paramObj = {}
                                            EXFM.Utils.getQueryParams(value, paramObj);
                                            EXFM.Parse.soundcloud.resolveEmbed(object, paramObj);
                                            break;
                                        }
                                    } catch(e){}
        	 					}
        	 		        } else {
        	 		            var embeds = object.getElementsByTagName("embed");
        	 		            if (embeds.length > 0){
            	 		            var src = embeds[0].getAttribute("src");
            	 		            var paramObj = {}
                                    EXFM.Utils.getQueryParams(src, paramObj);
                                    EXFM.Parse.soundcloud.resolveEmbed(object, paramObj);
                                } else {
                                    var data = object.getAttribute("data");
                                    if (data){
                                        var paramObj = {}
                                        EXFM.Utils.getQueryParams(data, paramObj);
                                        EXFM.Parse.soundcloud.resolveEmbed(object, paramObj);
                                    }
                                }
        	 		        }
    					}
     				}
     			} catch(e){}
			}
			var iLen = EXFM.Parse.iframes.length;
			for (var i = 0; i < iLen; i++){
                try {
    				var iframe = EXFM.Parse.iframes[i];
    				var src = iframe.getAttribute("src");
    				var lookFor = "soundcloud.com/player";
    				if (src.indexOf(lookFor) != -1){
    				    var params = src.split(lookFor);
    				    var paramObj = {}
                        EXFM.Utils.getQueryParams(params[1], paramObj);
                        EXFM.Parse.soundcloud.resolveEmbed(iframe, paramObj);	
    				}
                } catch(e){}
            }
        },
        resolveEmbed : function(el, paramObj){
            if (paramObj.url){
                var r = Math.random();
                var hash = "a"+hex_md5(r);
                EXFM.Parse.soundcloud.embedEls[hash] = el;
                var url = EXFM.Parse.soundcloud.checkUrlForApi(paramObj.url);
                var connector = "?";
                if (url.indexOf("?") != -1){
                    connector = "&";
                }
                EXFM.Ajax.request(unescape(url)+connector+"format=json&consumer_key="+EXFM.Parse.soundcloud.key, "callback", "EXFM.Parse.soundcloud.site.resolved", "get", {"on_site" : false, "elHash" : hash, "paramObj" : paramObj});
            }
        }
    },
    bandcamp : {
        init : function(){
            EXFM.Parse.bandcamp.site.scrape();
            EXFM.Parse.bandcamp.embeds();
        },
        site : {
            tags : [],
            scrape : function(){
                try {
                    var html = document.body.innerHTML;
                    var find = 'tralbum_param : { name : "album", value :';
                    var startIndex = html.indexOf(find);
                    if (startIndex != -1){
                        var newHTML = html.slice(startIndex);
    				    var endIndex = newHTML.indexOf('}');
    				    var albumId = EXFM.Utils.trimString(newHTML.slice(find.length, endIndex-1));
    				    if (albumId != "" && albumId != "undefined"){
    				        EXFM.Parse.bandcamp.site.getTags();
    				        EXFM.Parse.bandcamp.site.albumPage();
    				    }
                    }
                    var trackFind = 'tralbum_param : { name : "track", value :';
                    var trackStartIndex = html.indexOf(trackFind);
                    if (trackStartIndex != -1){
                        var trackNewHTML = html.slice(trackStartIndex);
    				    var trackEndIndex = trackNewHTML.indexOf('}');
    				    var trackId = EXFM.Utils.trimString(trackNewHTML.slice(trackFind.length, trackEndIndex-1));
    				    if (trackId != "" && trackId != "undefined"){
    				        EXFM.Parse.bandcamp.site.getTags();
    				        EXFM.Parse.bandcamp.site.trackPage();
    				    }
                    }
                } catch(e){}
            },
            getTags : function(){
                var tags = EXFM.Utils.getByClass("tag");
                var len = tags.length;
                for (var i = 0; i < len; i++){
                    var a = tags[i];
                    var tag = a.innerHTML;
                    if (tag){
                        EXFM.Parse.bandcamp.site.tags.push(tag);
                    }
                }
            },
            albumPage : function(){
                var obj = EXFM.Utils.getPageVar('TralbumData');
                var tracks = [];
                for (var t in obj.trackinfo){
                    var track = {};
                    var trackinfo = obj.trackinfo[t];
                    track.streaming_url = trackinfo.file.replace(/&amp;/g, '&');
                    track.title = trackinfo.title;
                    track.number = trackinfo.track_num;
                    track.artist = obj.artist;
                    track.track_id = trackinfo.id;
                    track.large_art_url = obj.artFullsizeUrl;
                    track.small_art_url = obj.artThumbURL;
                    track.url = trackinfo.title_link;
                    track.release_date = new Date(obj.current.release_date) / 1000;
                    tracks.push(track);
                }
                EXFM.Parse.bandcamp.parseTracks(tracks, {"url" : location.origin}, {"title" : obj.current.title, "url" : obj.url}, true);
            },
            trackPage : function(){
                var obj = EXFM.Utils.getPageVar('TralbumData');
                var tracks = [];
                for (var t in obj.trackinfo){
                    var track = {};
                    var trackinfo = obj.trackinfo[t];
                    track.streaming_url = trackinfo.file.replace(/&amp;/g, '&');
                    track.title = trackinfo.title;
                    track.number = trackinfo.track_num;
                    track.artist = obj.artist;
                    track.track_id = trackinfo.id;
                    track.large_art_url = obj.artFullsizeUrl;
                    track.small_art_url = obj.artThumbURL;
                    track.url = trackinfo.title_link;
                    if ( obj.current.release_date ) {
                        track.release_date = new Date(obj.current.release_date) / 1000;
                    } else {
                        if ( obj.current.publish_date ) {
                            track.release_date = new Date(obj.current.publish_date) / 1000;
                        }
                    }
                    tracks.push(track);
                }
                var albumTitle = null;
                try {
                    var og_description = EXFM.Utils.getOpenGraphContent('description'); 
                    if ( og_description ) {
                        albumTitle = og_description.split("from the album ")[1];
                    }
                } catch(e){}
                var albumUrl = null;
                if ( obj.album_url ) {
                    albumUrl = location.origin + obj.album_url;
                }
                EXFM.Parse.bandcamp.parseTracks(tracks, {"url" : location.origin}, {"title" : albumTitle, "url" : albumUrl}, true);
            }
        },
        embeds : function(){
            var len = EXFM.Parse.iframes.length;
            for (var i = 0; i < len; i++){
                var iframe = EXFM.Parse.iframes[i];
                var src = iframe.getAttribute('src');
                if (src != null){
                    if (src.indexOf("bandcamp.com/EmbeddedPlayer/v=2") != -1){
                        var albumSplitIndex = src.indexOf("album=");
                        if (albumSplitIndex != -1){
                            var albumSplit = src.substr(albumSplitIndex);
                            var albumCut = albumSplit.split("/");
                            var albumId = albumCut[0].split("album=")[1];
                            EXFM.Parse.bandcamp.album.request(albumId, false);
                        }
                        var trackSplitIndex = src.indexOf("track=");
                        if (trackSplitIndex != -1){
                            var trackSplit = src.substr(trackSplitIndex);
                            var trackCut = trackSplit.split("/");
                            var trackId = trackCut[0].split("track=")[1];
                            EXFM.Parse.bandcamp.track.request(trackId, false);
                        }
                    }
                }
            }
            var objectLen = EXFM.Parse.objects.length;
            for (var i = 0; i < objectLen; i++){
                var object = EXFM.Parse.objects[i];
                try {
    				var innerHTML = object.innerHTML;
    				if (innerHTML.indexOf('bandcamp.com/EmbeddedPlayer/') != -1){
    				    var data = object.getAttribute("data");
    				    var albumSplitIndex = data.indexOf("album=");
    				    if (albumSplitIndex != -1){
                            var albumSplit = data.substr(albumSplitIndex);
                            var albumCut = albumSplit.split("/");
                            var albumId = albumCut[0].split("album=")[1];
                            EXFM.Parse.bandcamp.album.request(albumId, false);
                        }
                        var trackSplitIndex = data.indexOf("track=");
                        if (trackSplitIndex != -1){
                            var trackSplit = data.substr(trackSplitIndex);
                            var trackCut = trackSplit.split("/");
                            var trackId = trackCut[0].split("track=")[1];
                            EXFM.Parse.bandcamp.track.request(trackId, false);
                        }
     				}
     			} catch(e){}
            }
        },
        album : {
            url : EXFM_API+"api/v3/bandcamp/album/",
            request : function(albumId, onSite){
                EXFM.Ajax.request(EXFM.Parse.bandcamp.album.url+albumId, "callback", "EXFM.Parse.bandcamp.album.response", "get", {"onSite" : onSite});
            },
            response : function(obj){
                EXFM.Parse.bandcamp.band.request(obj, this.onSite);
            }
        },
        band : {
            url : EXFM_API+"api/v3/bandcamp/band/",
            request : function(albumObj, onSite){
                EXFM.Ajax.request(EXFM.Parse.bandcamp.band.url+albumObj.band_id, "callback", "EXFM.Parse.bandcamp.band.response", "get", {"albumObj" : albumObj, "onSite" : onSite});
		},
            response : function(obj){
                EXFM.Parse.bandcamp.parseTracks(this.albumObj.tracks, obj, this.albumObj, this.onSite);
            }
        },
        track : {
            url : EXFM_API+"api/v3/bandcamp/track/",
            request : function(trackId, onSite){
                EXFM.Ajax.request(EXFM.Parse.bandcamp.track.url+trackId, "callback", "EXFM.Parse.bandcamp.track.response", "get", {"onSite" : onSite});
		},
            response : function(obj){
    			EXFM.Parse.bandcamp.track.album.request(obj, this.onSite);
            },
            album : {
                request : function(trackObj, onSite){
                    EXFM.Ajax.request(EXFM.Parse.bandcamp.album.url+trackObj.album_id, "callback", "EXFM.Parse.bandcamp.track.album.response", "get", {"trackObj" : trackObj, "onSite" : onSite});
                },
                response : function(obj){
                    EXFM.Parse.bandcamp.track.band.request(obj, this.trackObj, this.onSite);
                }
            },
            band : {
                request : function(albumObj, trackObj, onSite){
                    EXFM.Ajax.request(EXFM.Parse.bandcamp.band.url+trackObj.band_id, "callback", "EXFM.Parse.bandcamp.track.band.response", "get", {"albumObj" : albumObj, "trackObj" : trackObj, "onSite" : onSite});
                },
                response : function(obj){
                    EXFM.Parse.bandcamp.parseTracks([this.trackObj], obj, this.albumObj, this.onSite);
                }
            }
        },
        parseTracks : function(tracksArray, bandObj, albumObj, onSite){
            var added = 0;
            var source = EXFM.Utils.getSource();
    		var len = tracksArray.length;
    		for (var i = 0; i < len; i++){
    			var track = tracksArray[i];
    			if (track.streaming_url != "" && track.streaming_url != undefined){
    				var song = new EXFM_Song();
    				var stream_url_parts = {};
    				EXFM.Utils.getQueryParams(track.streaming_url, stream_url_parts);
    				var firstPart = track.streaming_url.substr(0, track.streaming_url.indexOf("?"));
    				var secondPart = "?";
    				for (var j in stream_url_parts){
    				    if (j != "fsig" && j != "ts"){
    				        secondPart += j+"="+ stream_url_parts[j]+"&";
    				    }
    				}
    				var parts = firstPart+secondPart;
    				var streaming_url = parts.substr(0, parts.length - 1);
    				song.url = streaming_url;
                    song.bandcamp_track_id = track.track_id;
                    if (track.title != undefined){
    					song.title = track.title;
    				} else {
    					song.title = "Unknown Song";
    				}
    				if (track.artist != undefined){
    					song.artist = track.artist;
    				} else {
    					if (bandObj.name != undefined){
    						song.artist = bandObj.name;
    					} 
    				}
    				if (albumObj.title != undefined){
    					song.album = albumObj.title;
    				} 
    				if (track.small_art_url != undefined){
    					song.image.small = track.small_art_url;
    				} else {
    					if (albumObj.small_art_url != undefined){
    						song.image.small = albumObj.small_art_url;
    					}
    				}
    				if (track.large_art_url != undefined){
    					song.image.medium = track.large_art_url;
    					song.image.large = track.large_art_url;
    				} else {
    					if (albumObj.large_art_url != undefined){
    						song.image.large = albumObj.large_art_url;
    					}
    				}
    				song.source = source;
    				if (albumObj && albumObj.url){
    				    song.source = EXFM.Utils.removeQueryParams(albumObj.url);
    				}
    				if (onSite === true){
    				    if (track.release_date){
        				    song.publish_date = track.release_date * 1000;
        				} else {
        				    if (albumObj && albumObj.release_date){
        				        song.publish_date = albumObj.release_date * 1000;
        				    }
        				} 
        				if (track.number){
    				        song.sort_value = track.number;
    				    }
    				    EXFM.Utils.setLogoLink(song.source);
    				} else {
                        song.source = source;
                    }
    				if (track.url != undefined && bandObj.url != undefined){
    				    if (track.url.indexOf("?") != -1){
    					   song.buy_link = bandObj.url+track.url+"&action=download&from=exfm";
    				    } else {
    				        song.buy_link = bandObj.url+track.url+"?action=download&from=exfm";
    				    }
    				}
    				song.bandcamp_track_id = track.track_id;
    				song.confidence = 1;
  		            if (EXFM.Parse.bandcamp.site.tags.length > 0){
  		                song.tags = song.tags.concat(EXFM.Parse.bandcamp.site.tags);
  		            }
  		            EXFM.Parse.songHelper(song, location.hostname);
  		            var position = EXFM.PlaylistObj.add(song, false);
          		    if (position != -1){
  		                added++
  		            }
    			}
    		}
    		if (added > 0){
    		  EXFM.PlaylistObj.done();
            }
            EXFM.Event.fire(window, "bandcampAPIResponse");		
        }
    },
    officialfm : {
        key : "1ERGcKIR3JdcBm8ioBw",
        init : function(){
            EXFM.Parse.officialfm.embeds();
            //if (location.href.indexOf('official.fm') != -1){
              //  EXFM.Parse.officialfm.site.scrape();
            //}
        },
        site : {
            scrape : function(){
                var tracks = document.getElementById("tracks");
                var tracksList = EXFM.Utils.getByClass("tracks", tracks);
            }
        },
        embeds : function(){
            var len = EXFM.Parse.iframes.length;
            for (var i = 0; i < len; i++){
                var iframe = EXFM.Parse.iframes[i];
                var src = iframe.getAttribute('src');
                if (src != null){
                    if (src.indexOf("official.fm") != -1){
                        var tracksIndex = src.indexOf("official.fm/tracks");
                        if (tracksIndex != -1){
                            var firstIndex = src.indexOf("official.fm/tracks") + 19;
                            var secondIndex = src.indexOf("?");
                            var trackId = src.substring(firstIndex, secondIndex); 
                            EXFM.Parse.officialfm.track.request(trackId);
                        }
                        var playlistsIndex = src.indexOf("official.fm/playlists");
                        if (playlistsIndex != -1){
                            var firstIndex = src.indexOf("official.fm/playlists") + 22;
                            var secondIndex = src.indexOf("?");
                            var playlistId = src.substring(firstIndex, secondIndex); 
                            EXFM.Parse.officialfm.playlist.request(playlistId);
                        }
                    }
                }
            }
        },
        track : {
            request : function(trackId){
                EXFM.Ajax.request("http://api.official.fm/track/"+trackId+"?key="+EXFM.Parse.officialfm.key+"&format=json", "callback", "EXFM.Parse.officialfm.track.response", "get", {"trackId" : trackId});
            },
            response : function(json){
                var len = json.length;
                for (var i = 0; i < len; i++){
                    EXFM.Parse.officialfm.stream.request(json[i]);
                }
            }
        },
        playlist : {
            request : function(playlistId){
                EXFM.Ajax.request("http://api.official.fm/playlist/"+playlistId+"?key="+EXFM.Parse.officialfm.key+"&format=json", "callback", "EXFM.Parse.officialfm.playlist.response", "get");
            },
            response : function(json){
                var len = json.length;
                for (var i = 0; i < len; i++){
                    var tracksLen = json[i].tracks.length;
                    for (var j = 0; j < tracksLen; j++){
                        var track = json[i].tracks[j];
                        EXFM.Parse.officialfm.track.request(track);
                    }
                }
            }
        },
        stream : {
            request : function(trackObj){
                EXFM.Ajax.request("http://api.official.fm/track/"+trackObj.id+"/stream?key="+EXFM.Parse.officialfm.key+"&format=json", "callback", "EXFM.Parse.officialfm.stream.response", "get", {"trackObj" : trackObj});
            },
            response : function(json){
                var source = EXFM.Utils.getSource();
                try {
                    this.trackObj.streamUrl = json.stream_url;
                    var song = new EXFM_Song();
    				song.url = this.trackObj.streamUrl;
    				if (this.trackObj.title != undefined){
    					song.title = this.trackObj.title;
    				} else {
    					song.title = "Unknown Song";
    				}
    				if (this.trackObj.artist_string != undefined){
    					song.artist = this.trackObj.artist_string;
    				}
    				if (this.trackObj.buy_url != undefined){
    					song.buy_link = this.trackObj.buy_url;
    				}
    				if (this.trackObj.picture_absolute_url != undefined){
    				    song.image.small = this.trackObj.picture_absolute_url;
    				    song.image.medium = this.trackObj.picture_absolute_url;
    					song.image.large = this.trackObj.picture_absolute_url;
    				}
    				song.source = source;
    				song.confidence = 1;
  		            EXFM.Parse.songHelper(song, location.hostname);
    	  	        var position = EXFM.PlaylistObj.add(song, false);
          		    if (position != -1){
    	  	            EXFM.PlaylistObj.done();
    	  	        }
    	  	    } catch(e){}
            }
        }
    },
    apiScripts : {
		scrape : function(){
			var added = 0;
			var source = EXFM.Utils.getSource();
			var len = EXFM.Parse.scripts.length;
			for (var i = 0; i < len; i++){
				var script = EXFM.Parse.scripts[i];
				if (script.className == "exfm_songs"){
				    try {
				        var json = script.innerHTML;
				        var obj = JSON.parse(json);
				        for (var j in obj){
				            if (obj[j].url){
				                var song = new EXFM_Song(); 
    				            song.url = obj[j].url;
        				        if (obj[j].songtitle){
        				            song.title = obj[j].songtitle;
        				            song.confidence = .9;
        				        }
        				        if (obj[j].smallimage){
        				            song.image.small = obj[j].smallimage;
        				        }
        				        if (obj[j].mediumimage){
        				            song.image.medium = obj[j].mediumimage;
        				        }
        				        if (obj[j].largeimage){
        				            song.image.large = obj[j].largeimage;
        				        }
        				        if (obj[j].image){
        				            song.image.small = obj[j].image;
        				            song.image.medium = obj[j].image;
        				            song.image.large = obj[j].image;
        				        }
        				        if (obj[j].amazonmp3link){
        				            song.buy_link = obj[j].amazonmp3link;
        				        }
        				        if (obj[j].href){
        				            song.source = obj[j].href;
        				        } else {
        				            song.source = source;
        				        }
        				        if (obj[j].source){
        				            song.source = obj[j].source;
        				        }
        				        for (var k in EXFM_Song_SettableFields){
        				            if (obj[j][EXFM_Song_SettableFields[k]]){
        				                song[EXFM_Song_SettableFields[k]] = obj[j][EXFM_Song_SettableFields[k]];
        				            }
        				        }
        				        if (song.title){
        				            song.confidence = .9;
        				        }
    	  	                    EXFM.Parse.songHelper(song, location.hostname);
        				        var position = EXFM.PlaylistObj.add(song, false);
          		                if (position != -1){
        				            added++;
        				        }
        				    }
    				    }
				    } catch(e){}
				}
			}
			if (added > 0){
                EXFM.PlaylistObj.done();
    	  	}
		}
    },
    wpAudioPlayer : {
        scrape : function(){
            var added = 0;
            var source = EXFM.Utils.getSource();
            var len = EXFM.Parse.objects.length;
			for (var i = 0; i < len; i++){
				var object = EXFM.Parse.objects[i];
				var innerHTML = object.innerHTML;
				if (innerHTML.indexOf('soundFile=') != -1){
				    var params = object.getElementsByTagName("param");
    	 		    for (var j = 0; j < params.length; j++){
                        var param = params[j];
                        try {
                            if (param.getAttribute("name").toLowerCase() == "flashvars"){
                                var value = param.getAttribute("value");
                                var paramObj = {}
                                EXFM.Utils.getQueryParams("hi?"+value, paramObj);
                                if (paramObj.soundFile){
                                    var url = unescape(paramObj.soundFile);
                                    var lastIndex = url.lastIndexOf('.');
                                    var sub = url.substr(lastIndex, 4);
	                                var hrefLen = url.length;
	                                if (sub == '.mp3' && (hrefLen - lastIndex) == 4){
	                                    var song = new EXFM_Song();
	                                    song.url = url;
	                                    try {
                                            var lastSlash = url.lastIndexOf('/');
                                            song.title = url.substring(lastSlash+1, lastIndex);
                                        } catch(e){
                                        song.title = "Unknown Title";
                                        }
                                        song.source = source;
                                        EXFM.Parse.songHelper(song, location.hostname);
                                        if (document.getElementById("SessionDetailArtistImage")){
                                            song.image.small = document.getElementById("SessionDetailArtistImage").getAttribute("src");
                                            song.image.medium = document.getElementById("SessionDetailArtistImage").getAttribute("src");
                                            song.image.large = document.getElementById("SessionDetailArtistImage").getAttribute("src");
                                        }
                                        var position = EXFM.PlaylistObj.add(song, false);
  		                                if (position != -1){
                                           added++;
                                        }  
                                    }
                                }
                                break;
                            }
                        } catch(e){}
 					}
				}
            }
            if (added > 0){
                EXFM.PlaylistObj.done();
            }
        }
    }
}
EXFM.User = {
    loved : {
        method : "api/v3/user/%user%/loved?start=0&results=%results%",
        request : function(username){
            var method = EXFM_API+EXFM.User.loved.method.replace("%user%", username);
            var results = 50;
            if (EXFM.QueryParams.loved_results){
                results = EXFM.QueryParams.loved_results;
            }
            method = method.replace("%results%", results);
            EXFM.Ajax.request(method, "callback", "EXFM.User.loved.response", "get"); 
        },
        response : function(json){
            var source = EXFM.Utils.getSource();
            if (json.status_code == 200){
                var added = 0;
                var len = json.songs.length;
                for (var i = 0; i < len; i++){
                    var song = json.songs[i];
                    song.source = source;
                    song.user_love_source = song.user_love.source;
                    song.check_meta = false;
                    EXFM.Parse.songHelper(song, location.hostname);
                    var position = EXFM.PlaylistObj.add(song, false);
                    if (position != -1){
                        added++;
		            }
                }
                if (added > 0){
                    EXFM.PlaylistObj.done();
                }
            }
        }
    }
}
EXFM.SongAPI = {
    v1 : {
        checked : {},
        request : function(songId){
            if (!EXFM.SongAPI.v1.checked[songId]){
                EXFM.SongAPI.v1.checked[songId] = songId;
            }
        },
        response : function(json){
        
        }
    },
    v3 : {
        method : "api/v3/song/multi",
        checked : {},
        request : function(songs){
            var args = "?id="+songs.join("&id=");
            EXFM.Ajax.request(EXFM_API+EXFM.SongAPI.v3.method+args, "callback", "EXFM.SongAPI.v3.response", "get");
        },
        response : function(json){
            var source = EXFM.Utils.getSource();
            if (json.status_code == 200){
                var len = json.songs.length;
                for (var i = 0; i < len; i++){
                    var song = json.songs[i];
                    var anchor = EXFM.SongAPI.v3.checked[song.id];
                    if (anchor){
                        var added = 0;
                        song.source = source;
                        var domain = location.hostname;
                        song.check_meta = false;
                        var position = EXFM.PlaylistObj.add(song, false);
                        if (position != -1){
                            added++;
        		        }
        		        EXFM.Inline.create(anchor, song, position, false, song.viewer_love);
                        if (added > 0){
                            EXFM.PlaylistObj.done();
                        }
                    }
                }
            }
        }
    }
}
EXFM.Site = {
    method :  "api/v3/site/",
    request : function(url){
        var args = url.replace("http://", "");
        EXFM.Ajax.request(EXFM_API+EXFM.Site.method+args, "callback", "EXFM.Site.response", "get");
    },
    response : function(json){
        if (json.status_code == 200){
            if (json.site.status == "complete"){
                var added = 0;
                var len = json.site.songs.length;
                for (var i = 0; i < len; i++){
                    var song = json.site.songs[i];
                    song.source = song.sources[0];
                    song.check_meta = false;
                    EXFM.Parse.songHelper(song, location.hostname);
                    var position = EXFM.PlaylistObj.add(song, false);
                    if (position != -1){
                        added++;
    	            }
                }
                if (added > 0){
                    EXFM.PlaylistObj.done();
                }
            } else {
                EXFM.Event.fire(window, "exfmSiteNotComplete");
            }
        } else {
            EXFM.Event.fire(window, "exfmSiteNotComplete");
        }
    }
}
EXFM.XD = {
    iframe : null,
    queue : [],
    initialized : false,
    create : function(){
        EXFM.XD.iframe = document.getElementById("exfm_xd_iframe");
        if (!EXFM.XD.iframe){        
            EXFM.XD.iframe = document.createElement("iframe");
            var params = "";
            if (typeof(EXFM_HAS_EXTENSION) == "undefined" && typeof(EXFM_HAS_FIREFOX_EXTENSION) == "undefined"){
                params = "?tga=true&acct=UA-24403901-1&cli=exfm_site_player&loc="+encodeURIComponent(location.href);
            }
            EXFM.XD.iframe.setAttribute("src", EXFM_XDHOST+params);
            EXFM.XD.iframe.setAttribute("id", "exfm_xd_iframe");
            EXFM.XD.iframe.setAttribute("width", "0");
            EXFM.XD.iframe.setAttribute("height", "0");
            EXFM.XD.iframe.setAttribute("frameborder", "0");
            document.body.appendChild(EXFM.XD.iframe);
        }
    },
    post : function(obj){
        var str = JSON.stringify(obj);
        if (EXFM.XD.initialized == true){
            EXFM.XD.iframe.contentWindow.postMessage(str, EXFM_XDHOST);
        } else {
            EXFM.XD.queue.push(str);
        } 
    },
    receive : function(e){
        if (e.origin == EXFM_XDORIGIN){
            var obj = JSON.parse(e.data);
            if (obj.msg == "init"){
                EXFM.XD.initialized = true;
                for (var i = 0; i < EXFM.XD.queue.length; i++){
                    var str = EXFM.XD.queue[i];
                    EXFM.XD.iframe.contentWindow.postMessage(str, EXFM_XDHOST);
                }
                EXFM.XD.queue = [];
                EXFM.Player.removeEvents();
            }
            if (obj.msg == "callback"){
                var path = EXFM.Utils.objectForPropertyPath(obj.func);
                path.apply(obj.context, [obj.args]);
            }
            if (obj.msg == "signedIn" || obj.msg == "accountCreated"){
                if (obj.data.success == true){
                    EXFM.Login.success(obj.msg, obj.data.toParam);
                } else {
                    EXFM.Login.error(obj.data.json);
                }
            }
            if (obj.msg == "shareClose"){
                EXFM.Bottom.bottomShareIcon.hide();
            }
            if (obj.msg == "shareResponse"){
                EXFM.Bottom.bottomShareIcon.response(obj.data);
            }
            if (obj.msg == "showLogin"){
                EXFM.Login.show(obj.signInText);
            }
            if (obj.msg == "popoutInit"){
                EXFM.Popout.sendData(true);
            }
        }
        if ( e.origin == location.origin ) {
            var obj = JSON.parse(e.data);
            if (obj.msg == "popoutInit"){
                EXFM.Popout.sendData(true);
            }
        }
    }
}
EXFM.Login = {
    window : null,
    successFunc : null,
    successObj : null,
    show : function(text){
        var loginDiv = document.createElement("div");
        loginDiv.className = "exfm_modal_box";
        loginDiv.setAttribute("id", "exfm_modal_login");
        document.body.appendChild(loginDiv);
        var loginTop = document.createElement("div");
        loginTop.className = "exfm_modal_top";
        loginTop.innerHTML = "exfm";
        loginClose = document.createElement("div");
        loginClose.className = "exfm_modal_close_button";
        loginTop.appendChild(loginClose);
        loginDiv.appendChild(loginTop);
        var loginMiddleTitle = document.createElement("div");
        loginMiddleTitle.className = "exfm_modal_middle_title";
        var loginText = text;
        if (!text){
            loginText = "Please Sign In to exfm to Love this Song.";
        }
        loginMiddleTitle.innerHTML = loginText;
        loginDiv.appendChild(loginMiddleTitle);
        var createAccountButton = document.createElement("div");
        createAccountButton.className = "exfm_modal_blue_button";
        createAccountButton.innerHTML = "Create Account";
        loginDiv.appendChild(createAccountButton);
        EXFM.Event.add(createAccountButton, "click", EXFM.Login.openCreateAccount);
        EXFM.Event.add(loginClose, "click", EXFM.Login.hideModal);
    },
    hideModal : function(){
        document.body.removeChild(document.getElementById("exfm_modal_login"));
    },
    openSignIn : function(){
        EXFM.Login.popOpen("sign-in");
    },
    openCreateAccount : function(){
        EXFM.Login.popOpen("create-account");
    },
    popOpen : function(url){
        var src = EXFM_WEBSITE+"/"+url+"?client_id=site-player&display=popup";
        var width = 660;
        var height = 375;
        try {
            var left = (screen.width/2)-(width/2);
        } catch(e){
            var left = 330;
        }
        var top = 200;
        EXFM.Login.window = window.open(src, 'loginBox', 'width='+width+',height='+height+',top='+top+',left='+left);
        EXFM.Login.hideModal();
    },
    hide : function(closeWindow){
        EXFM.Login.successFunc = null;
        EXFM.Login.successObj = null;
        if (closeWindow != false){
            EXFM.Login.window.close();
        }
    },
    success : function(type, toParam){
        if(toParam == null && type == 'signedIn'){
            EXFM.Login.window.close();
        }
        try {
            var follow_button = document.getElementById("exfm_follow_button_iframe");
            var src = follow_button.getAttribute("src");
            follow_button.setAttribute("src", src);
        } catch(e){}
        if(EXFM.Love.args){
            EXFM.XD.post(
                {
                    "func" : "LoveSong.love", 
                    "callback" : "EXFM.Love.response", 
                    "args" : [EXFM.Love.args[0], EXFM.Love.args[1], 
                        EXFM.Love.args[2], EXFM.Love.args[3], 
                        EXFM.Love.args[4]
                    ]
                }
            );
            EXFM.Love.args = null;
        }
    },
    error : function(json){
        alert("There was an error signing in to exfm. Please try again");
    }
}
EXFM.PlaylistObj = {
    lastDone : null,
    obj : {},
    add : function(song, replaceHref){
        var r = -1;
        var songHash = hex_md5(song.url);
        if (!EXFM.PlaylistObj.obj[songHash]){
            song.position = EXFM.Playlist.length;
            EXFM.Playlist.push(song);
            EXFM.PlaylistObj.obj[songHash] = song;
        } else {
            for (var i in EXFM.PlaylistObj.obj[songHash]){
                if (EXFM.PlaylistObj.obj[songHash][i] == null){
                    if (song[i] != null){
                         EXFM.PlaylistObj.obj[songHash][i] = song[i];
                    }
                }
            }
        }
        if (replaceHref == true){
            EXFM.PlaylistObj.obj[songHash].source = song.source;
        }
        try {
            r = EXFM.PlaylistObj.obj[songHash].position;
        } catch(e){}
        return r;
    },
    done : function(){
        if (EXFM.Playlist.length > 0){
            EXFM.PageHasSongs = true;
            EXFM.Metadata.request(EXFM.Playlist);
            try {
                var listIcon = document.getElementById("exfm_list_icon_badge");
                listIcon.innerHTML = EXFM.Playlist.length;
            } catch(e){}
            EXFM.Event.fire(window, "exfmPageHasSongs");
        }
    },
    refresh : function(){
        
    }
}
EXFM.Inline = {
    created : {},
    current : null,
    create : function(target, song, position, replace, loved){
        var songHash = hex_md5(song.url);
        if (!EXFM.Inline.created[songHash]) {
            var inlineButton = document.createElement("div");
            inlineButton.setAttribute("id", "exfm_inline_button_"+songHash);
            inlineButton.setAttribute("position", position);
            inlineButton.className = "exfm_inline_button";
            target.parentNode.insertBefore(inlineButton, target);
            if (replace == true){
                target.style.display = "none";  
            }
            var inlineControls = document.createElement("div");
            inlineControls.className = "exfm_inline_button_controls";
            inlineControls.setAttribute("title", "Click to Play");
            EXFM.Event.add(inlineControls, "click", EXFM.Inline.controls.click);
            inlineButton.appendChild(inlineControls);
            var inlineHeart = document.createElement("div");
            inlineHeart.className = "exfm_inline_button_heart";
            if (loved){
                inlineHeart.className = "exfm_inline_button_heart exfm_on"; 
            }
            inlineHeart.setAttribute("title", "Love This Song");
            inlineHeart.setAttribute("id", "exfm_inline_button_heart_"+songHash);
            EXFM.Event.add(inlineHeart, "click", EXFM.Inline.heart.click);
            inlineButton.appendChild(inlineHeart);
            var inlineShare = document.createElement("div");
            inlineShare.className = "exfm_inline_button_share";
            inlineShare.setAttribute("title", "Share This Song");
            inlineShare.setAttribute("id", "exfm_inline_button_heart_"+songHash);
            EXFM.Event.add(inlineShare, "click", EXFM.Inline.share.click);
            inlineButton.appendChild(inlineShare);
            EXFM.Inline.created[songHash] = songHash;
        }
    },
    controls : {
        click : function(e){
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var position = parseInt(parent.getAttribute("position"));
            if (EXFM.Utils.hasClass(parent, 'exfm_playing')){
                EXFM.Player.playPause();
            } else {
                EXFM.Bottom.showFull();
                EXFM.Player.play(position);
                EXFM.List.queueIcon.check(EXFM.Playlist);
            }
        }
    },
    load : function(){
        EXFM.Inline.showPlay();
        try {
            EXFM.Utils.removeClass(EXFM.Inline.current, "exfm_playing");
        } catch(e){}
        try {
            EXFM.Inline.current = document.getElementById("exfm_inline_button_"+hex_md5(this.song.url));
            EXFM.Utils.addClass(EXFM.Inline.current, "exfm_playing"); 
        } catch(e){}
    },
    showPlay : function(){
        try {
            var element = EXFM.Inline.current.childNodes[0];
            EXFM.Utils.removeClass(element, "exfm_paused"); 
        } catch(e){}
    },
    showPause : function(){
        try {
            var element = EXFM.Inline.current.childNodes[0];
            EXFM.Utils.addClass(element, "exfm_paused");
        } catch(e){}
    },
    heart : {
        click : function(e){
            if (e.type == "click"){
                var target = e.target || e.srcElement;
                var parent = target.parentNode;
                var position = parseInt(parent.getAttribute("position"));
                var song = EXFM.Playlist[position];
                if (song && song.id){
                    EXFM.Utils.addClass(parent, "exfm_open");
                    EXFM.Love.request(e, target, song);
                } else {
                    alert("There was a problem. Please try again");
                }
            }
        }
    },
    share : {
        click : function(e){
            var target = e.target || e.srcElement;
            var parent = target.parentNode;
            var position = parseInt(parent.getAttribute("position"));
            if (EXFM.Playlist[position].id){
                EXFM.Bottom.bottomShareIcon.show(EXFM.Playlist[position]);
            }
         }
    }
}
EXFM.CSS = {
    added : false,
    add : function(){
        // import css
        if (typeof(EXFM_HAS_CSS) == "undefined" && EXFM.CSS.added == false){
            EXFM.CSS.added = true;
            var css = document.createElement("link");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("charset", "utf-8");
            css.setAttribute("href", EXFM_CSSHOST+"exfm.css");
            document.body.appendChild(css);
        }
    },
    external : function(){
        if (EXFM.QueryParams.external_css != undefined){
            var css = document.createElement("link");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("charset", "utf-8");
            css.setAttribute("href", EXFM_EXTERNAL_CSSHOST+EXFM.QueryParams.external_css+".css");
            document.body.appendChild(css);
        }
    }
}
EXFM.Bottom = {
    built : false,
    full : false,
    fireShowFullDoneEvent : false,
    player : null,
    parentEl : null,
    eventsAttached : false,
    attachEvents : function(){
        if ( !EXFM.Bottom.eventsAttached ) {
            EXFM.Event.add(document.getElementById("exfm_prev_button"), "click", EXFM.Player.previous);
            EXFM.Event.add(document.getElementById("exfm_play_button"), "click", EXFM.Player.playPause);
            EXFM.Event.add(document.getElementById("exfm_next_button"), "click", EXFM.Player.next);
            EXFM.Event.add(document.getElementById("exfm_resize_handle"), "click", EXFM.Bottom.resizeHandle.click);
            var listIcon = document.getElementById("exfm_list_icon");
            EXFM.Event.add(listIcon, "click", EXFM.List.icon.click);
            EXFM.Event.add(listIcon, "mouseover", EXFM.Tooltip.mouseover);
            EXFM.Event.add(listIcon, "mouseout", EXFM.Tooltip.mouseout);
            var largeShuffle = document.getElementById("exfm_large_shuffle");
            EXFM.Event.add(largeShuffle, "click", EXFM.Player.shuffle);
            EXFM.Event.add(largeShuffle, "mouseover", EXFM.Tooltip.mouseover);
            EXFM.Event.add(largeShuffle, "mouseout", EXFM.Tooltip.mouseout);
            EXFM.Bottom.volume.speaker = document.getElementById("exfm_volume_speaker");
            EXFM.Event.add(EXFM.Bottom.volume.speaker, "click", EXFM.Bottom.volume.speakerClick);
            EXFM.Event.add(EXFM.Bottom.volume.speaker, "mouseover", EXFM.Bottom.volume.mouseOverSpeaker);
            EXFM.Event.add(EXFM.Bottom.volume.speaker, "mouseout", EXFM.Bottom.volume.mouseOutSpeaker);
            EXFM.Event.add(document.getElementById("exfm_display_progress"), "click", EXFM.Bottom.seek.click);
            EXFM.Event.add(document.getElementById("exfm_display_progressed"), "click", EXFM.Bottom.seek.click);
            var largeLove = document.getElementById("exfm_large_love");
            EXFM.Event.add(largeLove, "click", EXFM.Bottom.bottomLoveIcon.click);
            EXFM.Event.add(largeLove, "mouseover", EXFM.Tooltip.mouseover);
            EXFM.Event.add(largeLove, "mouseout", EXFM.Tooltip.mouseout);
            EXFM.Event.add(document.getElementById("exfm_volume_back"), "mouseover", EXFM.Bottom.volume.mouseOverBack);
            EXFM.Event.add(document.getElementById("exfm_volume_back"), "mouseout", EXFM.Bottom.volume.mouseOutBack);
            var largeShare = document.getElementById("exfm_large_share");
            EXFM.Event.add(largeShare, "mouseover", EXFM.Bottom.bottomShareIcon.mouseover);
            EXFM.Event.add(largeShare, "mouseout", EXFM.Bottom.bottomShareIcon.mouseout);
            var shareIcons = EXFM.Utils.getByClass('exfm_song_action_share_icons');
            var shareIcons = EXFM.Utils.getByClass('exfm_song_action_share_icon');
            for (var i = 0; i < shareIcons.length; i++){
                var shareIcon = shareIcons[i];
                EXFM.Event.add(shareIcon, "mouseover", EXFM.Tooltip.mouseover);
                EXFM.Event.add(shareIcon, "mouseout", EXFM.Tooltip.mouseout);
                EXFM.Event.add(shareIcon, "click", EXFM.Bottom.bottomShareIcon.click);
            }
            EXFM.Event.add(document.getElementById("exfm_volume_slider"), "click", EXFM.Bottom.volume.click);
            EXFM.Bottom.seek.thumb = document.getElementById("exfm_display_seek_thumb");
            EXFM.Event.add(EXFM.Bottom.seek.thumb, "mousedown", EXFM.Bottom.seek.mouseDown);
            EXFM.Event.add(EXFM.Bottom.seek.thumb, "mouseup", EXFM.Bottom.seek.mouseUp);
            EXFM.Bottom.volume.thumb = document.getElementById("exfm_volume_thumb");
            EXFM.Event.add(EXFM.Bottom.volume.thumb, "mousedown", EXFM.Bottom.volume.mouseDown);
            EXFM.Event.add(EXFM.Bottom.volume.thumb, "mouseup", EXFM.Bottom.volume.mouseUp);
            EXFM.Bottom.display.progressBar = document.getElementById("exfm_display_progressed");
            EXFM.Utils.removeClass(document.getElementById("exfm_bottom_player"), "exfm_before_load");
            var popoutButton = document.getElementById("exfm_popout_button");
            if ( popoutButton ) {
                EXFM.Event.add(popoutButton, "click", EXFM.Popout.click);
                EXFM.Event.add(popoutButton, "mouseover", EXFM.Tooltip.mouseover);
                EXFM.Event.add(popoutButton, "mouseout", EXFM.Tooltip.mouseout);
            }
            EXFM.Bottom.display.showFirstSong();
            EXFM.Bottom.eventsAttached = true;
        }
    },
    build : function(e, shouldAttachEvents){
        var exfmBottomPlayer = document.getElementById("exfm_bottom_player");
        if (exfmBottomPlayer != null){
            // create body
            var bottomPlayer = document.createElement("div");
            bottomPlayer.setAttribute("id", "exfm_bottom_player");
            bottomPlayer.className = "init exfm_bottom_player_hidden exfm_before_load";
            if (EXFM.QueryParams.bg_image != undefined){
                bottomPlayer.style.backgroundImage = "url("+unescape(EXFM.QueryParams.bg_image)+")";
            }
            if (EXFM.QueryParams.bg_color != undefined){
                bottomPlayer.style.background = "#"+EXFM.QueryParams.bg_color;
            }
            // create control buttons
            var bottomControls = document.createElement("div");
            bottomControls.setAttribute("id", "exfm_bottom_controls");
            bottomPlayer.appendChild(bottomControls);
            var prevButton = document.createElement("div");
            prevButton.setAttribute("id", "exfm_prev_button");
            prevButton.className = "exfm_controls_button";
            bottomControls.appendChild(prevButton);
            var playButton = document.createElement("div");
            playButton.setAttribute("id", "exfm_play_button");
            playButton.setAttribute("title", "Click to play music");
            playButton.className = "exfm_controls_button exfm_play_button";
            bottomControls.appendChild(playButton);
            var nextButton = document.createElement("div");
            nextButton.setAttribute("id", "exfm_next_button");
            nextButton.className = "exfm_controls_button";
            bottomControls.appendChild(nextButton);
            // create left handle div
            var resizeHandle = document.createElement("div");
            resizeHandle.setAttribute("id", "exfm_resize_handle");
            resizeHandle.setAttribute("title", "Maximize player");
            bottomPlayer.appendChild(resizeHandle);
            // create playlist button 
            var listButton = document.createElement("div");
            listButton.setAttribute("id", "exfm_list_icon");
            listButton.setAttribute("tooltip", "Show Playlist");
            bottomPlayer.appendChild(listButton);
            var listButtonBadge = document.createElement("div");
            listButtonBadge.setAttribute("id", "exfm_list_icon_badge");
            listButtonBadge.setAttribute("tooltip", "Show Playlist");
            listButton.appendChild(listButtonBadge);
            if (EXFM.Playlist.length > 0){
                listButtonBadge.innerHTML = EXFM.Playlist.length;
            }
			// add shuffle button
            var bottomShuffleIcon = document.createElement("div");
            bottomShuffleIcon.setAttribute("id", "exfm_large_shuffle");
            bottomShuffleIcon.setAttribute("tooltip", "Shuffle Songs");
            bottomPlayer.appendChild(bottomShuffleIcon);
            // attach popout button 
            if (typeof(EXFM_HAS_EXTENSION) == "undefined"){
                var popoutButton = document.createElement("div");
                popoutButton.setAttribute("id", "exfm_popout_button");
                popoutButton.setAttribute("tooltip", "Open in New Window");
                bottomPlayer.appendChild(popoutButton);
            }
            // create volume speaker
            EXFM.Bottom.volume.speaker = document.createElement("div");
            EXFM.Bottom.volume.speaker.setAttribute("id", "exfm_volume_speaker");
            EXFM.Bottom.volume.speaker.className = "exfm_volume_on";
            bottomPlayer.appendChild(EXFM.Bottom.volume.speaker);
            // create display
            var bottomDisplay = document.createElement("div");
            bottomDisplay.setAttribute("id", "exfm_display");
            if (EXFM.QueryParams.display_color != undefined){
                bottomDisplay.style.background = "#"+EXFM.QueryParams.display_color;
            }
            bottomPlayer.appendChild(bottomDisplay);
            // display inner song container
            var bottomDisplaySongContainer = document.createElement("div");
            bottomDisplaySongContainer.setAttribute("id", "exfm_display_song_container");
            bottomDisplay.appendChild(bottomDisplaySongContainer);
            // coverart
            var bottomDisplayCoverArt = document.createElement("div");
            bottomDisplayCoverArt.setAttribute("id", "exfm_coverart");
            bottomDisplayCoverArt.className = "exfm_hide_when_stopped";
            bottomDisplaySongContainer.appendChild(bottomDisplayCoverArt);
            var bottomDisplayCoverArtGlare = document.createElement("img");
            bottomDisplayCoverArtGlare.setAttribute("id", "exfm_coverart_glare");
            bottomDisplayCoverArtGlare.setAttribute("width", "30");
            bottomDisplayCoverArtGlare.setAttribute("height", "30");
            bottomDisplayCoverArtGlare.setAttribute("src", EXFM_IMGHOST+"glare_45x45.png");
            bottomDisplayCoverArt.appendChild(bottomDisplayCoverArtGlare);
            // text
            var bottomDisplayText = document.createElement("div");
            bottomDisplayText.setAttribute("id", "exfm_display_text");
            bottomDisplayText.className = "exfm_hide_when_stopped";
            bottomDisplaySongContainer.appendChild(bottomDisplayText);
            var bottomDisplayPost = document.createElement("a");
            bottomDisplayPost.setAttribute("target", "_blank");
            bottomDisplayPost.setAttribute("id", "exfm_display_post");
            bottomDisplayPost.appendChild(document.createTextNode("Read Post"));
            bottomDisplayText.appendChild(bottomDisplayPost);
            var bottomDisplaySong = document.createElement("a");
            bottomDisplaySong.setAttribute("target", "_blank");
            bottomDisplaySong.setAttribute("id", "exfm_display_song");
            bottomDisplaySong.onclick = EXFM.List.songtitle.click;
            bottomDisplayText.appendChild(bottomDisplaySong);
            var bottomDisplayArtist = document.createElement("a");
            bottomDisplayArtist.setAttribute("target", "_blank");
            bottomDisplayArtist.setAttribute("id", "exfm_display_artist");
            bottomDisplayArtist.onclick = EXFM.List.artist.click;
            bottomDisplayText.appendChild(bottomDisplayArtist);
            var bottomDisplayTime = document.createElement("div");
            bottomDisplayTime.setAttribute("id", "exfm_display_time");
            bottomDisplayTime.className = "exfm_hide_when_stopped";
            bottomDisplaySongContainer.appendChild(bottomDisplayTime);
            var bottomDisplayTimeCount = document.createElement("div");
            bottomDisplayTimeCount.setAttribute("id", "exfm_display_time_count");
            bottomDisplayTimeCount.appendChild(document.createTextNode("0:00"));
            bottomDisplayTime.appendChild(bottomDisplayTimeCount);
            var bottomDisplayTimeProgress = document.createElement("div");
            bottomDisplayTimeProgress.setAttribute("id", "exfm_display_progress");
            bottomDisplayTime.appendChild(bottomDisplayTimeProgress);
            EXFM.Bottom.display.progressBar = document.createElement("div");
            EXFM.Bottom.display.progressBar.setAttribute("id", "exfm_display_progressed");
            bottomDisplayTime.appendChild(EXFM.Bottom.display.progressBar);
            EXFM.Bottom.seek.thumb = document.createElement("div");
            EXFM.Bottom.seek.thumb.setAttribute("id", "exfm_display_seek_thumb");
            bottomDisplayTime.appendChild(EXFM.Bottom.seek.thumb);
            var bottomDisplayTimeTotal = document.createElement("div");
            bottomDisplayTimeTotal.setAttribute("id", "exfm_display_time_total");
            bottomDisplayTimeTotal.appendChild(document.createTextNode("0:00"));
            bottomDisplayTime.appendChild(bottomDisplayTimeTotal);
            if (EXFM.QueryParams.font_color != undefined){
                bottomDisplayText.style.color = "#"+EXFM.QueryParams.font_color;
                bottomDisplaySong.style.color = "#"+EXFM.QueryParams.font_color;
                bottomDisplayArtist.style.color = "#"+EXFM.QueryParams.font_color;
                bottomDisplayTimeCount.style.color = "#"+EXFM.QueryParams.font_color;
                bottomDisplayTimeTotal.style.color = "#"+EXFM.QueryParams.font_color;
            }
            var bottomLoveIcon = document.createElement("div");
            bottomLoveIcon.setAttribute("id", "exfm_large_love");
            bottomLoveIcon.setAttribute("tooltip", "Love This Song");
            bottomLoveIcon.className = "exfm_hide_when_stopped";
            bottomDisplay.appendChild(bottomLoveIcon);
			var bottomShareIcon = document.createElement("div");
            bottomShareIcon.setAttribute("id", "exfm_large_share");
            bottomShareIcon.setAttribute("tooltip", "Share This Song");
            bottomShareIcon.className = "exfm_hide_when_stopped";
            bottomDisplay.appendChild(bottomShareIcon);
            // share icons
            var playerShareIcons = document.createElement("div");
            playerShareIcons.setAttribute("id", "exfm_player_share_icons");
            var playerShareIconTumblr = document.createElement("div");
            playerShareIconTumblr.className = "exfm_song_action_share_icon exfm_song_action_share_icon_tumblr";
            playerShareIconTumblr.setAttribute('data-service', "tumblr");
            playerShareIconTumblr.setAttribute("tooltip", "Tumblr");
            playerShareIcons.appendChild(playerShareIconTumblr);
            var playerShareIconTwitter = document.createElement("div");
            playerShareIconTwitter.className = "exfm_song_action_share_icon exfm_song_action_share_icon_twitter";
            playerShareIconTwitter.setAttribute('data-service', "twitter");
            playerShareIconTwitter.setAttribute("tooltip", "Twitter");
            playerShareIcons.appendChild(playerShareIconTwitter);
            var playerShareIconFacebook = document.createElement("div");
            playerShareIconFacebook.className = "exfm_song_action_share_icon exfm_song_action_share_icon_facebook";
            playerShareIconFacebook.setAttribute('data-service', "facebook");
            playerShareIconFacebook.setAttribute("tooltip", "Facebook");
            playerShareIcons.appendChild(playerShareIconFacebook);
            var playerShareIconEmail = document.createElement("div");
            playerShareIconEmail.className = "exfm_song_action_share_icon exfm_song_action_share_icon_email";
            playerShareIconEmail.setAttribute('data-service', "email");
            playerShareIconEmail.setAttribute('tooltip', "Email");
            playerShareIcons.appendChild(playerShareIconEmail);            
            bottomShareIcon.appendChild(playerShareIcons);
            // create logo 
            var logoLink = document.createElement("a");
            logoLink.setAttribute("id", "exfm_logo_link");
            if ( EXFM.CurrentSite === null ) {
                EXFM.CurrentSite = location.href.replace("http://", "");
            }
            logoLink.setAttribute("href", EXFM_WEBSITE+"/site/"+EXFM.CurrentSite+EXFM_REF_FROM);
            logoLink.setAttribute("target", "_blank");
            bottomPlayer.appendChild(logoLink);
            if (EXFM.QueryParams.parent_el == undefined){
                document.body.appendChild(bottomPlayer);
            } else {
                if (document.getElementById(EXFM.QueryParams.parent_el) != null){
                    EXFM.Bottom.parentEl = document.getElementById(EXFM.QueryParams.parent_el);
                    EXFM.Bottom.parentEl.appendChild(bottomPlayer); 
                    if (EXFM.QueryParams.stick_top == "true"){
                        var stickTop = EXFM.Utils.debounce(EXFM.Utils.stickTop, 10);
                        try {
                            document.addEventListener("scroll", stickTop, false);
                        } catch(e){
                            try {
                                document.attachEvent("scroll", stickTop);
                            } catch(er){}
                        }
                    }
                } else {
                    document.body.appendChild(bottomPlayer);
                }
            }
            // attach list container 
            EXFM.List.container = document.createElement("div");
            EXFM.List.container.setAttribute("id", "exfm_list_container");
            document.body.appendChild(EXFM.List.container);
            // attach volume slider
            EXFM.Bottom.volume.back = document.createElement("div");
            EXFM.Bottom.volume.back.setAttribute("id", "exfm_volume_back");
            if (EXFM.QueryParams.bg_color != undefined){
                EXFM.Bottom.volume.back.style.background = "#"+EXFM.QueryParams.bg_color;
            }
            document.body.appendChild(EXFM.Bottom.volume.back);
            var volumeSlider = document.createElement("div");
            volumeSlider.setAttribute("id", "exfm_volume_slider");
            EXFM.Bottom.volume.back.appendChild(volumeSlider);
            EXFM.Bottom.volume.thumb = document.createElement("div");
            EXFM.Bottom.volume.thumb.setAttribute("id", "exfm_volume_thumb");
            volumeSlider.appendChild(EXFM.Bottom.volume.thumb);
            // tooltip 
            EXFM.Tooltip.container = document.createElement("div");
            EXFM.Tooltip.container.setAttribute("id", "exfm_tooltip_display");
            document.body.appendChild(EXFM.Tooltip.container);
            if ( EXFM.QueryParams.bottom_full == "true" ) {
                EXFM.Bottom.full = true;
            }
            
            // attach events
            setTimeout(EXFM.Utils.setSizes, 500);
            setTimeout(EXFM.Bottom.volume.setPosition, 750);
            EXFM.Bottom.built = true;
		    // slide up init player (remove hidden class)
			setTimeout(function(){
			    EXFM.Utils.removeClass(bottomPlayer, "exfm_bottom_player_hidden");
				EXFM.Event.fire(window, "exfmPlayerBuilt");
            }, 100);
            EXFM.Bottom.player = bottomPlayer;
            if (shouldAttachEvents == true){
                EXFM.Bottom.attachEvents();
            }
        }
    },
    hide : function(){
        EXFM.List.hide(false);
        var bottomPlayer = document.getElementById("exfm_bottom_player");
        bottomPlayer.style.width = "145px";
        EXFM.Utils.addClass(bottomPlayer, "init");
        EXFM.Bottom.controls.playPauseButton.showPlay();
        EXFM.Utils.removeClass(EXFM.Inline.current, "exfm_playing");
        EXFM.Inline.showPlay();
        EXFM.Player.loaded = false;
        EXFM.Player.pause();
        var hideElements = EXFM.Utils.getByClass('exfm_hide_when_stopped');
        EXFM.Utils.addClass(hideElements, "exfm_hidden");
        EXFM.Utils.removeClass(hideElements, "exfm_visible");
        var showElements = EXFM.Utils.getByClass('exfm_hide_when_playing');
        EXFM.Utils.addClass(showElements, "exfm_visible");
        EXFM.Utils.removeClass(showElements, "exfm_hidden");
        EXFM.Bottom.full = false;
    },
    showFull : function(){
        var bottomPlayer = document.getElementById("exfm_bottom_player");
        EXFM.Bottom.fireShowFullDoneEvent = true;
        EXFM.Utils.transitionEvent(bottomPlayer, EXFM.Bottom.showFullDone, 500);
        EXFM.Utils.removeClass(bottomPlayer, "init");
    },
    showFullDone : function(){
        if (EXFM.Bottom.fireShowFullDoneEvent == true){
            EXFM.Bottom.fireShowFullDoneEvent = false;
            EXFM.Utils.setSizes();
            EXFM.Bottom.full = true;
            EXFM.Event.fire(window, "exfmBottomShowFull");
        }
    },
    resizeHandle : {
        fireShowEvent : false,
        fireHideEvent : false,
        click : function(e){
            if (EXFM.Bottom.full == true){
                EXFM.Bottom.resizeHandle.hide();
            } else {
                EXFM.Bottom.resizeHandle.show();
            }
        },
        show : function(){
            var bottomPlayer = document.getElementById("exfm_bottom_player");
            EXFM.Bottom.resizeHandle.fireShowEvent = true;
            EXFM.Utils.transitionEvent(bottomPlayer, EXFM.Bottom.resizeHandle.showDone, 500);
            EXFM.Utils.removeClass(bottomPlayer, "init");
        },
        showDone : function(){
            if (EXFM.Bottom.resizeHandle.fireShowEvent == true){
                EXFM.Bottom.resizeHandle.fireShowEvent = false;
                EXFM.Utils.setSizes();
                EXFM.Bottom.full = true;
                document.getElementById("exfm_resize_handle").setAttribute("title", "Minimize player");
            }
        },
        hide : function(){
            EXFM.List.hide(false);
            var bottomPlayer = document.getElementById("exfm_bottom_player");
            EXFM.Bottom.resizeHandle.fireHideEvent = true;
            EXFM.Utils.transitionEvent(bottomPlayer, EXFM.Bottom.resizeHandle.hideDone, 500);
            EXFM.Utils.addClass(bottomPlayer, "init");
        },
        hideDone : function(){
            if (EXFM.Bottom.resizeHandle.fireHideEvent == true){
                EXFM.Bottom.resizeHandle.fireHideEvent = false;
                EXFM.Bottom.full = false;
                document.getElementById("exfm_resize_handle").setAttribute("title", "Maximize player");
            }
        }
    },
    controls : {
        playPauseButton : {
            showPlay : function(){
                var playButton = document.getElementById("exfm_play_button");
                playButton.className = "exfm_controls_button exfm_play_button";
                try {
            	   EXFM.Utils.addClass(EXFM.CurrentPlaylistPlayButton, "exfm_paused");
                } catch(e){}
            },
            showPause : function(){
                var playButton = document.getElementById("exfm_play_button");
                playButton.className = "exfm_controls_button exfm_pause_button";
                EXFM.Utils.removeClass(EXFM.CurrentPlaylistPlayButton, "exfm_paused");
            }
        }
    },
    display : {
        progressBar : null,
        progressWidth : null,
        progressLeft : null,
        progressRight : null,
        fireStopDoneEvent : false,
        load : function(){
            EXFM.Utils.setSizes();
            EXFM.Bottom.display.showSong(this.song);
            var progress = document.getElementById("exfm_display_progress");
            EXFM.Utils.addClass(progress, "exfm_display_progress_loading");
            EXFM.Utils.addClass(EXFM.Bottom.display.progressBar, "exfm_hidden");
            EXFM.Utils.addClass(EXFM.Bottom.seek.thumb, "exfm_hidden");
            try {
            	EXFM.Utils.removeClass(EXFM.CurrentPlaylistPlayButton, "exfm_playing");
            	EXFM.Utils.removeClass(EXFM.CurrentPlaylistPlayButton.parentNode, "exfm_playing");
            } catch(er){}
            EXFM.CurrentPlaylistPlayButton = document.getElementById("exfm_current_playlist_play_button_"+EXFM.Player.queueNumber);
            if ( EXFM.CurrentPlaylistPlayButton ) {
                EXFM.Utils.addClass(EXFM.CurrentPlaylistPlayButton, "exfm_playing");
                EXFM.Utils.addClass(EXFM.CurrentPlaylistPlayButton.parentNode, "exfm_playing");
            }
        },
        showSong : function(song) {
            EXFM.Player.song = song;
            var hideElements = EXFM.Utils.getByClass('exfm_hide_when_playing');
            EXFM.Utils.addClass(hideElements, "exfm_hidden");
            EXFM.Utils.removeClass(hideElements, "exfm_visible");
            var showElements = EXFM.Utils.getByClass('exfm_hide_when_stopped');
            EXFM.Utils.addClass(showElements, "exfm_visible");
            EXFM.Utils.removeClass(showElements, "exfm_hidden");
            var currentPlaylistSongtitle = document.getElementById("exfm_display_song")
            if (EXFM.Utils.hasValue(song.id) == true){
                currentPlaylistSongtitle.setAttribute("href", EXFM_WEBSITE+"/song/"+song.id+EXFM_REF_FROM);
            } else {
                currentPlaylistSongtitle.removeAttribute("href");
            }
            var displayTitle = song.title;
            if(!song.title){
                if(song.user_love && song.user_love.comment){
                    displayTitle = song.user_love.comment.replace(/(<([^>]+)>)/ig,"");
                }
            };
            currentPlaylistSongtitle.innerHTML = EXFM.Utils.blankUndefined(displayTitle, "Unknown Title");
            var currentPlaylistArtist = document.getElementById("exfm_display_artist")
            if (EXFM.Utils.hasValue(song.artist) == true){
                currentPlaylistArtist.setAttribute("href", EXFM_WEBSITE+"/search/"+song.artist+EXFM_REF_FROM);
            } else {
                currentPlaylistArtist.removeAttribute("href");
            }
            currentPlaylistArtist.innerHTML = EXFM.Utils.blankUndefined(song.artist, "Unknown Artist");
            document.getElementById("exfm_display_post").setAttribute("href", song.user_love_source || song.source);
            document.getElementById("exfm_coverart").style.background = EXFM.Utils.getCoverart(song.image.small, 32);
            document.getElementById("exfm_display_time_count").innerHTML = "0:00";
            document.getElementById("exfm_display_time_total").innerHTML = "0:00";
            var loveIcon = document.getElementById("exfm_large_love");
            if (song.viewer_love != null){
                EXFM.Utils.addClass(loveIcon, "exfm_on");
            } else {
                EXFM.Utils.removeClass(loveIcon, "exfm_on");
            };
            if ( EXFM.QueryParams.user == "stereogum" ) {
                currentPlaylistSongtitle.setAttribute("href", song.user_love_source || song.source);
                currentPlaylistArtist.setAttribute("href", "/tag/"+song.artist.replace(/ /g, "-"));
            }
        },
        canplay : function(){
            var progress = document.getElementById("exfm_display_progress");
            EXFM.Utils.removeClass(progress, "exfm_display_progress_loading");
            EXFM.Utils.removeClass(EXFM.Bottom.display.progressBar, "exfm_hidden");
            EXFM.Utils.removeClass(EXFM.Bottom.seek.thumb, "exfm_hidden");
            EXFM.Bottom.seek.thumb.style.left = (EXFM.Bottom.display.progressWidth * 0) + "px"; 
            EXFM.Bottom.display.progressBar.style.width = (EXFM.Bottom.display.progressWidth * 0) + "px";
        },
        currentTime : function(){
            try {
                var currentTime = EXFM.Utils.mmss(Math.floor(this.currentTime));
                document.getElementById("exfm_display_time_count").innerHTML = currentTime;
                var duration = EXFM.Utils.mmss(Math.floor(this.duration));
                document.getElementById("exfm_display_time_total").innerHTML = duration;
                var percentage = this.currentTime / this.duration;
                if (EXFM.Bottom.seek.isSeeking == false) {
		            if ((EXFM.Bottom.display.progressWidth * percentage) > 0){
		                EXFM.Bottom.seek.thumb.style.left = (EXFM.Bottom.display.progressWidth * percentage) + "px";
		            }
		            EXFM.Bottom.display.progressBar.style.width = (EXFM.Bottom.display.progressWidth * percentage) + "px";
	            }
             } catch(e){}
        },
        stop : function(){
            try {
                EXFM.Utils.removeClass(EXFM.Inline.current, "exfm_playing");
            } catch(e){};
            EXFM.Player.loaded = false;
            var bottomPlayer = document.getElementById("exfm_bottom_player");
            EXFM.Bottom.fireStopDoneEvent = true;
            EXFM.Utils.transitionEvent(bottomPlayer, EXFM.Bottom.display.stopDone, 500);
            EXFM.Utils.addClass(bottomPlayer, "init");
            EXFM.List.hide(false);
        },
        stopDone : function(){
            if (EXFM.Bottom.fireStopDoneEvent == true){
                EXFM.Bottom.fireStopDoneEvent = false;
                EXFM.Utils.setSizes();
                var hideElements = EXFM.Utils.getByClass('exfm_hide_when_stopped');
                EXFM.Utils.addClass(hideElements, "exfm_hidden");
                EXFM.Utils.removeClass(hideElements, "exfm_visible");
                var showElements = EXFM.Utils.getByClass('exfm_hide_when_playing');
                EXFM.Utils.addClass(showElements, "exfm_visible");
                EXFM.Utils.removeClass(showElements, "exfm_hidden");
            }
        },
        showFirstSong : function(){
            var song = EXFM.Playlist[0];
            if (song) {
                EXFM.Bottom.display.showSong(song);
            }
        }
    },
    seek : {
        isSeeking : false,
        thumb : null,
        percentage : null,
        mouseDown : function(e){
			EXFM.Event.add(document, 'mousemove', EXFM.Bottom.seek.mouseMove);
			EXFM.Event.add(document, 'mouseup', EXFM.Bottom.seek.mouseUp);
			EXFM.Bottom.seek.isSeeking = true;
			try {
                e.preventDefault();
            } catch(er){}
        },
		mouseUp : function(e){
			EXFM.Event.remove(document, 'mousemove', EXFM.Bottom.seek.mouseMove);
			EXFM.Event.remove(document, 'mouseup', EXFM.Bottom.seek.mouseUp);
			EXFM.Bottom.seek.isSeeking = false;
			EXFM.Player.seek(Math.floor(EXFM.Bottom.seek.percentage * 100));
		},
		mouseMove : function(e){
			var x = e.clientX;
			try {
				if (x < EXFM.Bottom.display.progressLeft){
					x = EXFM.Bottom.display.progressLeft;
				}
				if (x > EXFM.Bottom.display.progressRight){
					x = EXFM.Bottom.display.progressRight;
				}
				var seekLeft = x - EXFM.Bottom.display.progressLeft;
				EXFM.Bottom.seek.thumb.style.left = (seekLeft) + "px";
				EXFM.Bottom.display.progressBar.style.width =  seekLeft + "px";
				EXFM.Bottom.seek.percentage = seekLeft / EXFM.Bottom.display.progressWidth;
			} catch (e){}
		},
		click : function(e){
			EXFM.Bottom.seek.mouseMove(e);
			EXFM.Player.seek(Math.floor(EXFM.Bottom.seek.percentage * 100));
        },
		showLoading : function(){
            var progress = document.getElementById("exfm_display_progress");
            EXFM.Utils.addClass(progress, "exfm_display_progress_loading");
		},
		hideLoading : function(){
            var progress = document.getElementById("exfm_display_progress");
            EXFM.Utils.removeClass(progress, "exfm_display_progress_loading");
		}
    },
	bottomLoveIcon : {
		click : function(e){
            var target = e.target || e.srcElement;
            if (e.type == "click" && target.id == "exfm_large_love") {
                var song = EXFM.Player.song;
                if (song && song.id){
                    var loveIcon = document.getElementById("exfm_large_love");
                    EXFM.Love.request(e, loveIcon, song);
                } else {
                    alert("There was a problem. Please try again");
                }
            }
        }
	},
	bottomShareIcon : {
        window : null,
        song : null,
        popupSize : {
            facebook : {
            'width': 640,
            'height': 355
            },
            twitter : {
                'width': 640,
                'height': 411
            },
            tumblr : {
                'width': 420,
                'height': 350
            },
            email : {
                'width': 420,
                'height': 350
            }
        },
        click : function(e){
            var service = e.target.getAttribute('data-service');
            if(EXFM.Bottom.bottomShareIcon.song.id){
                var src = EXFM_WEBSITE+"/sharer/"+service+'/'+EXFM.Bottom.bottomShareIcon.song.id;
                var left = 300;
                try {
                    left = (screen.width/2)-(EXFM.Bottom.bottomShareIcon.popupSize[service].width/2);
                } catch(e){}
                var top = 200;
                EXFM.Bottom.bottomShareIcon.window  = window.open(src, 'sharerBox', 
                    'width='+EXFM.Bottom.bottomShareIcon.popupSize[service].width+',height='+EXFM.Bottom.bottomShareIcon.popupSize[service].height+',top='+top+',left='+left);
            }
	    },
	    show : function(song){
            var src = EXFM_WEBSITE+"/share/"+song.id;
            var data = {};
            if ( EXFM.QueryParams.twitter ){
                data.twitter_via = EXFM.QueryParams.twitter;
            }
            if ( EXFM.QueryParams.user && EXFM.QueryParams.user == "stereogum" ){
                if ( song.user_love_source ) {
                    data.link_url = song.user_love_source;
                } else {
                    data.link_url = location.href;
                }
                data.link_text = "via Stereogum";
            }
            var params = EXFM.Utils.makeQueryParams(data);
            if ( params != "" ) {
                src += "?"+params;
            }
            var width = 420;
            var height = 350;
            try {
                var left = (screen.width/2)-(width/2);
            } catch(e){
                var left = 300;
            }
            var top = 200;
            EXFM.Bottom.bottomShareIcon.window = window.open(src, 'shareBox', 'width='+width+',height='+height+',top='+top+',left='+left);
	   },
	   hide : function(){
            try {
                EXFM.Bottom.bottomShareIcon.window.close();
            } catch(e){}
	   },
	   response : function(e){
	       
	   },
	   mouseover : function(e){
	       EXFM.Player.getSong("EXFM.Bottom.bottomShareIcon.gotSong");
    	   var display = document.getElementById('exfm_display');
    	   display.addEventListener('webkitTransitionEnd', EXFM.Utils.setSizes);
    	   display.addEventListener('transitionend', EXFM.Utils.setSizes);
    	   EXFM.Utils.addClass(display, 'exfm_display_share');
	   },
	   mouseout : function(){
    	   var display = document.getElementById('exfm_display');
    	   display.addEventListener('webkitTransitionEnd', EXFM.Utils.setSizes);
    	   display.addEventListener('transitionend', EXFM.Utils.setSizes);
    	   EXFM.Utils.removeClass(display, 'exfm_display_share');
	   },
	   gotSong : function(song){
    	   EXFM.Bottom.bottomShareIcon.song = song;
	   }
	},
	loveDialogTextarea : {
		loveDialog : document.getElementById("exfm_love_dialog"),
		focus : function(e){
			// text area focused 
		}, 
		keyup : function(e){
			if(e.target.value.length >= 1){
				var loveDialog = document.getElementById("exfm_love_dialog");
				loveDialog.className = "exfm_love_over exfm_love_comment";
			}
		}
	},
    volume : {
        thumb : null,
        volumeHeight : null,
        volumeTop : null,
        volumeBottom : null,
        speaker : null,
        back : null,
        mouseMoving : false,
        speakerClick : function(e){
            if (EXFM.Utils.hasClass(EXFM.Bottom.volume.speaker, 'exfm_volume_on') == true){
                EXFM.Bottom.volume.mouseMove(e, 42);
            } else {
                EXFM.Bottom.volume.mouseMove(e, -3);
            }
        },
        mouseDown : function(e){
            EXFM.Event.add(document, 'mousemove', EXFM.Bottom.volume.mouseMove);
			EXFM.Event.add(document, 'mouseup', EXFM.Bottom.volume.mouseUp);
			EXFM.Utils.addClass(EXFM.Bottom.volume.thumb, "exfm_volume_thumb_active");
			try {
                e.preventDefault();
            } catch(er){}
        },
        mouseUp : function(e){
            EXFM.Event.remove(document, 'mousemove', EXFM.Bottom.volume.mouseMove);
			EXFM.Event.remove(document, 'mouseup', EXFM.Bottom.volume.mouseUp);
			EXFM.Utils.removeClass(EXFM.Bottom.volume.thumb, "exfm_volume_thumb_active");
			EXFM.Bottom.volume.mouseMoving = false;
			setTimeout(EXFM.Bottom.volume.hide, 5000);
        },
        mouseMove : function(e, t){
            EXFM.Bottom.volume.mouseMoving = true;
            if (t == undefined){
                var y = e.clientY;
                try {
    				if (y < EXFM.Bottom.volume.volumeTop - 3){
    					y = EXFM.Bottom.volume.volumeTop - 3;
    				}
    				if (y > EXFM.Bottom.volume.volumeBottom - 10){
    					y = EXFM.Bottom.volume.volumeBottom - 10;
    				}
    				var top = y - EXFM.Bottom.volume.volumeTop;
				} catch (e){}
            } else {
                var top = t;
            }
            var volume = (top  / (EXFM.Bottom.volume.volumeHeight - 10))*-1+1;
            EXFM.Bottom.volume.thumb.style.top = (top) + "px";
			if (volume > 1){
			    volume = 1;
			}
			if (volume < 0){
			    volume = 0;
			}
			EXFM.Player.setVolume(volume);
			if (volume == 0){
			    EXFM.Utils.removeClass(EXFM.Bottom.volume.speaker, 'exfm_volume_on');
	            EXFM.Utils.addClass(EXFM.Bottom.volume.speaker, 'exfm_volume_off');
			} else {
			    EXFM.Utils.removeClass(EXFM.Bottom.volume.speaker, 'exfm_volume_off');
			    EXFM.Utils.addClass(EXFM.Bottom.volume.speaker, 'exfm_volume_on');
			}
        },
        click : function(e){
            EXFM.Bottom.volume.mouseMove(e);
            EXFM.Bottom.volume.mouseMoving = false;
        },
        mouseOverTimeout : null,
        mouseOverSpeaker : function(e){
            clearTimeout(EXFM.Bottom.volume.mouseOverTimeout);
            EXFM.Bottom.volume.setPosition();
            EXFM.Utils.addClass(EXFM.Bottom.volume.back, "exfm_volume_over");
            EXFM.Utils.setSizes();
        },
        mouseOutSpeaker : function(e){
            EXFM.Bottom.volume.hide();
        },
        mouseOverBack : function(e){
            clearTimeout(EXFM.Bottom.volume.mouseOverTimeout);
            EXFM.Utils.addClass(EXFM.Bottom.volume.back, "exfm_volume_over");
        },
        mouseOutBack : function(e){
            EXFM.Bottom.volume.hide();
        },
        hide : function(){
            if (EXFM.Bottom.volume.mouseMoving == false){
                EXFM.Bottom.volume.mouseOverTimeout = setTimeout(function(){
                    //EXFM.Bottom.volume.back.className = "";
                    EXFM.Utils.removeClass(EXFM.Bottom.volume.back, "exfm_volume_over");
                }, 1000);
            }
        },
        setPosition : function(){
            var volumeSpeaker = document.getElementById("exfm_volume_speaker");
            if (EXFM.QueryParams.parent_el != undefined){
                var left = EXFM.Utils.getLeft(volumeSpeaker);
                var top = EXFM.Utils.getTop(EXFM.Bottom.parentEl);
                if ( top < 0 ) {
                    top = 0;
                };
                if ( EXFM.QueryParams.volume == "below") {
                    top += EXFM.Bottom.player.offsetHeight;
                } else {
                    top -= EXFM.Bottom.volume.back.offsetHeight;
                }
                EXFM.Bottom.volume.back.style.top = top+'px';
                EXFM.Bottom.volume.back.style.left = left+'px';
            }
        }
    }
}
EXFM.Love = {
    args : null,
    request : function(e, target, song){
        if (e.type == "click"){
            EXFM.Utils.addClass(target, "exfm_loading");
            var loveBool = true;
            var context = null;
            var source = song.source;
            if (EXFM.Utils.hasClass(target, 'exfm_on') == true){
                loveBool = false;
                if (EXFM.QueryParams.user){
                    context = EXFM.QueryParams.user;
                }
            }
            EXFM.XD.post(
                {
                    "func" : "LoveSong.love", 
                    "callback" : "EXFM.Love.response", 
                    "args" : [song, loveBool, context, source, "exfm_site_player"]
                }
            );
        }
    },
    response : function(song){
        var loveIcon = document.getElementById("exfm_large_love");
        EXFM.Utils.removeClass(loveIcon, "exfm_loading");
        if(this.status == 200 || this.status == 400){
            try {
                if (song.id == EXFM.Player.song.id){
                    if (song.viewer_love){
                        EXFM.Utils.addClass(loveIcon, "exfm_on");
                    } else {
                        EXFM.Utils.removeClass(loveIcon, "exfm_on");
                    }		      
                }
            } catch(e){}
            try {
                var smallLoveIcon = document.getElementById("exfm_list_love_"+song.id);
                if (song.viewer_love){
                    EXFM.Utils.addClass(smallLoveIcon, "exfm_on");
                } else {
                    EXFM.Utils.removeClass(smallLoveIcon, "exfm_on");
                }
            } catch(e){}
            var len = EXFM.Playlist.length;
            for (var i = 0; i < len; i++){
                var playlistSong = EXFM.Playlist[i];
                if (playlistSong.id == song.id){
                    playlistSong.viewer_love = song.viewer_love;
                    try {
                        var songHash = hex_md5(playlistSong.url);
                        var inlineHeart = document.getElementById("exfm_inline_button_heart_"+songHash);
                        if (song.viewer_love){
                            EXFM.Utils.addClass(inlineHeart, "exfm_on");
                            inlineHeart.setAttribute("title", "Loved");
                        } else {
                            EXFM.Utils.removeClass(inlineHeart, "exfm_on");
                            inlineHeart.setAttribute("title", "Love This Song");
                        }
                        EXFM.Utils.removeClass(inlineHeart.parentNode, "exfm_open");
                    } catch(e){}
                }
            }
        }
        if(this.status == 401){
            EXFM.Love.args = this.args;
            EXFM.Login.show("Create a free exfm account to love songs");
        }
    }
}
EXFM.Player = {
    queueNumber : 0,
    song : 0,
    oldListLength : 0,
    loaded : false,
    actions : [
        {
            'eventName': "timeupdate",
            'listener': "EXFM.Bottom.display.currentTime",
            'root': "exAudio"
        },
        {
            'eventName': "loading",
            'listener': "EXFM.Player.loading",
            'root': "exPlayQueue"
        },
        {
            'eventName': "playing",
            'listener': "EXFM.Bottom.display.canplay",
            'root': "exPlayQueue"
        },
        {
            'eventName': "play",
            'listener': "EXFM.Bottom.controls.playPauseButton.showPause",
            'root': "exAudio"
        },
        {
            'eventName': "play",
            'listener': "EXFM.Inline.showPause",
            'root': "exAudio"
        },
        {
            'eventName': "pause",
            'listener': "EXFM.Bottom.controls.playPauseButton.showPlay",
            'root': "exAudio"
        },
        {
            'eventName': "pause",
            'listener': "EXFM.Inline.showPlay",
            'root': "exAudio"
        },
        {
            'eventName': "seeking",
            'listener': "EXFM.Bottom.seek.showLoading",
            'root': "exAudio"
        },
        {
            'eventName': "seeked",
            'listener': "EXFM.Bottom.seek.hideLoading",
            'root': "exAudio"
        },
        {
            'eventName': "stop",
            'listener': "EXFM.Bottom.display.stop",
            'root': "exPlayQueue"
        },
        {
            'eventName': "shuffleToggled",
            'listener': "EXFM.Player.shuffleToggled",
            'root': "exPlayQueue"
        },
        {
            'eventName': "listChanged",
            'listener': "EXFM.Player.listChanged",
            'root': "exPlayQueue"
        }
    ],
    addEvents : function(){
        for(var i in EXFM.Player.actions){
            var action = EXFM.Player.actions[i];
            if(action){
                EXFM.XD.post(
                    {
                        'func': "IframePlayer.on", 
                        "args" : [action.eventName, action.listener, false, action.root]
                    }
                );
            }
        }
    },
    removeEvents : function(){
        for(var i in EXFM.Player.actions){
            var action = EXFM.Player.actions[i];
            if(action){
                EXFM.XD.post(
                    {
                        'func': "IframePlayer.removeListener", 
                        "args" : [action.eventName, action.listener, action.root]
                    }
                );
            }
        }
    },
    load : function(){
        if (!EXFM.Player.loaded){
            EXFM.OriginalPlaylist = EXFM.Playlist.concat([]);
            EXFM.Player.addEvents();
            EXFM.XD.post(
                {
                    "func" : "setShuffled", 
                    "args" : [false], 
                    "root" : "exPlayQueue"
                }
            );
            EXFM.XD.post(
                {
                    "func" : "add", 
                    "args" : [EXFM.Playlist], 
                    "root" : "exPlayQueue"
                }
            );
            EXFM.Player.loaded = true;
        }
    },
    previous : function(){
        EXFM.XD.post(
            {
                "func" : "previous", 
                "root" : "exPlayQueue"
            }
        );
    },
    next : function(){
        EXFM.XD.post(
            {
                "func" : "next", 
                "root" : "exPlayQueue"
            }
        );
    },
    play : function(position, shuffle){
        shuffle = shuffle || false;
        if (!EXFM.Player.loaded){
            EXFM.XD.post(
                {
                    "func" : "IframePlayer.on", 
                    "args" : ["listChanged", "EXFM.Player.listChangedPlay", false, "exPlayQueue"],
                    "context" : {
                        "playNow" : true, 
                        "position" : position,
                        "shuffle" : shuffle
                    }
                }
            );
            EXFM.Player.load();
        } else {
            EXFM.Player.playAt(position);
        }
    },
    playAt : function(position){
        EXFM.XD.post(
            {
                "func" : "play", 
                "args" : this.oldListLength + position, 
                "root" : "exPlayQueue"
            }
        );
    },
    listChangedPlay : function(){
        EXFM.XD.post(
            {
                "func" : "IframePlayer.removeListener", 
                "args" : ["listChanged", "EXFM.Player.listChangedPlay", "exPlayQueue"]
            }
        );
        EXFM.Player.oldListLength = this.oldListLength;
        if (this.originalContext.context.playNow === true){
            EXFM.Player.playAt(this.originalContext.context.position);
        }
        if (this.originalContext.context.shuffle == true){
            EXFM.XD.post(
                {
                    "func" : "setShuffled", 
                    "root" : "exPlayQueue",
                    "args" : [true, EXFM.Player.oldListLength]
                }
            );
        }
    },
    listChanged : function(e){
        if(e.target.removed.length > 0){
            EXFM.Player.oldListLength -= e.target.removed.length;
        }
    },
    pause : function(){
        EXFM.XD.post(
            {
                "func" : "pause", 
                "root" : "exAudio"
            }
        );
    },
    playPause : function(position){
        if (!position || typeof(position) != "Number"){
            position = 0;
        }
        if (!EXFM.Player.loaded){
            EXFM.Bottom.showFull();
            EXFM.Player.play(position);
        } else {
            EXFM.XD.post(
                {
                    "func" : "playPause",  
                    "root" : "exPlayQueue"
                }
            );
        }
        EXFM.List.queueIcon.check(EXFM.Playlist); 
    },
    loading : function(){
        EXFM.Player.queueNumber = this.queueNumber - EXFM.Player.oldListLength;
        EXFM.Player.song = this.song;
        EXFM.Bottom.display.load.apply(this);
        EXFM.Inline.load.apply(this);
    },
    seek : function(percentage){
        EXFM.XD.post(
            {
                "func" : "duration", 
                "root" : "exAudio",
                "callback" : "EXFM.Player.seekTo",
                "context" : percentage
            }
        );
    },
    seekTo : function(duration){
        var time = this.context * duration / 100;
        EXFM.XD.post(
            {
                "func" : "currentTime", 
                "root" : "exAudio",
                "args" : time
            }
        );
    },
    shuffle : function(){
        if (!EXFM.Player.loaded){
            EXFM.Player.play(0, true);
        } else {
            EXFM.XD.post(
                {
                    'func': "toggleShuffle",
                    'args': [EXFM.Player.oldListLength],
                    'root': "exPlayQueue"
                }
            );
        }
    },
    shuffleToggled : function(e){
        var largeShuffle = document.getElementById("exfm_large_shuffle");
        if (e.target.isShuffled){
            EXFM.Utils.addClass(largeShuffle, 'selected');
            if (e.target.shuffledPart.length > 0){
                EXFM.Playlist = e.target.shuffledPart.concat([]);
            }
        } else {
            EXFM.Playlist = EXFM.OriginalPlaylist.concat([]);
            EXFM.Utils.removeClass(largeShuffle, 'selected');
        }
        var listMiddle = document.getElementById("exfm_list_middle");
        if (listMiddle){
            EXFM.List.renderSongs(listMiddle);
        }
        EXFM.Player.queueNumber = this.queueNumber - EXFM.Player.oldListLength;
    },
    setVolume : function(volume){
        EXFM.XD.post(
            {
                "func" : "volume", 
                "root" : "exAudio",
                "args" : volume
            }
        );
    },
    getSong : function(callbackString){
        EXFM.XD.post(
            {
                'func': "getSong", 
                'root': "exPlayQueue",
                'callback': callbackString
            }
        );
    }
}
EXFM.Metadata = {
    checked : {},
    hashes : {},
    fillNewMeta : function(newSongs){
        var len = newSongs.length;
        for (var i = 0; i < len; i++){
            var newSong = newSongs[i];
            var songHash = hex_md5(newSong.url);
            var oldSong = null;
            if(EXFM.Metadata.hashes[songHash]){
                oldSong = EXFM.PlaylistObj.obj[songHash];
            }
            else{
                if (!EXFM.Metadata.hashes[songHash]){
                    for (var a in newSong.aliases){
                        if (EXFM.Metadata.hashes[hex_md5(newSong.aliases[a])]) {
                            songHash = hex_md5(newSong.aliases[a]);
                            oldSong = EXFM.PlaylistObj.obj[songHash];
                            break;
                        }
                    }
                }
            } 
            if (oldSong){
                for (var prop in newSong){
                    if (newSong[prop] != null && prop != "position"){
                        oldSong[prop] = newSong[prop];
                    }
                }
                if (newSong.viewer_love != null){
                    var heartButton = document.getElementById("exfm_inline_button_heart_"+songHash);
                    EXFM.Utils.addClass(heartButton, "exfm_on");
                }
                var playlistItem = document.getElementById("exfm_current_playlist_row_"+songHash);
                if (playlistItem){
                    var songTitle = EXFM.Utils.getByClass('exfm_current_playlist_songtitle', playlistItem);
                    if (songTitle.length > 0){
                        songTitle[0].innerHTML = newSong.title;
                        songTitle[0].setAttribute("href", EXFM_WEBSITE+"/song/"+newSong.id+EXFM_REF_FROM);
                    }
                    var artist = EXFM.Utils.getByClass('exfm_current_playlist_artist', playlistItem);
                    if (artist.length > 0){
                        artist[0].innerHTML = newSong.artist;
                        artist[0].setAttribute("href", EXFM_WEBSITE+"/search/"+newSong.artist+EXFM_REF_FROM);
                    }
                }
                if (EXFM.Player.song && hex_md5(EXFM.Player.song.url) == songHash){
                    EXFM.Bottom.display.showSong(newSong);
                }
            }
        }
    },
    request : function(array){
        var needsMeta = [];
        var len = array.length;
        for (var i = 0; i < len; i++){
            var song = array[i];
            var songHash = hex_md5(song.url);
            if (!EXFM.Metadata.hashes[songHash]){
                if (song.check_meta == true){
                    delete song.check_meta;
                    needsMeta.push(song);
                    EXFM.Metadata.hashes[songHash] = songHash;
                }
            }
        }
        if (needsMeta.length > 0){
            EXFM.XD.post(
                {
                    "func" : "Metadata.request", 
                    "callback" : "EXFM.Metadata.response", 
                    "args" : [needsMeta]
                }
            );
        }
    },
    response : function(songs){
        EXFM.Metadata.fillNewMeta(songs);
    }
}
EXFM.Ajax = {
    callbacks : {},
    response : {},
    request : function(url, callbackKey, callbackFunc, type, context){ 
        var now = new Date().getTime();
        var r = Math.random();
        var hash = "a"+hex_md5(now+" "+r);
        var obj = {"url" : url, "callbackFunc" : callbackFunc, "context" : context};
        EXFM.Ajax.callbacks[hash] = {};
        EXFM.Ajax.callbacks[hash]['obj'] = obj; 
        EXFM.Ajax.callbacks[hash]['callback'] = function(json){
            var path = EXFM.Utils.objectForPropertyPath(EXFM.Ajax.callbacks[hash]['obj']['callbackFunc']);
            path.apply(EXFM.Ajax.callbacks[hash]['obj']['context'], [json]);
            EXFM.Ajax.clean(EXFM.Ajax.callbacks[hash]["script"]);
            delete EXFM.Ajax.callbacks[hash];
        }
        //if (typeof(EXFM_HAS_AJAX) == "undefined"){
            var s = document.createElement("script");
            var callBackSymbol = "&";
            if (url.indexOf("?") == -1){
                callBackSymbol = "?";
            }
            s.setAttribute("src", url+callBackSymbol+callbackKey+"=EXFM.Ajax.callbacks."+hash+".callback");
            s.className = "exfm_ajax_script";
            EXFM.Ajax.callbacks[hash]['script'] = s;
            document.body.appendChild(s);
        /*
} else {
            try {
                EXFM_BACK("BackgroundAjax.Request", [url, "EXFM.Ajax.callbacks."+hash+".callback", type, context]);
            } catch(e){}
        }
*/
    },
    clean : function(script){
        script.parentNode.removeChild(script);
    }
}
EXFM.List = {
    container : null,
    bottomWasFull : false,
    icon : {
        click : function(){
            EXFM.Utils.removeClass(EXFM.List.container, "exfm_no_animate");
            if (EXFM.Utils.hasClass(EXFM.List.container, "exfm_list_show") == false){
                EXFM.List.show();
            } else {
                if (EXFM.List.bottomWasFull == false) {
                    EXFM.Bottom.resizeHandle.hide();
                } else {
                    EXFM.List.hide();
                }
            }
        }
    },
    show : function(){
        EXFM.List.bottomWasFull = EXFM.Bottom.full;
        var listIcon = document.getElementById("exfm_list_icon");
        EXFM.Utils.addClass(listIcon, "selected");
        if (EXFM.Bottom.full == false){
            EXFM.Event.add(window, "exfmBottomShowFull", EXFM.List.build);
            EXFM.Bottom.showFull();
        } else {
            EXFM.List.build();
        }
    },
    hide : function(animate){
        var listIcon = document.getElementById("exfm_list_icon");
        EXFM.Utils.removeClass(listIcon, "selected");
        if (animate == false){
            EXFM.Utils.addClass(EXFM.List.container, "exfm_no_animate");
        } 
        EXFM.Utils.removeClass(EXFM.List.container, "exfm_list_show");
    },
    build : function(){
        EXFM.Event.remove(window, "exfmBottomShowFull", EXFM.List.build);
        var bottomPlayer = document.getElementById("exfm_bottom_player");
        
        EXFM.List.container.innerHTML = "";
        var listHeader = document.createElement("div");
        listHeader.setAttribute("id", "exfm_list_header");
        if (EXFM.QueryParams.playlist_top_color != undefined){
            listHeader.style.background = "#"+EXFM.QueryParams.playlist_top_color;
        }
        EXFM.List.container.appendChild(listHeader);
        var shadowTop = document.createElement("div");
        shadowTop.className = "exfm_list_shadow exfm_shadow_top";
        EXFM.List.container.appendChild(shadowTop);
        var shadowBottom = document.createElement("div");
        shadowBottom.className = "exfm_list_shadow exfm_shadow_bottom";
        EXFM.List.container.appendChild(shadowBottom);
        var closeButton = document.createElement("div");
        closeButton.setAttribute("id", "exfm_playlist_close");
        EXFM.Event.add(closeButton, "click", EXFM.List.hide);
        listHeader.appendChild(closeButton);
        var siteLogo = document.createElement("div");
        siteLogo.setAttribute("id", "exfm_site_logo");
        listHeader.appendChild(siteLogo);
        //listHeader.appendChild(queueAllButton);
        var iframeHref = EXFM.CurrentSite || location.href;
        var iframeSrc = EXFM_WEBSITE+"/follow-site-button/"+iframeHref.replace("http://", "");
        if (EXFM.QueryParams.user != undefined){
            iframeSrc = EXFM_WEBSITE+"/follow-button/"+EXFM.QueryParams.user;
        }
        if (EXFM.QueryParams.user_iframe_bg_color){
            iframeSrc += "?bg_color="+EXFM.QueryParams.user_iframe_bg_color;
            if (EXFM.QueryParams.user_iframe_color){
                iframeSrc += "&color="+EXFM.QueryParams.user_iframe_color;
            }
        } else {
            if (EXFM.QueryParams.user_iframe_color){
                iframeSrc += "?color="+EXFM.QueryParams.user_iframe_color;
            }
        }
        var followButton = document.createElement("iframe");
        followButton.setAttribute("id", "exfm_follow_button_iframe");
        followButton.setAttribute("width", "120px");
        followButton.setAttribute("height", "25px");
        followButton.setAttribute("frameborder", "0");
        followButton.setAttribute("src", iframeSrc);
        listHeader.appendChild(followButton);
        var listMiddle = document.createElement("ul");
        listMiddle.setAttribute("id", "exfm_list_middle");
        EXFM.List.renderSongs(listMiddle);
        EXFM.List.container.appendChild(listMiddle);
        if (EXFM.Player.queueNumber != 0){
            listMiddle.scrollTop = EXFM.Player.queueNumber * 35;
        }
        EXFM.Utils.addClass(EXFM.List.container, "exfm_list_show");
        if (EXFM.QueryParams.parent_el != undefined){
            var display = document.getElementById("exfm_display");
            var left = EXFM.Utils.getLeft(display);
            var top = EXFM.Utils.getTop(EXFM.Bottom.parentEl);
            if ( top < 0 ) {
                top = 0;
            };
            if ( EXFM.QueryParams.list_container == "below") {
                top += EXFM.Bottom.player.offsetHeight;
            } else {
                top -= EXFM.List.container.offsetHeight;
            }
            EXFM.List.container.style.top = top+'px';
            EXFM.List.container.style.left = left+'px';
        }
    },
    renderSongs : function(listMiddle){
        listMiddle.innerHTML = "";
        var tf = false;
        for (var i = 0; i < EXFM.Playlist.length; i++){
            var song = EXFM.Playlist[i];
            var songHash = hex_md5(song.url);
            tf = !tf;
            var currentPlaylistRow = document.createElement("li");
            currentPlaylistRow.className = "exfm_current_playlist_row exfm_"+tf;
            currentPlaylistRow.setAttribute("position", i);
            currentPlaylistRow.setAttribute("id", "exfm_current_playlist_row_"+songHash);
            var currentPlaylistPlayButton = document.createElement("div");
            currentPlaylistPlayButton.className = "exfm_current_playlist_play_button";
            currentPlaylistPlayButton.setAttribute("id", "exfm_current_playlist_play_button_"+i);
            EXFM.Event.add(currentPlaylistPlayButton, "click", EXFM.List.playButton.click);
            if (i == EXFM.Player.queueNumber && EXFM.Player.loaded == true){
                currentPlaylistPlayButton.className = "exfm_current_playlist_play_button exfm_playing";
                EXFM.CurrentPlaylistPlayButton = currentPlaylistPlayButton;
                EXFM.Utils.addClass(currentPlaylistRow, "exfm_playing");
            }
            currentPlaylistRow.appendChild(currentPlaylistPlayButton);
            var currentPlaylistSongtitle = document.createElement("a");
            currentPlaylistSongtitle.className = "exfm_current_playlist_songtitle";
            if (EXFM.Utils.hasValue(song.id) == true){
                currentPlaylistSongtitle.setAttribute("href", EXFM_WEBSITE+"/song/"+song.id+EXFM_REF_FROM);
            } else {
                currentPlaylistSongtitle.removeAttribute("href");
            }
            currentPlaylistSongtitle.setAttribute("target", "_blank");
            currentPlaylistSongtitle.appendChild(document.createTextNode(EXFM.Utils.blankUndefined(song.title, "Unknown Title")));
            currentPlaylistSongtitle.onclick = EXFM.List.songtitle.click;
            //EXFM.Event.add(currentPlaylistSongtitle, "click", EXFM.List.songtitle.click);
            currentPlaylistRow.appendChild(currentPlaylistSongtitle);
            
            var currentPlaylistArtist = document.createElement("a");
            currentPlaylistArtist.className = "exfm_current_playlist_artist";
            if (EXFM.Utils.hasValue(song.artist) == true){
                currentPlaylistArtist.setAttribute("href", EXFM_WEBSITE+"/search/"+encodeURIComponent(song.artist)+EXFM_REF_FROM);
            } else {
                currentPlaylistArtist.removeAttribute("href");
            }
            currentPlaylistArtist.setAttribute("target", "_blank");
            currentPlaylistArtist.appendChild(document.createTextNode(EXFM.Utils.blankUndefined(song.artist, "")));
            currentPlaylistArtist.onclick = EXFM.List.artist.click;
            currentPlaylistRow.appendChild(currentPlaylistArtist);

			// add love, share, & link icons
            var listLoveIcon = document.createElement("div");
            listLoveIcon.className = "exfm_list_love";
            listLoveIcon.setAttribute("song_hash", songHash);
            listLoveIcon.setAttribute("id", "exfm_list_love_"+song.id);
            listLoveIcon.setAttribute("title", "Love this song");
            if (song.viewer_love != null){
                listLoveIcon.className = "exfm_list_love exfm_on";
                listLoveIcon.setAttribute("title", "Un-love this song");
            }
            EXFM.Event.add(listLoveIcon, "click", EXFM.List.loveIcon.click);            
            currentPlaylistRow.appendChild(listLoveIcon);
            
            //var listShareIcon = document.createElement("div");
            //listShareIcon.className = "exfm_list_share";
            //currentPlaylistRow.appendChild(listShareIcon);
            if (typeof(EXFM_HAS_EXTENSION) != "undefined"){
                var listQueueIcon = document.createElement("div");
                listQueueIcon.className = "exfm_list_queue";
                listQueueIcon.setAttribute("title", "Add song to Play Queue");
                listQueueIcon.setAttribute("song_hash", songHash);
                listQueueIcon.setAttribute("id", "exfm_list_queue_"+songHash);
                if (EXFM.List.queueIcon.selected[song.id]){
                    listQueueIcon.setAttribute("title", "Song in Play Queue");
                    listQueueIcon.className = "exfm_list_queue selected";
                } else {
                    EXFM.Event.add(listQueueIcon, "click", EXFM.List.queueIcon.click);
                }
                currentPlaylistRow.appendChild(listQueueIcon);
                 
            }
            var listLinkIcon = document.createElement("a");
            listLinkIcon.className = "exfm_list_link";
            listLinkIcon.setAttribute("href", song.source);
            listLinkIcon.setAttribute("target", "_blank");
            currentPlaylistRow.appendChild(listLinkIcon);
            if ( EXFM.QueryParams.user == "stereogum" ) {
                currentPlaylistSongtitle.setAttribute("href", song.user_love_source || song.source);
                listLinkIcon.setAttribute("href", EXFM_WEBSITE+"/song/"+song.id+EXFM_REF_FROM);
                try {
                    currentPlaylistArtist.setAttribute("href", "/tag/"+song.artist.replace(/ /g, "-"));
                } catch(err){}
            }
            listMiddle.appendChild(currentPlaylistRow);
        }
    },
    playButton : {
        click : function(e){
            var target = e.target || e.srcElement;
            if (EXFM.Utils.hasClass(target, 'exfm_playing')){
                EXFM.Player.playPause();
            } else {
                var parent = EXFM.Utils.getParentWithClass("exfm_current_playlist_row", target);
                if (parent != null){
                    var position = parseInt(parent.getAttribute("position"));
                    EXFM.Player.play(position);
                    EXFM.List.queueIcon.check(EXFM.Playlist);
                }
            }
        }
    },
    loveIcon : {
        click : function(e){
            if (e.type == "click"){
                var target = e.target || e.srcElement;
                var songHash = target.getAttribute("song_hash");
                var song = EXFM.PlaylistObj.obj[songHash];
                if (song && song.id){
                    EXFM.Love.request(e, target, song);
                } else {
                    alert("There was a problem. Please try again");
                }
            }
        }
    },
    queueIcon : {
        selected : {},
        click : function(e){
            var target = e.target || e.srcElement;
            var songHash = target.getAttribute("song_hash");
            var song = EXFM.PlaylistObj.obj[songHash];
            if (song){
                EXFM.XD.post(
                    {
                        "func" : "add", 
                        "args" : song, 
                        "root" : "exPlayQueue"
                    }
                );
            }
        },
        selected : function(song){
            try {
                var icon = document.getElementById("exfm_list_queue_"+song.id);
                EXFM.Utils.addClass(icon, "selected");
                icon.setAttribute("title", "Song in Play Queue");
                EXFM.List.queueIcon.selected[song.id] = true;
            } catch(e){}
        },
        check : function(array){
            var len = array.length;
            for (var i = 0; i < len; i++){
                var song = array[i];
                try {
                    EXFM.List.queueIcon.selected[song.id] = true; 
                    var icon = document.getElementById("exfm_list_queue_"+song.id);
                    EXFM.Utils.addClass(icon, "selected");
                    icon.setAttribute("title", "Song in Play Queue");
                } catch(e){}
            }
        }
    },
    songtitle : {
        click : function(e){
            try {
                var url = this.getAttribute("href");
            } catch(err){}
            try {
                EXFM_BACK("Utils.OpenOrSwitchTab", [url, false])
                e.stopPropagation();
                return false;
            } catch(er){}
        }
    },
    artist : {
        click : function(e){
            try {
                var url = this.getAttribute("href");
            } catch(err){}
            try {
                EXFM_BACK("Utils.OpenOrSwitchTab", [url, false])
                e.stopPropagation();
                return false;
            } catch(er){}
        }
    }
}
EXFM.Event = {
    listeners : {},
    add : function(target, type, fn){
        if (target){
            if (typeof this.listeners[type+target] == 'undefined') {
                this.listeners[type+target] = [];
            }
            this.listeners[type+target].push(fn);
    	    if (target.addEventListener) {
               target.addEventListener(type, fn, false);
    	    } else {
    		   target.attachEvent('on' + type, fn);
    	    }
        }
    },
	remove : function(target, type, fn){
        try {
    		if (typeof this.listeners[type+target] != 'undefined') {
    			for (var i = 0, l; l = this.listeners[type+target][i]; i++) {
                    if (l == fn) break;
                }
                this.listeners[type+target].splice(i, 1);
            }
    		if (target.removeEventListener) {
    			target.removeEventListener(type, fn, false);
    		} else { 
    			target.detachEvent('on' + type, fn);
    		}
        } catch(e){}
	},
	fire : function(target, type, object){
		if (typeof this.listeners[type+target] != 'undefined' && this.listeners[type+target].length) {
			var newArray = this.listeners[type+target].slice();
            for (var i = 0, l; l = newArray[i]; i++) {
            	l(object);
            }
            return true;           
        }
        return false;
	},
	stop : function(e){
		try {
			e.stopPropagation();
		} catch (e){
			try {
				window.event.cancelBubble = true;
			} catch (e) {}
		}
	}
}
EXFM.Utils = {
    getByClass : function(className, element){
        try {
            if (element != null){
                return document.querySelectorAll(element+' > .'+className);
            } else {
                return document.querySelectorAll('.'+className);
            }
        } catch(e){
            if (element != null){
                var node = element;
            } else {
                var node = document.getElementsByTagName('body')[0];
            }
            var a = [], re = new RegExp('\\b' + className + '\\b'); els = node.getElementsByTagName('*'); 
            for (var i = 0, j = els.length; i < j; i++) { if ( re.test(els[i].className) ) { a.push(els[i]); } } return a; 
        }
    },
    getParentWithClass : function(clas, element){
        var e = null;
        try {
            var l = element;
            while (l != l.parentNode){
                if (EXFM.Utils.hasClass(l, clas) == true){
                    return l;
                }
                l = l.parentNode;
                
            }
        } catch(e){};
        return e;
    },
    hasClass : function (element, clas) {
        try {
            return element.classList.contains(clas);
        } catch(e){
            try {  
                var m = element.className.match(new RegExp('(\\s|^)'+clas+'(\\s|$)'));
                if (m == null){
                    return false;
                } else {
                    return true;
                }
             } catch(e){}
        }
    },
    addClass : function(elements, clas) {
        try {
            if (elements.length != undefined){
                for (var i = 0; i < elements.length; i++){
                    var element = elements[i];
                    element.classList.add(clas);
                }
            } else {
                elements.classList.add(clas);
            }
        } catch(e){
            try {
                if (elements.length != undefined){
                    for (var i = 0; i < elements.length; i++){
                        var element = elements[i];
                        if (!EXFM.Utils.hasClass(element, clas)) { 
                            var c = EXFM.Utils.trimString(element.className += " "+clas);
                            element.className = c;
                        }
                    }
                } else {
                    if (!EXFM.Utils.hasClass(elements, clas)) {
                        var c = EXFM.Utils.trimString(elements.className += " "+clas);
                        elements.className = c;
                    }    
                }
             } catch(e){}
        }
    },
    removeClass : function(elements, clas){
        try {
            if (elements.length != undefined){
                for (var i = 0; i < elements.length; i++){
                    var element = elements[i];
                    element.classList.remove(clas);
                }
            } else {
                elements.classList.remove(clas);
            }
        } catch(e){
            try {
                if (elements.length != undefined){
                    for (var i = 0; i < elements.length; i++){
                        var element = elements[i];
                        if (EXFM.Utils.hasClass(element, clas)) {
                           var reg = new RegExp('(\\s|^)'+clas+'(\\s|$)');
                           element.className = element.className.replace(reg,' ');
                        }
                    }
                } else {
                   if (EXFM.Utils.hasClass(elements, clas)) {
                       var reg = new RegExp('(\\s|^)'+clas+'(\\s|$)');
                       elements.className = elements.className.replace(reg,' ');
                   } 
                }
            } catch(e){}
        }
    },
    cleanHref : function(href){
        try {
            var r = href.replace("http://", "");
        	var i = r.indexOf("/");
        	if (i != -1 && i != 0){
        		r = r.substr(0, i);
        	}
        	var www = r.indexOf('www.');
        	if (www != -1 && www == 0){
        		r = r.substr(4);
        	}
        	return r;
        } catch(e){
            return href;
        }
    },
    mmss : function (secs) {
        var s = secs % 60;
        if (s < 10) {
            s = "0" + s;
        }
        return Math.floor(secs/60) + ":" + s;
    },
    setSizes : function(){
		try {
            var progress = document.getElementById("exfm_display_progress");
			EXFM.Bottom.display.progressWidth = progress.offsetWidth;
			EXFM.Bottom.display.progressLeft = EXFM.Utils.getLeft(progress);
			EXFM.Bottom.display.progressRight = EXFM.Bottom.display.progressLeft + EXFM.Bottom.display.progressWidth;
			var volume = document.getElementById("exfm_volume_slider");
			EXFM.Bottom.volume.volumeHeight = volume.offsetHeight;
			EXFM.Bottom.volume.volumeTop = EXFM.Utils.getTop(volume) - document.body.scrollTop;
			if ( EXFM.Bottom.volume.volumeTop < 0 ) {
                EXFM.Bottom.volume.volumeTop = EXFM.Bottom.player.offsetHeight + volume.offsetTop;
			}
			EXFM.Bottom.volume.volumeBottom = EXFM.Bottom.volume.volumeTop + EXFM.Bottom.volume.volumeHeight;
		} catch(e){}
    },
    getLeft : function(element){
        var offset = element.offsetLeft; 
        while (element = element.offsetParent){
            offset += element.offsetLeft;
        }
        return offset;
    },
    getTop : function(element){
        var offset = element.offsetTop; 
        while (element = element.offsetParent){
            offset += element.offsetTop;
        }
        return offset;
    },
    getWidth : function(element){
        return element.offsetWidth;
    },
    trimString : function(str){
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    shortenString : function(str, len){
        var s = str;
    	if (str.length > len){
    		s = str.substr(0, len)+'...';
    	}
    	return s;
    },
    chunk : function(a, s){
       	var base = [], i;
        for(var i = 0; i < a.length; i+=s ) { 
        	base.push( a.slice( i, i+s ) ); 
        }    
        return base;
    },
    getCoverart : function(img, size){
        if (EXFM.Utils.hasValue(img) == false){
            return "url("+EXFM_IMGHOST+"album-bg-2.jpg) no-repeat";
        } else {
            if (img.indexOf('ecx.images-amazon.com') != -1){
		        img = img.replace('SL75', 'SL'+size);
		    }
		    if (EXFM.Browser == "IE"){
		        return "url("+img+") no-repeat";
		    } else {
                return "url("+img+") no-repeat, url("+EXFM_IMGHOST+"album-bg-2.jpg) no-repeat";
            }
       }
    },
    hasValue : function(s){
        if (s === undefined){
            return false;
        }
        if (s === 'undefined'){
            return false;
        }
        if (s === ""){
            return false;
        }
        if (s === null){
            return false;
        }
        if (s === "null"){
            return false;
        }
        return true;
    },
    getQueryParams : function(str, obj){
        try {
            var splits = str.split("?");
    		var paramString = splits[1];
    		var params = paramString.split("&");
    		for (var i = 0; i < params.length; i++){
                var param = params[i];
    			var keyValue = param.split("=");
    			obj[keyValue[0]] = keyValue[1];
    		}
        } catch(e){}
    },
    blankUndefined : function(str, replace){
    	var r = replace;
    	if (str != undefined && str != 'undefined' && str != null && str != "null"){
    		r = str;
    	}
    	return r;
    },
    getSongAttributes : function(el, song){
        var len = EXFM_Song_SettableFields.length;
        for (var i = 0; i < len; i++){
            var attr = el.getAttribute(EXFM_Song_SettableFields[i]);
            if (attr != null){
                song[EXFM_Song_SettableFields[i]] = unescape(attr);
            }
        }
    },
    removePlayers : function(){
        try {
            var strmpd = document.getElementById("streampadBottomBar");
            strmpd.style.display = "none";
        } catch(e){}
	},
	// from sproutcore
	objectForPropertyPath : function(path, root, stopAt) {
        var loc, nextDotAt, key, max ;
        if (!root) root = window ;
        if (typeof(path) === "string") {
            if (stopAt === undefined) stopAt = path.length ;
            loc = 0 ;
            while((root) && (loc < stopAt)) {
                nextDotAt = path.indexOf('.', loc) ;
                if ((nextDotAt < 0) || (nextDotAt > stopAt)) nextDotAt = stopAt;
                key = path.slice(loc, nextDotAt);
                root = root.get ? root.get(key) : root[key] ;
                loc = nextDotAt+1;
            }
            if (loc < stopAt) root = undefined; // hit a dead end. 
        } else {
            loc = 0; max = path.length; key = null;
            while((loc < max) && root) {
                key = path[loc++];
                if (key) root = (root.get) ? root.get(key) : root[key] ;
            }
            if (loc < max) root = undefined ;
        }
    return root ;
    },
    cleanEncode : function(s){
        if (s === undefined){
            return s;
        }
        var d;
        while (d != s){
            d = s;
            s = decodeURI(s);
        }
        d = d.replace(/ /g, '%20');
        d = d.replace(/\(/g, '%28');
        d = d.replace(/\)/g, '%29');
        return d;
    },
    transitionEvent : function(el, listener, timeOut){
        EXFM.Event.add(el, "webkitTransitionEnd", listener);
        EXFM.Event.add(el, "transitionend", listener);
        setTimeout(listener, timeOut);
    },
    // from underscore.js
    debounce : function(func, wait) {
        return EXFM.Utils.limit(func, wait, true);
    },
    // from underscore.js
    limit : function(func, wait, debounce) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var throttler = function() {
            timeout = null;
            func.apply(context, args);
          };
          if (debounce) clearTimeout(timeout);
          if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    },
    stickTop : function(){
        if (EXFM.Utils.getTop(EXFM.Bottom.parentEl) < document.body.scrollTop){
            EXFM.Utils.addClass(EXFM.Bottom.player, "exfm_fixed");
            EXFM.Utils.addClass(EXFM.List.container, "exfm_fixed");
            EXFM.Utils.addClass(EXFM.Bottom.volume.back, "exfm_fixed");
        } else {
            EXFM.Utils.removeClass(EXFM.Bottom.player, "exfm_fixed");
            EXFM.Utils.removeClass(EXFM.List.container, "exfm_fixed");
            EXFM.Utils.removeClass(EXFM.Bottom.volume.back, "exfm_fixed");
        }
    },
    getSource : function(){
        return location.href;
    },
    removeQueryParams : function(url){
        return url.split("?")[0];
    },
    setLogoLink : function(url){
        var logoLink = document.getElementById("exfm_logo_link");
        EXFM.CurrentSite = url.replace("http://", "");
        if ( logoLink ) {
            logoLink.setAttribute("href", EXFM_WEBSITE+"/site/"+EXFM.CurrentSite+EXFM_REF_FROM);
        }
    },
    getPageVar : function(varName){
        var obj = null;
        var d = document.getElementById('exfm_json');
        if ( !d ) {
            d = document.createElement("div");
            d.setAttribute("id", "exfm_json");
            d.style.display = "none";
            d.className = "exfm_invisible";
            document.body.appendChild(d);
        };
        var s = document.getElementById('exfm_json_script');
        if ( !s ) {
            s = document.createElement("script");
            s.type = "text/javascript";
        };
        s.innerHTML = "document.getElementById('exfm_json').innerHTML = JSON.stringify("+varName+");";
        document.body.appendChild(s);
        var json = d.innerHTML;
        try {
            obj = JSON.parse(json);
        } catch(e){};
        return obj;
    },
    getOpenGraphContent: function(name){
        var el = null;
        try {
            el = document.querySelector('meta[property="og:'+name+'"]');
        } catch(e){}
        if( el !== null ){
            return el.getAttribute('content');
        }
        return null;
    },
    makeQueryParams : function(obj){
        var str = "";
        for (var key in obj) {
            if ( str != "" ) {
                str += "&";
            }
            str += key + "=" + encodeURIComponent(obj[key]);
        }
        return str;
    },
    decode : function(s){
        if (s === undefined){
            return s;
        }
        var d;
        while (d != s){
            d = s;
            s = decodeURI(s);
            s = unescape(s);
        }
        return d;
    }
}
EXFM.ExtensionInstalled = function(){
    EXFM_HAS_EXTENSION = true;
}
EXFM.FirefoxExtensionInstalled = function(){
    EXFM_HAS_FIREFOX_EXTENSION = true;
    EXFM.Init(true);
}
EXFM.KeyBoardShortcuts = {
    keyup : function(e){
        if (e.altKey == true){
    		//set p to playPause
    		if (e.keyCode == 80){
                EXFM.playPause();
    		}
    		// set k to next
    		if (e.keyCode == 75){
    			EXFM.next();
    		}
    		// set j to prev
    		if (e.keyCode == 74){
    			EXFM.previous();
    		}
    		// set l to love/unlove current song
    		//if (e.keyCode == 76){
    			//jQuery(window).trigger({"type" : "keyBoardLove"});
    		//}
    	}
    }
}
EXFM.Popout = {
    window : null,
    click : function(e){
        var popoutUrl = EXFM_WEBSITE+"/site-player-popout";
        if ( EXFM.QueryParams.popout_to ) {
            popoutUrl = "/"+EXFM.QueryParams.popout_to;
        }
        var popoutWidth = 574;
        if ( EXFM.QueryParams.popout_width ) {
            popoutWidth = EXFM.QueryParams.popout_width;
        }
        var popoutHeight = 574;
        if ( EXFM.QueryParams.popout_height ) {
            popoutHeight = EXFM.QueryParams.popout_height;
        }
        EXFM.Popout.window = window.open(popoutUrl, 'popoutPlayer', 'width='+popoutWidth+',height='+popoutHeight);
    },
    sendData : function(autoplay){
        try {
            EXFM.Popout.window.postMessage(JSON.stringify(
                {
                    'msg': "popoutData", 
                    'playlist': EXFM.Playlist, 
                    'queueNumber': EXFM.Player.queueNumber, 
                    'autoplay': autoplay, 
                    'queryParams': EXFM.QueryParams, 
                    'currentTime': EXFM.Audio.currentTime, 
                    'site': EXFM.CurrentSite
                }
            ), "*");
            EXFM.pause();
        } catch(e){}
    }
}
EXFM.Tooltip = {
    container : null,
    timeout : null,
    mouseover : function(e){
        clearTimeout(EXFM.Tooltip.timeout);
    	var target = e.target || e.srcElement;
    	var tooltip = target.getAttribute("tooltip");
    	try {
    	   EXFM.Tooltip.container.style.position = getComputedStyle(EXFM.Bottom.player).position;
        } catch(ep) {
    	   EXFM.Tooltip.container.style.position = "absolute";
        }
        if ( EXFM.Tooltip.container.style.position == "relative" ) {
            EXFM.Tooltip.container.style.position = "absolute";
        }
    	var topTarget = EXFM.Bottom.player;
    	if (EXFM.QueryParams.parent_el != undefined){
    	   topTarget = EXFM.QueryParams.parent_el;
    	}
    	var left = EXFM.Utils.getLeft(target);
    	var top = EXFM.Utils.getTop(EXFM.Bottom.player);
    	var width = EXFM.Utils.getWidth(target);
    	EXFM.Tooltip.container;
    	EXFM.Tooltip.container.innerHTML = tooltip;
    	var tWidth =  EXFM.Utils.getWidth(EXFM.Tooltip.container);
    	var l = left+(width/2)-tWidth/2;
        EXFM.Tooltip.container.style.left = l+"px";
        EXFM.Tooltip.container.style.top = ( top - 25 ) + "px";
        EXFM.Tooltip.container.style.right = "auto";
    	EXFM.Utils.addClass(EXFM.Tooltip.container, "show");
        var newLeft = EXFM.Utils.getLeft(EXFM.Tooltip.container);
        var right = newLeft + tWidth;
        var bodyWidth = EXFM.Utils.getWidth(document);
        if ((right + 30) > bodyWidth){
            EXFM.Tooltip.container.style.left = "auto";
            EXFM.Tooltip.container.style.right = "30px";
        }
        if (newLeft < 0){
            EXFM.Tooltip.container.style.left = "10px";
            EXFM.Tooltip.container.style.right = "auto";
        }
        var tooltipTop = EXFM.Utils.getTop(EXFM.Tooltip.container);
        if (tooltipTop < 0) {
            EXFM.Tooltip.container.style.top = ( EXFM.Bottom.player.offsetHeight + 5 ) + "px";
        }
        if ( EXFM.QueryParams.list_container == "below") {
            EXFM.Tooltip.container.style.top = ( top + EXFM.Bottom.player.offsetHeight + 5 ) + "px";
        }
        EXFM.Tooltip.timeout = setTimeout(EXFM.Tooltip.mouseout, 2000);
     },
    mouseout : function(e){
        EXFM.Utils.removeClass(EXFM.Tooltip.container, "show");
    }
}
EXFM.Event.add(document, "exfmSongsAsyncEvent", EXFM.Parse.init);
EXFM.Event.add(document, "exfmReset", EXFM.Reset);
/* Song object */
EXFM_Song = function(){
    this.url = null;
    this.source = null;
    this.title = null;
    this.artist = null;
    this.album = null;
    this.buy_link = null;
    this.soundcloud_track_id = null;
    this.bandcamp_track_id = null;
    this.confidence = 0;
    this.image = {
        small : null,
        medium : null,
        large : null
    };
    this.id = null;
    this.viewer_love = null;
    this.user_love = null;
    this.tags = [];
    this.check_meta = true;
    this.context = null;
}
EXFM_Song_SettableFields = ["title", "artist", "album", "image", "buy_link"];
/* JSON2 (json.org) */
if(!this.JSON)this.JSON={};
(function(){function l(b){return b<10?"0"+b:b}function o(b){p.lastIndex=0;return p.test(b)?'"'+b.replace(p,function(f){var c=r[f];return typeof c==="string"?c:"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+b+'"'}function m(b,f){var c,d,g,j,i=h,e,a=f[b];if(a&&typeof a==="object"&&typeof a.toJSON==="function")a=a.toJSON(b);if(typeof k==="function")a=k.call(f,b,a);switch(typeof a){case "string":return o(a);case "number":return isFinite(a)?String(a):"null";case "boolean":case "null":return String(a);
case "object":if(!a)return"null";h+=n;e=[];if(Object.prototype.toString.apply(a)==="[object Array]"){j=a.length;for(c=0;c<j;c+=1)e[c]=m(c,a)||"null";g=e.length===0?"[]":h?"[\n"+h+e.join(",\n"+h)+"\n"+i+"]":"["+e.join(",")+"]";h=i;return g}if(k&&typeof k==="object"){j=k.length;for(c=0;c<j;c+=1){d=k[c];if(typeof d==="string")if(g=m(d,a))e.push(o(d)+(h?": ":":")+g)}}else for(d in a)if(Object.hasOwnProperty.call(a,d))if(g=m(d,a))e.push(o(d)+(h?": ":":")+g);g=e.length===0?"{}":h?"{\n"+h+e.join(",\n"+h)+
"\n"+i+"}":"{"+e.join(",")+"}";h=i;return g}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;if(typeof JSON.stringify!=="function")JSON.stringify=function(b,f,c){var d;n=h="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else if(typeof c==="string")n=c;if((k=f)&&typeof f!=="function"&&(typeof f!=="object"||typeof f.length!=="number"))throw Error("JSON.stringify");return m("",
{"":b})};if(typeof JSON.parse!=="function")JSON.parse=function(b,f){function c(g,j){var i,e,a=g[j];if(a&&typeof a==="object")for(i in a)if(Object.hasOwnProperty.call(a,i)){e=c(a,i);if(e!==undefined)a[i]=e;else delete a[i]}return f.call(g,j,a)}var d;b=String(b);q.lastIndex=0;if(q.test(b))b=b.replace(q,function(g){return"\\u"+("0000"+g.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+b+")");return typeof f==="function"?c({"":d},""):d}throw new SyntaxError("JSON.parse");}})();
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var hexcase=0;var b64pad="";function hex_md5(s){return rstr2hex(rstr_md5(str2rstr_utf8(s)));}
function b64_md5(s){return rstr2b64(rstr_md5(str2rstr_utf8(s)));}
function any_md5(s,e){return rstr2any(rstr_md5(str2rstr_utf8(s)),e);}
function hex_hmac_md5(k,d)
{return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)));}
function b64_hmac_md5(k,d)
{return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)));}
function any_hmac_md5(k,d,e)
{return rstr2any(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)),e);}
function md5_vm_test()
{return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72";}
function rstr_md5(s)
{return binl2rstr(binl_md5(rstr2binl(s),s.length*8));}
function rstr_hmac_md5(key,data)
{var bkey=rstr2binl(key);if(bkey.length>16)bkey=binl_md5(bkey,key.length*8);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++)
{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=binl_md5(ipad.concat(rstr2binl(data)),512+data.length*8);return binl2rstr(binl_md5(opad.concat(hash),512+128));}
function rstr2hex(input)
{try{hexcase}catch(e){hexcase=0;}
var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++)
{x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)
+hex_tab.charAt(x&0x0F);}
return output;}
function rstr2b64(input)
{try{b64pad}catch(e){b64pad='';}
var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var output="";var len=input.length;for(var i=0;i<len;i+=3)
{var triplet=(input.charCodeAt(i)<<16)|(i+1<len?input.charCodeAt(i+1)<<8:0)|(i+2<len?input.charCodeAt(i+2):0);for(var j=0;j<4;j++)
{if(i*8+j*6>input.length*8)output+=b64pad;else output+=tab.charAt((triplet>>>6*(3-j))&0x3F);}}
return output;}
function rstr2any(input,encoding)
{var divisor=encoding.length;var i,j,q,x,quotient;var dividend=Array(Math.ceil(input.length/2));for(i=0;i<dividend.length;i++)
{dividend[i]=(input.charCodeAt(i*2)<<8)|input.charCodeAt(i*2+1);}
var full_length=Math.ceil(input.length*8/(Math.log(encoding.length)/Math.log(2)));var remainders=Array(full_length);for(j=0;j<full_length;j++)
{quotient=Array();x=0;for(i=0;i<dividend.length;i++)
{x=(x<<16)+dividend[i];q=Math.floor(x/divisor);x-=q*divisor;if(quotient.length>0||q>0)
quotient[quotient.length]=q;}
remainders[j]=x;dividend=quotient;}
var output="";for(i=remainders.length-1;i>=0;i--)
output+=encoding.charAt(remainders[i]);return output;}
function str2rstr_utf8(input)
{var output="";var i=-1;var x,y;while(++i<input.length)
{x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF)
{x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}
if(x<=0x7F)
output+=String.fromCharCode(x);else if(x<=0x7FF)
output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)
output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)
output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));}
return output;}
function str2rstr_utf16le(input)
{var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode(input.charCodeAt(i)&0xFF,(input.charCodeAt(i)>>>8)&0xFF);return output;}
function str2rstr_utf16be(input)
{var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode((input.charCodeAt(i)>>>8)&0xFF,input.charCodeAt(i)&0xFF);return output;}
function rstr2binl(input)
{var output=Array(input.length>>2);for(var i=0;i<output.length;i++)
output[i]=0;for(var i=0;i<input.length*8;i+=8)
output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32);return output;}
function binl2rstr(input)
{var output="";for(var i=0;i<input.length*32;i+=8)
output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF);return output;}
function binl_md5(x,len)
{x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16)
{var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}
return Array(a,b,c,d);}
function md5_cmn(q,a,b,x,s,t)
{return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}
function md5_ff(a,b,c,d,x,s,t)
{return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}
function md5_gg(a,b,c,d,x,s,t)
{return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}
function md5_hh(a,b,c,d,x,s,t)
{return md5_cmn(b^c^d,a,b,x,s,t);}
function md5_ii(a,b,c,d,x,s,t)
{return md5_cmn(c^(b|(~d)),a,b,x,s,t);}
function safe_add(x,y)
{var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
function bit_rol(num,cnt)
{return(num<<cnt)|(num>>>(32-cnt));}
/* DOM Functions */
if (window.opera) {
    EXFM.Browser = "Opera";
} else {
    if (window.ActiveXObject) {
        EXFM.Browser = "IE"
    } else {
        if (!navigator.taintEnabled) {
            EXFM.Browser = "Webkit"   
        } else {
            if (navigator.product == "Gecko"){
                EXFM.Browser = "Mozilla";
            }
        }
    }
}
(function(){
    if (window.top == window){
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++){
            var script = scripts[i];
            if (script.src.indexOf('exfm.js') != -1){
                EXFM.Utils.getQueryParams(script.src, EXFM.QueryParams);
            }
        }
        if (EXFM.QueryParams.is_firefox_ext == "true"){
            EXFM_HAS_FIREFOX_EXTENSION = true;
        }
    }
})();


(function(){
    if (typeof(EXFM_HAS_EXTENSION) == "undefined" && typeof(EXFM_HAS_FIREFOX_EXTENSION) == "undefined"){
        if (window.top == window){
            if (!document.body) {
        	   setTimeout(arguments.callee, 50);
            } else {
                EXFM.CSS.add();
                EXFM.CSS.external();
                EXFM.Bottom.build(null, false);
            }
        }
    }
})();

(function(){
    try{
        var domready = function(){
            if (typeof(EXFM_HAS_EXTENSION) == "undefined" && typeof(EXFM_HAS_FIREFOX_EXTENSION) == "undefined" && location.href.indexOf(EXFM_WEBSITE) == -1){
                EXFM.Init();
            } else {
                if (typeof(EXFM_HAS_EXTENSION) != 'undefined'){
                    EXFM.Init(true);
                }
                if (location.href == EXFM_SITE_PLAYER_URL){
                    EXFM.Init();
                }
            }
    	};
    	switch (EXFM.Browser){
            case 'IE':
    			var temp = document.createElement('div');
    			(function(){
    				try {
    					(function(){
    						temp.doScroll('left');
    						temp.innerHTML = 'temp';
    						document.body.appendChild(temp);
    						document.body.removeChild(temp);
    						domready();
    					})();
    				} catch (e){
    					setTimeout(arguments.callee, 50);
    				}
    			})();
    		break;
    		case 'Webkit': (function(){
    			if (document.readyState == 'loaded' || document.readyState == 'complete'){
    				domready();	
    			} else {
    				setTimeout(arguments.callee, 50);
    			}
    		})(); 
    		break;
    		default:
                try {
                    window.addEventListener('load', domready, false);
                    document.addEventListener('DOMContentLoaded', domready, false);
    			} catch(e){}
    		}
    } catch(e){}
})();
try {
    document.addEventListener('exfmEnabledEvent', EXFM.ExtensionInstalled, false);
} catch(e){}
try {
    document.addEventListener('exfmFirefoxExtensionEvent', EXFM.FirefoxExtensionInstalled, false);
} catch(e){}
try {
    onEXFMReady();
} catch(e){}