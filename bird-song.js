var request = require('request')
var fs = require('fs')
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
  getRecordingFrom(chooseRecording(body).file)
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
  console.log("chose recording: ", recording)
  return recording
}

function getRecordingFrom (url) {
  console.log('would get recorind at: ', url)
  request
    .get(url)
    .on('error', function(err) {
      console.log('error getting file: ', err)
    })
    .pipe(fs.createWriteStream('bird-song.mp3'))
}

// request
//   .get(xenoCantoEndpoint, {
//     qs: requestParams
//   })
//   .on('error', function(err) {
//     console.log('error getting file: ', err)
//   })
//   .pipe(fs.createWriteStream('birdsong.mp3'))

