var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var busboy = require("connect-busboy");
var dateFormat = require('dateformat');
const queryString = require('querystring');


router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(busboy());

router.get('/', function(req, res){
	res.render('upload');
});

router.post('/', function(req, res){
	res.status(200);
	//res.send('Uploading files...');
	console.log('Received upload request');
	req.rawBody = '';
	data = new Buffer('');
	req.on('data', function (chunk){
		data = Buffer.concat([data, chunk]);
	});
	req.on('end', function(){
		req.rawBody = data;
		write(req, res);
		res.render('upload');
	});
});

function write(req, res){
	var filePath = __dirname + "/../../../data_server_uploads/test";
	console.log('File written to ', filePath);
	data = req.rawBody.toString('binary');
	data = data.substring(data.indexOf('\r\n\r\n')+4);
	data = data.substring(0, data.lastIndexOf('\n\r\n'));
	fs.writeFile(filePath, data, 'binary', function (err){
		if (err){
		}
	});
}

module.exports = router;

