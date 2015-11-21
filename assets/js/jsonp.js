	url = window.BCurl;
	artist = window.BCartist;
	title = window.BCtitle;

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
    bcGet.open("GET",'http://api.bandcamp.com/api/url/3/info?key=' + client_id + '&url=' + encodeURIComponent(url));

    bcGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    bcGet.onreadystatechange=function(data)
    {
        if (bcGet.readyState==4 && bcGet.status==200)
        {   
                response = JSON.parse(bcGet.responseText);
                
                bcGet.open("GET",'http://api.bandcamp.com/api/track/1/info?key=' + client_id + '&track_id=' + response['track_id']);

                bcGet.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                bcGet.onreadystatechange=function(data)
                {
                    if (bcGet.readyState==4 && bcGet.status==200)
                    {   
                        response = JSON.parse(bcGet.responseText);
                        console.log('BC sent: ' + response['stream_url']);
                        sanitiseBandcamp(artist, title, response['stream_url']);

                        //audioPlaylist.push({'artist': artist, 'title': title, 'url' : response['stream_url'], 'type': 'audio/mp3' }); 
                        //updateAudioDisplay();
                    }  
                }  
                bcGet.send();

        }  
    }  
    bcGet.send();