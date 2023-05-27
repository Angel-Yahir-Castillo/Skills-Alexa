/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
  en: {
    translation: {
      WELCOME_MESSAGE: 'Hello, I can convert currencies between dollars, pesos and euros',
      HELP_MESSAGE: 'Hello, I can convert currencies between dollars, pesos and euros',
      GOODBYE_MESSAGE: 'Goodbye!',
      REFLECTOR_MESSAGE: 'You just triggered %s',
      FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
      ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
      VALIDACION:'Enter only positive numbers, for example 5',
      EURO_DOLAR: 'the conversion of %s euros equals a %s in dollars',
      EURO_PESO: 'the conversion of %s euros equals a %s in pesos',
      PESO_DOLAR: 'the conversion of %s pesos equals a %s in dollars',
      PESO_EURO: 'the conversion of %s pesos equals a %s in euros',
      DOLAR_PESO: 'the conversion of %s dollars equals a %s in pesos',
      DOLAR_EURO: 'the conversion of %s dollars equals a %s in euros',
    }
  },
  es:{
    translation: {
      WELCOME_MESSAGE: 'Hola, puedo convertir divisas entre dolares, pesos y euros',
      HELP_MESSAGE: 'Hola, puedo convertir divisas entre dolares, pesos y euros',
      GOODBYE_MESSAGE: 'Hasta luego!',
      REFLECTOR_MESSAGE: 'Acabas de activar %s',
      FALLBACK_MESSAGE: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
      ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.',
      VALIDACION: 'Ingresa solo numeros positivos, por ejemplo 5',
      EURO_DOLAR: 'la conversion de %s euros equivale a %s en dolares',
      EURO_PESO: 'la conversion de %s euros equivale a %s en pesos',
      PESO_DOLAR: 'la conversion de %s pesos equivale a %s en dolares',
      PESO_EURO: 'la conversion de %s pesos equivale a %s en euros',
      DOLAR_PESO: 'la conversion de %s dolares equivale a %s en pesos',
      DOLAR_EURO: 'la conversion de %s dolares equivale a %s en euros',
    }
  }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertirEuroDolarHandler={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirEuroDolar'
    },
    handle(handlerInput){
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        if(cantidad>=1)
        {
            const valor = 1.12;
            const resultado = (cantidad * valor).toFixed(2);
            const speakOutput= requestAttributes.t('EURO_DOLAR',cantidad,resultado);
            const repromptOutput= '¿Deseas convertir alguna otra cantidad?';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        else{
            const speakOutput = requestAttributes.t('VALIDACION');
            const repromptOutput = 'Prueba de nuevo con una cantidad válida';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
}

const ConvertirEuroPesosHandler={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirEuroPesos'
    },
    handle(handlerInput){
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        if(cantidad>=1)
        {
            const valor = 19.01;
            const resultado = (cantidad * valor).toFixed(2);
            const speakOutput= requestAttributes.t('EURO_PESO',cantidad,resultado);
            const repromptOutput= 'deseas convertir alguna otra cantidad';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        else{
            const speakOutput = requestAttributes.t('VALIDACION');
            const repromptOutput = 'Prueba de nuevo con una cantidad válida';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
}


const ConvertirDolarPesosHandler={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirDolarPesos'
    },
    handle(handlerInput){
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        if(cantidad>=1)
        {
            const valor = 17.50;
            const resultado = (cantidad * valor).toFixed(2);
            const speakOutput= requestAttributes.t('DOLAR_PESO',cantidad,resultado);
            const repromptOutput= 'deseas convertir alguna otra cantidad';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        else{
            const speakOutput = requestAttributes.t('VALIDACION');
            const repromptOutput = 'Prueba de nuevo con una cantidad válida';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
}

const ConvertirDolarEuroHandler={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirDolarEuro'
    },
    handle(handlerInput){
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        if(cantidad>=1)
        {
            const valor = 0.92;
            const resultado = (cantidad * valor).toFixed(2);
            const speakOutput= requestAttributes.t('DOLAR_EURO',cantidad,resultado);
            const repromptOutput= 'deseas convertir alguna otra cantidad';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        else{
            const speakOutput = requestAttributes.t('VALIDACION');
            const repromptOutput = 'Prueba de nuevo con una cantidad válida';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
}


const ConvertirPesosDolarHandler={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirPesosDolar'
    },
    handle(handlerInput){
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        if(cantidad>=1)
        {
            const valor = 0.057;
            const resultado = (cantidad * valor).toFixed(2);
            const speakOutput= requestAttributes.t('PESO_DOLAR',cantidad,resultado);
            const repromptOutput= 'deseas convertir alguna otra cantidad';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        else{
            const speakOutput = requestAttributes.t('VALIDACION');
            const repromptOutput = 'Prueba de nuevo con una cantidad válida';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
}

const ConvertirPesosEuroHandler={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirPesosEuro'
    },
    handle(handlerInput){
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        if(cantidad>=1)
        {
            const valor = 0.053;
            const resultado = (cantidad * valor).toFixed(2);
            const speakOutput= requestAttributes.t('PESO_EURO',cantidad,resultado);
            const repromptOutput= 'deseas convertir alguna otra cantidad';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        else{
            const speakOutput = requestAttributes.t('VALIDACION');
            const repromptOutput = 'Prueba de nuevo con una cantidad válida';
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
}


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertirEuroDolarHandler,
        ConvertirEuroPesosHandler,
        ConvertirPesosDolarHandler,
        ConvertirPesosEuroHandler,
        ConvertirDolarEuroHandler,
        ConvertirDolarPesosHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();