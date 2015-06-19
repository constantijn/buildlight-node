var request = require('request');
var _ = require('underscore');
var lamp = new (require('delcom-indicator'))();

var currentStatus = '';
var currentStatusCount = 0;
var jenkinsStatusUrl = 'http://localhost:9000/api/json?tree=jobs[name,color]';
var monitoredJobNames = [
  'dhl-parcel-api',
  'dhl-parcel-site', 
  'dhl-parcel-business-site', 
  'dhl-parcel-pds-api'
];

var setLampTo = function(command) {
  if (lamp.isConnected()) { 
    lamp[command](); 
  }
}

var reportOk = function() {
  if (currentStatus !== 'GREEN') {
    currentStatus = 'GREEN';
    currentStatusCount = 0;
  }

  if(currentStatusCount++ < 10) {
    console.log('Status: GREEN (light on)');
    setLampTo('solidGreen');
  } else {
    console.log('Status: GREEN (light off)');
    setLampTo('turnOff');
  }
}

var reportWarning = function() {
  currentStatus = 'YELLOW';
  console.log('Status: YELLOW (light on)');
  setLampTo('solidBlue'); // blue = yellow
}

var reportError = function() {
  if (currentStatus !== 'RED') {
    currentStatus = 'RED';
    currentStatusCount = 0;
  }

  if(currentStatusCount++ < 30) {
    console.log('Status: RED (blink)');
    setLampTo('flashRed');
  } else {
    console.log('Status: RED (light on)');
    setLampTo('solidRed');
  }
}

var handleJenkinsResponse = function (jenkinsResponse) {
  var allJobs = jenkinsResponse.jobs;
  var monitoredJobs = _.filter(allJobs, function(job) { 
    return monitoredJobNames.indexOf(job.name) > -1;
  });

  var allHappy = true
  _.each(monitoredJobs, function(job) {
    var currentJobHappy = job.color === 'blue' || job.color === 'blue_anime';
  	allHappy = allHappy && currentJobHappy;
  	//console.log('Job [' + job.name + '] happy: ' + currentJobHappy);
  });

  if(allHappy) {
    reportOk();
  } else {
    reportError();
  }

}

var pollJenkins = function() {
  request(jenkinsStatusUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      handleJenkinsResponse(JSON.parse(body))
    } else {
      reportWarning();
    }
    // after we recieve a response, wait one second and poll again
    setTimeout(pollJenkins, 1000);
  });
}

console.log('Physical lamp connected? ' + lamp.isConnected())
pollJenkins();

