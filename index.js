'use strict'
var Alexa = require('alexa-sdk')
var CONFIG = require('./config.json')
var wiki = require('./wikipedia')
var APP_ID = CONFIG.APP_ID
var SKILL_NAME = 'Aves'

/**
 * Array containing space facts.
 */
var BIRDS = require('./data/birds.json')
var birdNames = {}
BIRDS.forEach(function (bird) {
  birdNames[bird.name.toLowerCase()] = bird.sciName
})

var intros = [
  'Here\'s your bird: ',
  'Your bird is the '
]

var follow_ups = [
  'Want another? I\'ve got ' + (BIRDS.length - 1) + ' more.',
  '',
  'Ask for another bird.',
  'Have you seen it before?',
  'Happy birding!'
]

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context)
  alexa.APP_ID = APP_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

var handlers = {
  'LaunchRequest': function () {
    this.emit('GetFact')
  },
  'GetNewBird': function () {
    this.emit('GetFact')
  },
  'GetFact': function () {
    // Get a random space fact from the space facts list
    var birdIndex = Math.floor(Math.random() * BIRDS.length)
    var randomBird = BIRDS[birdIndex].name
    var intro = intros[Math.floor(intros.length * Math.random())]
    var followUp = follow_ups[Math.floor(follow_ups.length * Math.random())]

    // Create speech output
    var speechOutput = intro + randomBird + '. '
    var self = this
    wiki({
      numSentences: 2,
      searchTerms: BIRDS[birdIndex].sciName
    }, function (error, description) {
      if (error || !description) {
        speechOutput = speechOutput + followUp
      } else {
        speechOutput = speechOutput + description + '. ' + followUp
        self.emit(':tellWithCard', speechOutput, SKILL_NAME, randomBird)
      }
    })
  },
  'GetBirdInfo': function () {
    var bird = this.event.request.intent.slots.Bird.value.toLowerCase()
    var speechOutput = 'You asked me about the ' + bird + '.'
    if (bird in birdNames) {
      var self = this
      wiki({
        numSentences: 2,
        searchTerms: birdNames[bird]
      },
      function (error, description) {
        if (error || !description) {
          speechOutput = 'I couldn\'t find any info about the ' + bird + '.'
        } else {
          speechOutput = description
          self.emit(':tellWithCard', speechOutput, SKILL_NAME, bird)
        }
        self.emit(':tellWithCard', speechOutput, SKILL_NAME, bird)
      })
    } else {
      speechOutput = 'I\'m afraid I don\'t know anything about a bird called the ' + bird + '.'
      this.emit(':tellWithCard', speechOutput, SKILL_NAME, bird)
    }
  },
  'AMAZON.HelpIntent': function () {
    var speechOutput = 'You can say, "Aves, give me a bird"... and I\'ll tell you about a bird.'
    var reprompt = 'What can I help you with?'
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'Goodbye!')
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Goodbye!')
  }
}

