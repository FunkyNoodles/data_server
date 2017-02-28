var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs');
var orientDB = require('orientjs');
var dateFormat = require('dateformat');
const queryString = require('querystring');

var dataServer = orientDB({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: 'password'
});

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var dataPoints = {};

router.get('/:eventName', function(req, res){
	res.status(200);
	var eventName = req.params.eventName;
	if(req.url.indexOf('?') >= 0){
		queryParams = queryString.parse(req.url.replace(/^.*\?/, ''));
		console.log(queryParams);
		if(queryParams.type == 'start'){
			// Create the new object if it's a new event
			if (dataPoints[eventName] == undefined){
				dataPoints[eventName] = new Object();
			}
			if (dataPoints[eventName].start != undefined){
				console.log('Invalid request, expected stop, but got start');
				res.send('0');
				return;
			}
			dataPoints[eventName].start = queryParams.time;
		}else if (queryParams.type == 'stop'){
			// No such event
			if (dataPoints[eventName] == undefined){
				console.log('Invalid request, no such event');
				res.send('0');
				return;
			}
			if (dataPoints[eventName].start == undefined){
				console.log('Invalid request, expected start, but got stop');
				res.send('0');
				return;
			}
			dataPoints[eventName].stop = queryParams.time;

			// Now log this event
			console.log(dataPoints[eventName]);
			var db = dataServer.use({
				name: 'DataServer',
				username: 'writer',
				password: 'password'
			});
			db.query('create vertex DataPoint set name=:nameArg, startTime=:startArg, stopTime=:stopArg', {
				params:{nameArg: eventName, startArg: dataPoints[eventName].start, stopArg: dataPoints[eventName].stop}
			}).then(function (response){

			});
			delete dataPoints[eventName];
		}

		res.send('1');
	}else{
		res.send('0');
	}

});


module.exports = router;

