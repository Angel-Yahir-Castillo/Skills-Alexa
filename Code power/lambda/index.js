const Alexa = require('ask-sdk-core');

const persistence = require('./persistence');
const interceptors = require('./interceptors');

var nombreIngresado = false;
var numPreguntas = 0;
var cantCorrectas = 0;
const respuestas = ['C','B','A','A','C','B','B','A','B','C'];
var numDiapositiva = 0;
var curso = false;

const DOCUMENT_ID = "plantillaResponsivaDocument"; //plantillaDocuement";
const DOCUMENT_PREGUNTAS = "preguntasDocument";
const DOCUMENT_RESPUESTAS = "respuestasDocument";
const DOCUMENT_COMP = "complementosDocument";
const DOCUMENT_CURSO = "diapositivasDocument";

var datasource = {
    "plantillaDataSource": {
        "primaryText": "Bienvenido, aqui aprenderas a programar. Puedes elegir algun tema como tipos de datos o declaracion de variables.",
        "imagenSource": "https://pa1.aminoapps.com/6661/9838d313f21c1eb36f57d2b9e2c7a0279d525aa1_hq.gif"
    },
    "cuestionarioDataSource": {
        "title": "Cuestionario sobre tipos de datos",
        "numPregunt": "Pregunta 1",
        "pregunta": "¿Cuál de los siguientes es un tipo de dato entero?, Respuestas:",
        "respuestas": "A) 3.14, B) 'Hola', C) 42",
        "imagenSource": "https://www.igualia.com/images/icono-cuestionario-evaluacion.png",
        "pie": "Debes decir: la respuesta es A"
    },
    "respuestaDataSource": {
        "title": "Cuestionario sobre tipos de datos",
        "puntuacion": "tu puntuacion es: 1 respuestas correctas de 3 . Puedes pasar a la siguiente pregunta o finalizar el examen diciendo 'Finalizar examen'",
        "evaluado": "Respuesta Correcta",
        "imagenSource": "https://static.vecteezy.com/system/resources/previews/010/142/101/original/check-mark-icon-sign-symbol-design-free-png.png",
        "color": "green"
    },
    "complementosDataSource": {
        "primaryText": " Nombre guardado",
        "secondaryText": "Hola Angel , ahora puedes tomar el curso de tipos de datos o iniciar la evaluacion.",
        "imagenSource": "https://www.playgreens.com/wp-content/uploads/2017/07/ok.png",
        "colorPrimary": "red",
        "colorSecondary": "green"
    },
    "diapositivasDataSource": {
        "primaryText": "Diccionarios",
        "secondaryText": "Representan una colección de pares clave-valor. Cada elemento se almacena como una clave y su correspondiente valor. Se utilizan para buscar y almacenar datos de manera eficiente. Ejemplo: {'nombre': 'Juan', 'edad': 25, 'ciudad': 'Madrid'}.",
        "colorPrimary": "black",
        "colorSecondary": "#143D59",
        "pie": "You can say: Next or Previus"
    }
};

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        let speakOutput = handlerInput.t('WELCOME_MSG');
        datasource['plantillaDataSource']['primaryText'] = handlerInput.t('WELCOME_MSG');
        datasource['plantillaDataSource']['imagenSource'] = "https://pa1.aminoapps.com/6661/9838d313f21c1eb36f57d2b9e2c7a0279d525aa1_hq.gif";
        
        const nombre = sessionAttributes['nombre'];
        const score = sessionAttributes['puntuacion'];
        
        if(nombre && score){
            speakOutput = handlerInput.t('WELCOME_MSG') + handlerInput.t('SCORE_GUARDADO', {nombre:nombre, score:score});
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AnteriorDiapositivaIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AnteriorDiapositivaIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        let speechText = handlerInput.t('PEDIR_NOMBRE');
        let documento = DOCUMENT_COMP;
        
        datasource['complementosDataSource']['primaryText'] = handlerInput.t('PEDIR_NOMBRE');
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['colorPrimary'] = 'blue';
        datasource['complementosDataSource']['colorSecondary'] = 'blue';
        datasource['complementosDataSource']['imagenSource'] = 'https://static.vecteezy.com/system/resources/previews/020/251/446/non_2x/confused-man-wondering-looking-for-problem-solution-pensive-young-guy-frustrated-with-trouble-thinking-and-brainstorming-illustration-free-vector.jpg';
            
        if(curso && nombreIngresado){
            if(numDiapositiva>0){
                numDiapositiva--;
            }
            
            if(numDiapositiva===0)
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_01');
            else if(numDiapositiva === 8)
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_03');
            else
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_02');
                
            const texto = handlerInput.t('TEMA_' + numDiapositiva);
            var arrayDeCadenas = texto.split(':');
            speechText = texto;
            
            datasource['diapositivasDataSource']['primaryText'] = arrayDeCadenas[0];
            datasource['diapositivasDataSource']['secondaryText'] = arrayDeCadenas[1] + arrayDeCadenas[2];
            documento = DOCUMENT_CURSO;

        }
        else if(nombreIngresado) {
            speechText = handlerInput.t('INICIA_CURSO');
            datasource['complementosDataSource']['primaryText'] = handlerInput.t('INICIA_CURSO');
            datasource['complementosDataSource']['imagenSource'] = 'https://static.educaweb.com/img/news/nuevo_curso.jpg';
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(documento,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const SiguienteDiapositivaIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SiguienteDiapositivaIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        let speechText = handlerInput.t('PEDIR_NOMBRE');
        let documento = DOCUMENT_COMP;
        
        datasource['complementosDataSource']['primaryText'] = handlerInput.t('PEDIR_NOMBRE');
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['colorPrimary'] = 'blue';
        datasource['complementosDataSource']['colorSecondary'] = 'blue';
        datasource['complementosDataSource']['imagenSource'] = 'https://static.vecteezy.com/system/resources/previews/020/251/446/non_2x/confused-man-wondering-looking-for-problem-solution-pensive-young-guy-frustrated-with-trouble-thinking-and-brainstorming-illustration-free-vector.jpg';
            
        if(curso && nombreIngresado){
            if(numDiapositiva<8){
                numDiapositiva++;
            }
            
            if(numDiapositiva===0)
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_01');
            else if(numDiapositiva === 8)
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_03');
            else
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_02');
                
            const texto = handlerInput.t('TEMA_' + numDiapositiva);
            var arrayDeCadenas = texto.split(':');
            speechText = texto;
            
            datasource['diapositivasDataSource']['primaryText'] = arrayDeCadenas[0];
            datasource['diapositivasDataSource']['secondaryText'] = arrayDeCadenas[1] + arrayDeCadenas[2];
            
            if(numDiapositiva === 7)
                datasource['diapositivasDataSource']['secondaryText'] = arrayDeCadenas[1] + arrayDeCadenas[2] + arrayDeCadenas[3] + arrayDeCadenas[4] + arrayDeCadenas[5];
            documento = DOCUMENT_CURSO;

        }
        else if(nombreIngresado) {
            speechText = handlerInput.t('INICIA_CURSO');
            datasource['complementosDataSource']['primaryText'] = handlerInput.t('INICIA_CURSO');
            datasource['complementosDataSource']['imagenSource'] = 'https://static.educaweb.com/img/news/nuevo_curso.jpg';
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(documento,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const IniciarCursoIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'IniciarCursoIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        let speechText = handlerInput.t('PEDIR_NOMBRE');
        let documento = DOCUMENT_COMP;
        datasource['complementosDataSource']['primaryText'] = handlerInput.t('PEDIR_NOMBRE');
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['colorPrimary'] = 'blue';
        datasource['complementosDataSource']['colorSecondary'] = 'blue';
        datasource['complementosDataSource']['imagenSource'] = 'https://static.vecteezy.com/system/resources/previews/020/251/446/non_2x/confused-man-wondering-looking-for-problem-solution-pensive-young-guy-frustrated-with-trouble-thinking-and-brainstorming-illustration-free-vector.jpg';
        
        if(nombreIngresado){
            
            if(numDiapositiva===0)
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_01');
            else if(numDiapositiva === 8)
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_03');
            else
                datasource['diapositivasDataSource']['pie'] = handlerInput.t('PIE_CURSO_02');
                
            const texto = handlerInput.t('TEMA_' + numDiapositiva);
            var arrayDeCadenas = texto.split(':');
            speechText = texto;
            
            datasource['diapositivasDataSource']['primaryText'] = arrayDeCadenas[0];
            datasource['diapositivasDataSource']['secondaryText'] = arrayDeCadenas[1];
            
            documento = DOCUMENT_CURSO;
            curso = true;
            
        }

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(documento,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const TerminarCuestionarioIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TerminarCuestionarioIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        if(intent.confirmationStatus !== 'CONFIRMED') {
            datasource['complementosDataSource']['primaryText'] = handlerInput.t('SEGUIR');
            datasource['complementosDataSource']['secondaryText'] = ' ';
            datasource['complementosDataSource']['colorPrimary'] = 'blue';
            datasource['complementosDataSource']['colorSecondary'] = 'blue';
            datasource['complementosDataSource']['imagenSource'] = 'https://previews.123rf.com/images/sarahdesign/sarahdesign1509/sarahdesign150900623/44517767-bot%C3%B3n-continuar.jpg';
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_COMP,datasource);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
        
            return handlerInput.responseBuilder
                .speak(handlerInput.t('SEGUIR'))
                .reprompt(handlerInput.t('HELP_MSG'))
                .getResponse();
        }
        const puntuacion = ((cantCorrectas / numPreguntas)*10).toFixed(2);
        sessionAttributes['puntuacion'] = puntuacion;
        const name = sessionAttributes['nombre'];
        
        let speechText = handlerInput.t('SCORE',{name:name,puntuacion:puntuacion});
        //nombreIngresado = false;
        numPreguntas = 0;
        cantCorrectas = 0;
        
        datasource['complementosDataSource']['primaryText'] = speechText;
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['imagenSource'] = 'https://img.freepik.com/fotos-premium/podio-ganador-oro-negro-sobre-fondo-blanco-aislado-ilustracion-3d_394271-2978.jpg';
            
            
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_COMP,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const ContinarCuestionarioIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ContinarCuestionarioIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        let speechText = handlerInput.t('PEDIR_NOMBRE');
        let documento = DOCUMENT_COMP;
        
        datasource['complementosDataSource']['primaryText'] = handlerInput.t('PEDIR_NOMBRE');
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['colorPrimary'] = 'blue';
        datasource['complementosDataSource']['colorSecondary'] = 'blue';
        datasource['complementosDataSource']['imagenSource'] = 'https://static.vecteezy.com/system/resources/previews/020/251/446/non_2x/confused-man-wondering-looking-for-problem-solution-pensive-young-guy-frustrated-with-trouble-thinking-and-brainstorming-illustration-free-vector.jpg';
            
        if(nombreIngresado){
            if( numPreguntas<10 && numPreguntas>0 ){
                speechText = handlerInput.t('QUESTION_' + numPreguntas) + handlerInput.t('ANSWER_' + numPreguntas);
                datasource['cuestionarioDataSource']['title'] = handlerInput.t('TITULO');
                datasource['cuestionarioDataSource']['numPregunt'] = handlerInput.t('NUM_PRE', {numPregunta: numPreguntas+1});
                datasource['cuestionarioDataSource']['respuestas'] = handlerInput.t('ANSWER_' + numPreguntas);
                datasource['cuestionarioDataSource']['pregunta'] = handlerInput.t('QUESTION_' + numPreguntas);
                datasource['cuestionarioDataSource']['pie'] = handlerInput.t('PIE_CUESTIONARIO');
                documento = DOCUMENT_PREGUNTAS;
            }
            else{
                speechText = handlerInput.t('INICIA_CUEST');
                datasource['complementosDataSource']['primaryText'] = handlerInput.t('INICIA_CUEST');
                datasource['complementosDataSource']['imagenSource'] = 'https://static.s123-cdn-static-c.com/uploads/1280159/2000_5b4e35a4090f1.png';
            }
        }
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(documento,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const RegisterAnswerIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RegisterAnswerIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const respuestaDada = intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let speechText,color,evaluacion, puntuacion,imgSource;
        
        numPreguntas++;
        if(respuestas[numPreguntas-1] === respuestaDada){
            cantCorrectas++;
            speechText = handlerInput.t('RESPUESTA_CORR',{cantCorrectas:cantCorrectas,numPreguntas:numPreguntas});
            imgSource = 'https://static.vecteezy.com/system/resources/previews/010/142/101/original/check-mark-icon-sign-symbol-design-free-png.png';
            evaluacion = handlerInput.t('EVALUADO_CORR');
            color = 'green';
        }
        else{
            speechText = handlerInput.t('RESPUESTA_INC',{cantCorrectas:cantCorrectas,numPreguntas:numPreguntas});
            evaluacion = handlerInput.t('EVALUADO_INC');
            imgSource = 'https://www.pngmart.com/files/17/Wrong-Sign-PNG-File.png';
            color = 'red';
        }
        datasource['respuestaDataSource']['title'] = handlerInput.t('TITULO');
        datasource['respuestaDataSource']['puntuacion'] = handlerInput.t('PUNTUACION', {cantCorrectas:cantCorrectas,numPreguntas:numPreguntas});
        datasource['respuestaDataSource']['evaluado'] = evaluacion;
        datasource['respuestaDataSource']['imagenSource'] = imgSource;
        datasource['respuestaDataSource']['color'] = color;
    
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_RESPUESTAS,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
}

const IniciarCuestionarioIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'IniciarCuestionarioIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        let speechText = handlerInput.t('PEDIR_NOMBRE');
        let documento = DOCUMENT_COMP;
        datasource['complementosDataSource']['primaryText'] = handlerInput.t('PEDIR_NOMBRE');
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['colorPrimary'] = 'blue';
        datasource['complementosDataSource']['colorSecondary'] = 'blue';
        datasource['complementosDataSource']['imagenSource'] = 'https://static.vecteezy.com/system/resources/previews/020/251/446/non_2x/confused-man-wondering-looking-for-problem-solution-pensive-young-guy-frustrated-with-trouble-thinking-and-brainstorming-illustration-free-vector.jpg';
        
        
        if(intent.confirmationStatus !== 'CONFIRMED') {
            
            datasource['complementosDataSource']['primaryText'] = handlerInput.t('CANCEL_MSG');
            datasource['complementosDataSource']['secondaryText'] = ' ';
            datasource['complementosDataSource']['colorPrimary'] = 'blue';
            datasource['complementosDataSource']['colorSecondary'] = 'blue';
            datasource['complementosDataSource']['imagenSource'] = 'https://cdn.pixabay.com/photo/2015/10/30/10/46/stop-1013732_640.jpg';
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(DOCUMENT_COMP,datasource);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            
            return handlerInput.responseBuilder
                .speak(handlerInput.t('CANCEL_MSG'))
                .reprompt(handlerInput.t('HELP_MSG'))
                .getResponse();
        }
        
        if(nombreIngresado){
            speechText = handlerInput.t('QUESTION_' + numPreguntas) + handlerInput.t('ANSWER_' + numPreguntas);
            datasource['cuestionarioDataSource']['title'] = handlerInput.t('TITULO');
            datasource['cuestionarioDataSource']['numPregunt'] = handlerInput.t('NUM_PRE', {numPregunta: numPreguntas+1});
            datasource['cuestionarioDataSource']['respuestas'] = handlerInput.t('ANSWER_' + numPreguntas);
            datasource['cuestionarioDataSource']['pregunta'] = handlerInput.t('QUESTION_' + numPreguntas);
            datasource['cuestionarioDataSource']['pie'] = handlerInput.t('PIE_CUESTIONARIO');
            documento = DOCUMENT_PREGUNTAS;
        }

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(documento,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const RegisterNameIntentHandler={
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RegisterNameIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const name = intent.slots.nombre.value;
        
        sessionAttributes['nombre'] = name;
        nombreIngresado = true;
        
        datasource['complementosDataSource']['primaryText'] = handlerInput.t('REGISTER_NAME', {name : name});
        datasource['complementosDataSource']['secondaryText'] = ' ';
        datasource['complementosDataSource']['colorPrimary'] = 'blue';
        datasource['complementosDataSource']['colorSecondary'] = 'blue';
        datasource['complementosDataSource']['imagenSource'] = 'https://www.playgreens.com/wp-content/uploads/2017/07/ok.png';
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_COMP,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REGISTER_NAME', {name : name}))
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
}



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');
        datasource['plantillaDataSource']['primaryText'] = handlerInput.t('HELP_MSG');
        datasource['plantillaDataSource']['imagenSource'] = "https://assets.bitdegree.org/online-learning-platforms/storage/media/2018/08/learn-coding.jpg";
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
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
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

        datasource['plantillaDataSource']['primaryText'] = handlerInput.t('GOODBYE_MSG', {name: name});
        datasource['plantillaDataSource']['imagenSource'] = "https://media1.giphy.com/media/Bht33KS4YXaHS5ABOP/giphy.gif?cid=ecf05e47a5zv0fjtpii7xev456yohtsom791363kjpze3ubx&ep=v1_gifs_search&rid=giphy.gif&ct=g";
        
        nombreIngresado = false;
        numPreguntas = 0;
        cantCorrectas = 0;
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID,datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
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
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
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
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
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
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterNameIntentHandler,
        IniciarCuestionarioIntentHandler,
        RegisterAnswerIntentHandler,
        ContinarCuestionarioIntentHandler,
        TerminarCuestionarioIntentHandler,
        IniciarCursoIntentHandler,
        SiguienteDiapositivaIntentHandler,
        AnteriorDiapositivaIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistence.getPersistenceAdapter())
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();