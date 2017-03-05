var Dropbox = require('dropbox');
var Jsonfile = require('jsonfile');
var fs = require('fs');
var path = require('path');

var file = './conf/config.json';
var config = Jsonfile.readFileSync(file);
var tokenDropbox = config["tokenDropbox"];
var dbx = new Dropbox({ accessToken: tokenDropbox });


module.exports.dropboxUpload = function(fileName,pathFile) {
    countCall++;
    fs.readFile(path.join(__dirname, pathFile+fileName), function (err, contents) {
    if (err) {
        console.log('Error: ', err);
    }

    // This uploads basic.js to the root of your dropbox
    dbx.filesUpload({ path: config["pathDropbox"]+fileName, contents: contents })
        .then(function (response) {
            countCall--;
            console.log(response);
        })
        .catch(function (err) {
            countCall--;
            console.log(err);
        });
    });
}
