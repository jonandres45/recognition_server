//const path = require("path");
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

exports.sendAndGetDescription = async (req, res) =>{
    const comp = await getDescription({nombre: "perro"});
    console.log(comp);
    res.status(200).send(comp);
}
exports.sendAndGetLabels = async (req, res) =>{
    const comp = await getLabels({nombre: "perro"});
    console.log(comp);
    res.status(200).send(comp);
}

async function getDescription (image){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
//    console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
    const caption = (await computerVisionClient.describeImage(image)).captions[0];
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
    return caption;
}

async function getLabels(image){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
//    console.log('Analyzing tags in image...', image.split('/').pop());
    const tags = (await computerVisionClient.analyzeImage(image, { visualFeatures: ['Tags'] })).tags;
    console.log(`Tags: ${formatTags(tags)}`);
    return tags;
}

function formatTags(tags) {
    return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
}

function authenticate(){
    const key = process.env.KEY_azure;
    const endpoint = 'https://jonandres-innovaccion1.cognitiveservices.azure.com/';

    return new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
}