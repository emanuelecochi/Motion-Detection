// importo i moduli necessari
var PiCamera = require('./piCamera');
var Gpio = require('pigpio').Gpio;
var Jsonfile = require('jsonfile');
var sleep = require('sleep');
var Utility = require("./utility");

// definisco i pin I/O del raspberry
pirSx = new Gpio(14, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE
}),
pirDx = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE
}),
motor = new Gpio(15, {
    mode: Gpio.OUTPUT
}),
led = new Gpio(18, {
    mode: Gpio.OUTPUT
});

// definisco alcune variabili per la gestione del sistema
nameFile = "";
isWorking = false;
isRecTake = false;
var timerIdSx;
var timerIdDx;
countCall = 0;

// carico il file di configurazione
var file = './conf/config.json';
var config = Jsonfile.readFileSync(file);
pulseWidthSx = config["pulseWidthSx"];
pulseWidthDx = config["pulseWidthDx"];
pulseWidthCenter = config["pulseWidthCenter"];
delayCamera = config["delayCamera"];
dirVideo = config["dirVideo"];
dirPhoto = config["dirPhoto"];
timeOutPir = config["timeOutPir"];
alarmStart = config["alarmStart"];
alarmEnd = config["alarmEnd"];
daysWeekAlarm = config["daysWeekAlarm"];
daysForeverActive = config["daysForeverActive"];
timeRmDir = config["timeRmDir"];

// setto l'intervallo per la pulizia delle cartelle foto e video
setInterval(function(){
  if(countCall==0) {
    Utility.rmDir(dirPhoto);
    Utility.rmDir(dirVideo);
  }
}, timeRmDir*60*1000);

// inizializzo il sistema
if(pirSx.digitalRead() == 1 && !isWorking && Utility.isAlarmActive(alarmStart,alarmEnd,daysWeekAlarm,daysForeverActive)){
    motionDetectionSx(function(){
        if(pirDx.digitalRead() == 1){
            motionDetectionDx(function(){});
        }
    });
}else if (pirDx.digitalRead() == 1 && !isWorking && Utility.isAlarmActive(alarmStart,alarmEnd,daysWeekAlarm,daysForeverActive)){
    motionDetectionDx(function(){});
} else
    init();


// controllo lo stato del pirSx
pirSx.on('interrupt', function (level) {
    console.log("SX");
    if(!isWorking && Utility.isAlarmActive(alarmStart,alarmEnd,daysWeekAlarm,daysForeverActive)) {
        motionDetectionSx(function() {
            if(pirDx.digitalRead() == 1){
                motionDetectionDx(function(){});
            }
        });
    }
});

// controllo lo stato del pirDx
pirDx.on('interrupt', function (level) {
    console.log("DX");
    if(!isWorking && Utility.isAlarmActive(alarmStart,alarmEnd,daysWeekAlarm,daysForeverActive)) {
        motionDetectionDx(function() {
            if(pirSx.digitalRead() == 1){
                motionDetectionSx(function(){});
            }    
        });
    }  
});

// rilevamento intrusi Sx
function motionDetectionSx(fn) {
    /*if (timerIdSx) return;

    timerIdSx = setTimeout(function() {
        clearTimeout(timerIdSx);
        timerIdSx = null;
    }, timeOutPir);*/
    
    isWorking = true;
    console.log("pirSx attivato");
    motor.servoWrite(pulseWidthSx);
    while(motor.getServoPulseWidth() != pulseWidthSx){}
    console.log("Rotazione a sx completata");
    led.digitalWrite(1);
    while(led.digitalRead() != 1){}
    console.log("Led acceso");
    sleep.msleep(delayCamera);
    /*PiCamera.recordVideo(dirVideo, function() {
        init();
        Utility.sendAlarm(nameFile,dirVideo);
        fn();
    });*/
    PiCamera.takePicture(dirPhoto, function() {
        init();
        Utility.sendAlarm(nameFile,dirPhoto);
        fn();
    });
}

// rilevamento intrusi Dx
function motionDetectionDx(fn) {
    /*if (timerIdDx) return;

    timerIdDx = setTimeout(function() {
        clearTimeout(timerIdDx);
        timerIdDx = null;
    }, timeOutPir);*/

    isWorking = true;
    console.log("pirDx attivato");
    motor.servoWrite(pulseWidthDx);
    while(motor.getServoPulseWidth() != pulseWidthDx){}
    console.log("Rotazione a dx completata");
    led.digitalWrite(1);
    while(led.digitalRead() != 1){}
    console.log("Led acceso");
    sleep.msleep(delayCamera);
    /*PiCamera.recordVideo(dirVideo, function() {
        init();
        Utility.sendAlarm(nameFile,dirVideo);
        fn();
    });*/
    PiCamera.takePicture(dirPhoto, function() {
        init();
        Utility.sendAlarm(nameFile,dirPhoto);
        fn();
    });
}

// inizializzazione del sistema
function init() {
    isWorking = true;
    motor.servoWrite(pulseWidthCenter);
    while(motor.getServoPulseWidth() != pulseWidthCenter){}
    console.log("Servo in posizione centrale");
    led.digitalWrite(0);
    while(led.digitalRead() != 0){}
    console.log("Led spento");
    isWorking = false;
}

