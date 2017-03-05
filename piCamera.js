var RaspiCam = require("raspicam");
var Jsonfile = require('jsonfile');

var file = './conf/config.json';
var config = Jsonfile.readFileSync(file);
timeVideo = config["timeVideo"];
timePhoto = config["timePhoto"];
framerate = config["framerate"];
quality = config["quality"];
width = config["width"];
height = config["height"];
rotation = config["rotation"];
nopreview = config["nopreview"];
sharpness = config["sharpness"];
brightness = config["brightness"];
awb = config["awb"];

module.exports.recordVideo = function(dir, fn) {
    var camera = new RaspiCam({
	    mode: "video",
	    output: dir+"video_"+new Date().toLocaleString()+".mp4",
	    framerate: framerate,
	    timeout: timeVideo,
        width: width,
        height: height,
        rotation: rotation,
        sharpness: sharpness,
        nopreview: nopreview 
    });

    camera.on("start", function( err, timestamp ){
        console.log("video started at " + timestamp );
    });

    camera.on("read", function( err, timestamp, filename ){
        console.log("video captured with filename: " + filename + " at " + timestamp );
        nameFile =  filename;           
    });

    camera.on("exit", function( timestamp ){
        console.log("video child process has exited at " + timestamp );
        camera.stop();
        fn();
    });

    camera.start();
}

module.exports.takePicture = function(dir, fn) {
    var camera = new RaspiCam({
        mode: "photo",
        output: dir+"photo_"+new Date().toLocaleString()+".jpg",
        encoding: "jpg",
        timeout: timePhoto ,// take the picture immediately
        quality: quality,
        width: width,
        height: height,
        brightness: brightness,
        rotation: rotation,
        awb: awb,
        sharpness: sharpness,
        nopreview: nopreview
    });

    camera.on("start", function( err, timestamp ){
        console.log("photo started at " + timestamp );
    });

    camera.on("read", function( err, timestamp, filename ){
        console.log("photo image captured with filename: " + filename );
        nameFile =  filename;
    });

    camera.on("exit", function( timestamp ){
        console.log("photo child process has exited at " + timestamp );
        camera.stop();
        fn();
    });

    camera.start();
}