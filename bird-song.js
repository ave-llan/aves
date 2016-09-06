var request = require('request')
var fs = require('fs')
var AWS = require('aws-sdk')
var http = require('follow-redirects').http
AWS.config.loadFromPath('./config.json')
var s3 = new AWS.S3()
var bucketName = require('./config.json').s3BucketName

var xenoCantoEndpoint = 'http://www.xeno-canto.org/api/2/recordings'

var speciesName = 'american robin'
var qualityRating = 'A'
var requestParams = {
  'query'          : speciesName + ' q:' + qualityRating
}


request.get(xenoCantoEndpoint, {
  qs: requestParams,
  json: true, // return body as json
}, function(error, _, body){
  var url = chooseRecording(body).file
  copyToS3(url, 'bird.mp3', function (err, data) {
    console.log('in response from s3 upload!')
    console.log(err,data)
  })
})


function chooseRecording (data) {
  var recording = data.recordings[0]
  // try to find type song
  for (var i = 0; i < data.recordings.length; i++) {
    if (data.recordings[i].type.includes('song')) {
      recording = data.recordings[i]
      break
    }
  }
  console.log('chose recording: ', recording)
  return recording
}

function copyToS3(url, key, callback) {
  http.get(url, function onResponse(response) {
    if (response.statusCode >= 300) {
      return callback(new Error('error ' + response.statusCode + ' retrieving ' + url))
    }
    var params = {Bucket: bucketName, Key: key, Body: response, ACL: 'public-read'}
    s3.upload(params, callback)
  })
  .on('error', function onError(err) {
    return callback(err)
    console.log('error getting file: ', err)
  })
}

function getRecordingFrom (url) {
  console.log('would get recorind at: ', url)
  request
    .get(url)
    .on('error', function(err) {
      console.log('error getting file: ', err)
    })
    .on('response', function (response) {
      console.log('going to upload to s3')
      if (200 == response.statusCode) {
        console.log('200 --- proceeding')

        var params = {Bucket: bucketName, Key: 'bird.mp3', Body: response, ACL: 'public-read'}

        s3.upload(params, function (err, data) {
          console.log('in response from s3 upload!')
          console.log(err,data)
        })
      }
    })
}

request
  .get(xenoCantoEndpoint, {
    qs: requestParams
  })
  .on('error', function(err) {
    console.log('error getting file: ', err)
  })
  .pipe(fs.createWriteStream('birdsong.mp3'))

