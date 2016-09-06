'use strict'
var Alexa = require('alexa-sdk')
var CONFIG = require('./config.json')
var APP_ID = CONFIG.APP_ID
var SKILL_NAME = 'Aves'

/**
 * Array containing space facts.
 */
var BIRDS = require('./data/birds.json')

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
    'GetNewFactIntent': function () {
        this.emit('GetFact')
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        var factIndex = Math.floor(Math.random() * BIRDS.length)
        var randomBird = BIRDS[factIndex].name

        // Create speech output
        var speechOutput = 'Here\'s your bird: ' + randomBird + '. Its scientific name is: ' + BIRDS[factIndex].sciName

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomBird)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = 'You can say tell me a space fact, or, you can say exit... What can I help you with?'
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