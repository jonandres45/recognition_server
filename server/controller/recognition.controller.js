//const path = require("path");
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

exports.sendImage = async (req, res) =>{
    const comp = await computerVision({nombre: "perro"});
    console.log(comp);
    res.send(comp);
}

async function computerVision (ejemplo){
    /**
     * AUTHENTICATE
     * This single client is used for all examples.
     */
    const key = process.env.KEY_azure;
    const endpoint = 'https://jonandres-innovaccion1.cognitiveservices.azure.com/';

    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

    console.log('-------------------------------------------------');
    console.log('DESCRIBE IMAGE');
    const describeURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';
//            const describeImagePath = __dirname + '\\pictures\\kesi.jpg';

    /*console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
    const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);*/

    const tagsURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';

    console.log('Analyzing tags in image...', tagsURL.split('/').pop());
    const tags = (await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] })).tags;
    console.log(`Tags: ${formatTags(tags)}`);
    return tags;
}

function formatTags(tags) {
    return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
}