var publicKey = "3JwY0pGmNaT6yoQjX3WE";//PUT YOUR PUBLICK EY HERE
var privateKey = "oZyGvra2KWSzrxaE7n1j";//PUT YOUR PRIVATE KEY HERE

var Phant = require('phant-client').Phant;
var phant = new Phant();
var iri = 'https://data.sparkfun.com/streams/' + publicKey;
var fs = require('fs');
var updateTime = 25000; // ms -- default: 25000 = 25 seconds
var myStream  = null;

var  sys = require('util');
var  exec = require('child_process').exec;
var  child = null;

// connect to my data.sparkfun.com stream, if can't connect just quit
phant.connect(iri, function(error, streamd) {
    if (error) {
        console.log('+ error ${error}');
        process.exit(1);
    } else {
        console.log('Connected to '+iri);
        myStream = streamd;
        myStream.privateKey = privateKey;
    }
});

//send data every 25 seconds (default) to data.sparkfun.com
setInterval(function(){
    //console.log("reading sensor...");
    child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var cputemp = stdout;
       
      // post to my data.sparkfun.com stream
      phant.add(myStream, {temp: cputemp}, function(){
        console.log('Posted temp: '+cputemp);
      });
    }
  });}, updateTime);
