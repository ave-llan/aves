var request = require('request')
var wikiEndpoint = 'https://en.wikipedia.org/w/api.php'

/**
 * @param params.searchTerms {String} - what to search for on wikipedia 
 * @param params.numSentences {Int} - number of sentences to return from the article
 */
module.exports = function (params, callback) {
  var numSentences = params.numSentences || 2
  var requestParams = {
    'format'         : 'json',
    'action'         : 'query',
    'prop'           : 'extracts',
    'exintro'        : '',
    'explaintext'    : '', 
    'redirects'      : '',
    'exsectionformat': 'plain',
    'exsentences'    : numSentences,
    'titles'         : params.searchTerms
  }

  request.get(wikiEndpoint, {
    qs: requestParams,
    json: true, // return body as json
  }, function(error, _, body){
    var key = Object.keys(body.query.pages)[0]
    callback(error, body.query.pages[key].extract)
  })
}
