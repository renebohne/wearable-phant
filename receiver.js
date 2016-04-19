var NUMLEDS = 32; //number of LEDs
var publicKey = "VGQyXw6JortX3gKoOqaq";//PUBLIC KEY of the data stream
var fieldName = "cpm"; //the name of the data field that we are interested in

var ws281x = require('rpi-ws281x-native');
var Phant = require('phant-client').Phant;
var phant = new Phant();
var iri = 'https://data.sparkfun.com/streams/' + publicKey;
var fs = require('fs');
var updateTime = 30000; // ms -- default: 30000 = 30 seconds
var myStream  = null;
var  sys = require('util');
var  exec = require('child_process').exec;
var  child = null;


ws281x.init(NUMLEDS);

// connect to my data.sparkfun.com stream, if can't connect just quit
phant.connect(iri, function(error, streamd) {
    if (error) {
        console.log('+ error ${error}');
        process.exit(1);
    } else {
        console.log('Connected to '+iri);
        myStream = streamd;
    }
});

//send data every 25 seconds (default) to data.sparkfun.com
setInterval(function(){
    //console.log("fetching geiger data...");
    phant.latest(myStream, function(error, rd) {
    if (error) {
        console.log("# error", error)
    } else if (rd === null) {
        console.log("+ eof")
    } else {
        console.log("+ got", rd['cpm'])
    }
})
  }, updateTime);


process.on('SIGINT', function(){
	ws281x.reset();
	process.nextTick(function() { process.exit(0);})
});

function visualisation()
{
  var uint32 = new Uint32Array(64);
		var count = 0;
		for(var i=4; i<uint8.length;i=i+3)
		{
			uint32[count] = (uint8[i] << 16) | (uint8[i+1] <<8) | uint8[i+2];				count++;
			
		}
		ws281x.render(uint32);
}
