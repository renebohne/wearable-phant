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
        show(rd['cpm']);
    }
})
  }, updateTime);


process.on('SIGINT', function(){
	ws281x.reset();
	process.nextTick(function() { process.exit(0);})
});

function show(cpm)
{
	var renderData = new Uint32Array(NUMLEDS);
	for(var i=0; i<NUMLEDS;i++)
	{
		renderData[i] = 0;
		if(cpm > i)
		{
			renderData[i] = 0x0000FF;//blue
		}
	}
	ws281x.render(renderData);
}
