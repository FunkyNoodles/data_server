var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var busboy = require("connect-busboy");
var dateFormat = require('dateformat');
var formidable = require('formidable');
const queryString = require('querystring');


router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(busboy());

router.get('/', function(req, res){
	res.render('upload');
});

router.post('/', function(req, res){
	// res.status(200);
	// //res.send('Uploading files...');
	// console.log('Received upload request');
	// req.rawBody = '';
	// var data = new Buffer('');
	// req.on('data', function (chunk){
	// 	data = Buffer.concat([data, chunk]);
	// });
	// req.on('end', function(){
	// 	req.rawBody = data;
	// 	write(req, res);
	// 	res.render('upload');
	// });
	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// store all uploads in the /uploads directory
	
	form.uploadDir = path.join(__dirname, '/../');

	// every time a file has been uploaded successfully,
	// rename it to it's orignal name
	form.on('file', function(field, file) {
		var curDate = new Date();
		var dateString = curDate.getFullYear().toString() + '-' + (curDate.getMonth() + 1).toString() + '-' +
			curDate.getDate().toString() + '-' + curDate.getHours().toString() + '-' +
			curDate.getMinutes().toString() + '-' + curDate.getSeconds().toString();
		// dateString = dateString.replace(re, '-');
		fs.rename(file.path, path.join(form.uploadDir, dateString + file.name));
	});

	// log any errors that occur
	form.on('error', function(err) {
	console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {
		res.render('upload');
	});

	// parse the incoming request containing the form data
	form.parse(req);
});

module.exports = router;

