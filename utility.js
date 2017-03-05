var fs = require('fs');
var Moment = require('moment');
var Jsonfile = require('jsonfile');
var Mailer = require('./mailer');
var Dropbox = require('./dropbox');

var file = './conf/config.json';
var config = Jsonfile.readFileSync(file);
var email = config["email"];
var dropbox = config["dropbox"];


module.exports.rmDir = function(dirPath) {
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
};

module.exports.sendAlarm = function(nameFile,dir){
      if(email)
        Mailer.sendEmail(nameFile,dir);
	    if(dropbox)
        Dropbox.dropboxUpload(nameFile,dir);
}

module.exports.isAlarmActive = function(timeStart,timeEnd,daysWeekAlarm) {
    var dateNow = Moment();
    if(daysWeekAlarm.includes(dateNow.days())) {
      alarmStartPars = timeStart.match(/(\d{2})(\d{2})/);
      alarmEndParse = timeEnd.match(/(\d{2})(\d{2})/);
      var dateNow = dateNow.set({'second': 0, 'millisecond': 0}).format("x");
      var dateAlarmStart = Moment().set({'hour': alarmStartPars[1], 'minute': alarmStartPars[2],'second': 0, 'millisecond': 0}).format("x");
      var dateAlarmEnd  = Moment().set({'hour': alarmEndParse[1], 'minute': alarmEndParse[2],'second': 0, 'millisecond': 0}).format("x");
      if(dateAlarmEnd-dateAlarmStart>0){
        if(dateNow>=dateAlarmStart && dateNow<=dateAlarmEnd)
        return true;
      } else if (dateNow>=dateAlarmStart || dateNow<=dateAlarmEnd)
          return true;
      return false;
    } else
        return false;  
}