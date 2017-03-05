var nodemailer = require('nodemailer');
var Jsonfile = require('jsonfile');
var file = './conf/config.json';
var config = Jsonfile.readFileSync(file);

var mailSender = config["mailSender"];
var mailReceiver = config["mailReceiver"];
var passwordMailSender = config["passwordMailSender"];

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: mailSender,
    pass: passwordMailSender
  },
  tls: {
        rejectUnauthorized: false
    }
});

//var timerId;
 
module.exports.sendEmail = function(fileName,dir) {
  countCall++;
  /*if (timerId) return;
 
  timerId = setTimeout(function() {
    clearTimeout(timerId);
    timerId = null;
  }, 10000);*/
 
  console.log('Sendig an Email..');
 
  var mailOptions = {
    from: 'Pi Bot <arduinomailtest@gmail.com>',
    to: mailReceiver,
    subject: '[Pi Bot] Intruso rilevato',
    html: '<b>Emanuele</b>,<br/><br/>Qualcuno ha provato ad entrare. <br/><br/> At : ' + Date() + ' <br/>',
    attachments: [{
      filename: fileName,
      path: dir+fileName,
      //content: 'img'
    }]
  };
 
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      countCall--;
      console.log(error);
    } else {
      countCall--;
      console.log('Message sent: ' + info.response);
    }
  });
}