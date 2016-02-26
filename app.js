"use strict";

var rp = require('request-promise')
  	, util= require('util')
		,	Q= require('Q')
		,	csvparse = require('csv-parse')		
  	, stringify = require('csv-stringify')
		, fs = require('fs')
		,	readline = require('readline')	  
  	, Transform = require('stream').Transform;


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

var csvparser = csvparse({delimiter: ';'});

var ripeopslag = new Transform({objectMode: true});
ripeopslag._transform = function(anvenderinfo, encoding, done) {
	var me= this;
  //console.log(util.inspect(anvenderinfo));
  options.qs['query-string']= anvenderinfo[0];
	rp(options)
    .then(function (response) {
    	var anvender= {};
    	if (response.statusCode === 200) {
				for (const elem of response.body.objects.object) {
					if (elem.type === 'organisation') {
		    		//console.log(elem.attributes.attribute);
		    		for (const org of elem.attributes.attribute) {
		    			if (org.name ==='org-name') {
		    				//console.log(org.value);
		    				anvender.navn= org.value;
		    			}
		    			else if (org.name ==='org-type') {
		    				//console.log(org.value);
		    				anvender.type= org.value;
		    			}
		    			else if (org.name ==='address') {
		    				//console.log(org.value);
		    				anvender.adresse= org.value;
		    			}
		    		}
		    	}
		    	else if (elem.type === 'inetnum') {
		    		//console.log(elem.attributes.attribute);
		    		for (const org of elem.attributes.attribute) {
		    			if (org.name ==='netname') {
		    				//console.log(org.value);
		    				anvender.navn= org.value;
		    			}
		    			else if (org.name ==='org-type') {
		    				//console.log(org.value);
		    				anvender.type= org.value;
		    			}
		    			else if (org.name ==='address') {
		    				//console.log(org.value);
		    				anvender.adresse= org.value;
		    			}
		    		}
		    	}
		    	else {
		    		console.log(elem.type);
		    	}
				}
				anvender.ip= anvenderinfo[0];
				anvender.data= anvenderinfo[1];
				if (anvender.navn) console.log("%s, %s, %s, %s, %s", anvender.navn, anvender.type, anvender.adresse, anvender.ip, anvender.data);

     			 me.push(anvender); 
			}
			else {
				console.log('Statuskode fra RIPE: ' + response.statusCode);
			}
			done(); 
        // Process html... 
    })
    .catch(function (err) {
      console.log('Fejl i RIPE opslag: ' + err)  
      done(); 
    });
}


var tocsv= stringify({header: true});
fs.createReadStream(__dirname+'/DataforbrugPrIP.csv').pipe(csvparser).pipe(ripeopslag).pipe(tocsv).pipe(fs.createWriteStream('anvendere.csv'));;
 
//fs.createReadStream(__dirname+'/kortliste.csv').pipe(csvparser).pipe(adresseparser).pipe(adresseopslag).pipe(fritekstopslag).pipe(vejnavnhusnrogpostnropslag).pipe(vejnavnoghusnropslag).pipe(tocsv).pipe(fs.createWriteStream('adresser.csv'));

		