// Require
var 
	pjson = require('./package.json'),
	config = require('./app/config/config.json'),
	
	ip = require('ip'),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	request = require('request'),
	bodyParser = require('body-parser'),
	express = require('express');

// Variables
var 
	pathQueue = "./app/queue",
	expressResponse,
	retryTimeout;

// Proxy
var proxyPost = function( postData, fromQueue ) {

	var 
		url = config.proxy.url,
		date = new Date(),
		timestamp = date.getTime();

	// TEMPORARY // Add Randomness to make the request fail sometimes
	if ( Math.random() > 0.6 ) {
		url = 'http://bifrost-test.localhost:81';
	}
	// TEMPORARY //

	
	if ( !postData.timestamp ) postData.timestamp = timestamp;

	// TEMPORARY - read image from txt - final will be image from postData
	if ( !postData.image ) {
		
		fs.readFile( './app/data/gif.txt', 'utf-8', function(err, data) {
			if ( err ) throw err;

			postData.image = data;
			launchRequest( url, postData, fromQueue );
		});

	} else {

		launchRequest( url, postData, fromQueue );
	}
}

var launchRequest = function( url, postData, fromQueue ) {
	
	request.post( url, {form : postData}, function ( error, response, body ) {

		if (!error && response.statusCode == 200) {

			// retry from queue succeeded - delete file in queue
			if ( fromQueue ) {
				fs.unlink( pathQueue + '/' + postData.timestamp + '.txt', function(err) {
					if (err) throw err;
				});
			}
			else expressResponse.send( body );

		} else {

			// failed - handle error
			onProxyError( postData, fromQueue );
		}
	});
};

var onProxyError = function( postData, fromQueue ) {

	if ( fromQueue ) {

		// Failed again - keep in queue
		if ( retryTimeout ) clearTimeout( retryTimeout );
		retryTimeout = setTimeout( handleQueue, 5000 );

	} else {

		fsExtra.ensureDir( pathQueue, function(err) {
			if ( err ) throw err;
			writeQueuedFile( postData );
		} );
	}
};

var writeQueuedFile = function ( postData ) {
	
	// Write file in queue
	fs.writeFile( pathQueue + "/" + postData.timestamp + ".txt", JSON.stringify( postData ), function (err) {

		if ( err ) throw err;

		if ( retryTimeout ) clearTimeout( retryTimeout );
		retryTimeout = setTimeout( handleQueue, 5000 );

		expressResponse.send("Server is idle - data saved - automated retry upcoming.");
	});
};

var handleQueue = function() {

	// List files in /app/queue
	fs.readdir( pathQueue, function (err, files) {
		if (err) throw err;

		// Filter to remove unwanted files
		files = files.filter( function(a){ return a.match(/\.txt$/); } );
		if ( files.length == 0 ) clearTimeout( retryTimeout );

		// Retry post
		readQueuedFiles(files);
	});
};

var readQueuedFiles = function ( files ) {

	files.forEach( function( file ) {

		// Read file content and send post
		fs.readFile( pathQueue + '/' + file, function (err, data) {
			if (err) throw err;
			proxyPost( JSON.parse(data), true );
		});
	});
};

// INIT App
var app = express();

// Settings - bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Routes
app.get('/', function ( req, res ) {
	res.send('Bifrost has started!');
});

app.post('/', function ( req, res ) {
	expressResponse = res;
	proxyPost( req.body, false );
});


// Start server
var server = app.listen(3000, function () {
	
	var port = server.address().port;
	console.log('%s %s is running on http://%s:%s', pjson.name, pjson.version, ip.address(), port);
});

