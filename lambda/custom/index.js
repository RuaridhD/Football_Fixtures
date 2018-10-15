/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require("ask-sdk");
const FootballApi = require("./lib/footballapi");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    console.log("Entered the launch request handler");
    const speechText =
      "Please choose a country you would like football fixtures for. I have information on the top league in England, Germany, Spain, Italy and Netherlands.";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Choose a league", speechText)
      .getResponse();
  }
};

const CountryIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "CountryIntent"
    );
  },
  async handle(handlerInput) {
    console.log("Entered the country intent handler");

    sessionAttr = handlerInput.attributesManager.getSessionAttributes();

    let country =
      handlerInput.requestEnvelope.request.intent.slots.country.value;

    let savedAttributes = {};
    savedAttributes.country = country;

    if ((country && savedAttributes.country) === undefined) {
      return handlerInput.responseBuilder
        .speak(
          "I didn't understand that. Please choose either England, Germany, Italy, Netherlands or Spain."
        )
        .reprompt("Please choose England, Germany, Italy, Netherlands or Spain")
        .getResponse();
    }

    switch (country) {
      case "England":
        var id = 2021;
        break;
      case "Netherlands":
        id = 2003;
        break;
      case "Spain":
        id = 2014;
        break;
      case "Germany":
        id = 2002;
        break;
      case "Italy":
        id = 2019;
        break;
    }

    savedAttributes.id = id;

    handlerInput.attributesManager.setSessionAttributes(savedAttributes);

    const competition = await FootballApi.getLeague(id);

    const speechText = `Which ${
      competition.name
    } matchday would you like fixtures for?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt()
      .withSimpleCard("Upcoming Fixtures", speechText)
      .getResponse();
  }
};

const FixtureIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "FixtureIntent"
    );
  },
  async handle(handlerInput) {
    console.log("Entered the fixture intent handler");
    let attributes = handlerInput.attributesManager.getSessionAttributes();

    let matchday =
      handlerInput.requestEnvelope.request.intent.slots.matchday.value;

    if (matchday === undefined) {
      return handlerInput.responseBuilder
        .speak("I didn't understand that. Please choose a matchday")
        .reprompt("Please choose a matchday")
        .getResponse();
    }

    const fixtures = await FootballApi.getFixtures(attributes.id, matchday);

    let matches = fixtures.matches;

    let results = [];

    for (let i = 0; i < matches.length; i++) {
      results.push(matches[i].homeTeam.name + " v " + matches[i].awayTeam.name);
    }

    const speechText = `The fixtures for matchday ${matchday} are: ${results
      .join(", ")
      .toString()
      .replace("&", "and")
      .replace(/AFC/g, "")
      .replace(/FC/g, "")}`;

    console.log(speechText);
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard("Upcoming Fixtures", speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "You can say hello to me!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = "Goodbye!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    CountryIntentHandler,
    FixtureIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
