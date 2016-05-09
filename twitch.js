'use strict';

var twitchUsers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas",
										"beohoff", "comster404", "brunofin","cretetion", "ESL_SC2", "ogamingsc2"];
var container = document.getElementById("container");

function addScriptInjectionStreams(username) {

	var scriptInjection = document.createElement("script");
	scriptInjection.src = "https://api.twitch.tv/kraken/streams/" + username + "?format=json&callback=callbackFunctionStreams";
	document.body.appendChild(scriptInjection);

}

function callbackFunctionStreams(data) {

	if(data.stream === null) {
		var url = data["_links"]["channel"];
		getOfflineStreamer(url.substr(37));
	} else if(data.status === 422) {
		var url2 = data.message;
		getOfflineStreamer(url2.replace(/(Channel '|' is unavailable)/g, ""));
	} else {

		var streamerDivHtmlOnline = [
			'<div class="streamerDiv online sortGroupA">',
	  		'<img src="' + data.stream.channel.logo + '"></img>',
	  		'<a href="https://www.twitch.tv/' + data.stream.channel.display_name + '">',
	  			'<h3>' + data.stream.channel.display_name + '</h3>',
	  		'</a>',
	    	'<p><em>' + data.stream.channel.game + ':' + data.stream.channel.status + '</em></p>',
			'</div>'
		];

		container.innerHTML += streamerDivHtmlOnline.join(''); 

	}

	/*
  var streamerDiv = document.createElement("div");
  document.getElementById("container").appendChild(streamerDiv);
	*/
};

function callbackFunctionChannels(data) {
	var missingAvatarUrl = "http://vignette3.wikia.nocookie.net/spore/images/6/6c/Question-mark.png"  
	
	if(data.status === 422) {
		var regExp = /'.+'/g;
		var accClosedName = data.message;
		var name = regExp.exec(accClosedName)[0].replace(/\'/g, "");

		var streamerDivHtmlAccClosed = [
			'<div class="streamerDiv accClosed sortGroupB">',
	  			'<img src="' + missingAvatarUrl + '"></img>',
	  			'<h3>' + name + '</h3>',
	    		'<p><em>Account Closed</em></p>',
			'</div>'
		];

		container.innerHTML += streamerDivHtmlAccClosed.join('');
	} else {
		var avatar = data.logo ? data.logo : missingAvatarUrl;

		var streamerDivHtmlOffline = [
			'<div class="streamerDiv offline sortGroupB">',
	  			'<img src="' + avatar + '"></img>',
	  			'<h3>' + data.display_name + '</h3>',
	    		'<p><em>Offline</em></p>',
			'</div>'
		];

		container.innerHTML += streamerDivHtmlOffline.join('');
	}

}


function getStreamers() {

	twitchUsers.forEach(function(streamer) {
		addScriptInjectionStreams(streamer);
	});
	
}

function getOfflineStreamer(username) {

	var scriptInjection = document.createElement("script");
	scriptInjection.src = "https://api.twitch.tv/kraken/channels/" + username + "?format=json&callback=callbackFunctionChannels";
	document.body.appendChild(scriptInjection);
	
}

window.addEventListener("load", getStreamers, false);
