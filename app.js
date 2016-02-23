"use strict";

var rp = require('request-promise')
  	, util= require('util')
		,	Q= require('Q');;


var options = {
    uri: 'http://rest.db.ripe.net/search',
    qs: {
        'type-filter': 'inetnum',
        source: 'ripe',
        'query-string': '194.239.94.33'
    },
    headers: {
        'Accept': 'application/json'
    },
    resolveWithFullResponse: true, 
    simple: false,
    json: true  
};

Q.spawn(function* anvenderinfo() {
	var response= yield rp(options);
	//console.log(util.inspect(response.body.objects));
	if (response.statusCode === 200) {
		for (const elem of response.body.objects.object) {
			if (elem.type === 'organisation') {
    		//console.log(elem.attributes.attribute);
    		for (const org of elem.attributes.attribute) {
    			if (org.name ==='org-name') {
    				console.log(org.value);
    			}
    			else if (org.name ==='org-type') {
    				console.log(org.value);
    			}
    			else if (org.name ==='address') {
    				console.log(org.value);
    			}
    		}
    	}
    	else {
    		//console.log(elem.type);
    	}
		}
	}
	else {

	}
});

		