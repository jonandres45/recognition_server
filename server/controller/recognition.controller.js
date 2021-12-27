//const path = require("path");
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

exports.uploadImage = (req, res) =>{
    res.status(200).send({correct: true});
}

exports.sendAndGetDescription = async (req, res) =>{
    const comp = await getDescription();
    res.status(200).send(comp);
}

exports.sendAndGetLabels = async (req, res) =>{
    const comp = await getLabels();
    res.status(200).send(comp);
}

exports.sendAndGetFaces = async (req, res) =>{
    const comp = await getFaces();
    res.status(200).send(comp);
}

exports.sendAndGetObjects = async (req, res)=>{
    const comp = await getObjects();
    res.status(200).send(comp);
}

exports.sendAndGetCelebrities = async (req, res)=>{
    const comp = await getCelebrities();
    res.status(200).send(comp);
}

async function getDescription (){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
    console.log('Analyzing URL image to describe...');
    const img = 'https://recognition-jonandres.herokuapp.com/api/recognition/get-image/imagen';
    const caption = (await computerVisionClient.describeImage(img)).captions[0];
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
    return caption;
}

async function getLabels(){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
    const img = 'https://recognition-jonandres.herokuapp.com/api/recognition/get-image/imagen';
    console.log('Analyzing tags in image...');
    const tags = (await computerVisionClient.analyzeImage(img, { visualFeatures: ['Tags'] })).tags;
    console.log(`Tags: ${formatTags(tags)}`);
    return tags;
}

async function getFaces(){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
    const facesImageURL = 'https://recognition-jonandres.herokuapp.com/api/recognition/get-image/imagen';
    console.log('Analyzing faces in image...');
    // Get the visual feature for 'Faces' only.
    const faces = (await computerVisionClient.analyzeImage(facesImageURL, { visualFeatures: ['Faces'] })).faces;
    if (faces.length) {
        console.log(`${faces.length} face${faces.length === 1 ? '' : 's'} found:`);
        for (const face of faces) {
            console.log(`    Gender: ${face.gender}`.padEnd(20)
                + ` Age: ${face.age}`.padEnd(10) + `at ${formatRectFaces(face.faceRectangle)}`);
        }
    } else { console.log('No faces found.'); }

    return faces;
}

async function getObjects(){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
    const objectURL = 'https://recognition-jonandres.herokuapp.com/api/recognition/get-image/imagen';
    // Analyze a URL image
    console.log('Analyzing objects in image...');
    const objects = (await computerVisionClient.analyzeImage(objectURL, { visualFeatures: ['Objects'] })).objects;
    console.log();
    // Print objects bounding box and confidence
    if (objects.length) {
        console.log(`${objects.length} object${objects.length === 1 ? '' : 's'} found:`);
        for (const obj of objects) { console.log(`    ${obj.object} (${obj.confidence.toFixed(2)}) at ${formatRectObjects(obj.rectangle)}`); }
    } else { console.log('No objects found.'); }

    return objects;
}

/**
 * DETECT DOMAIN-SPECIFIC CONTENT
 * Detects landmarks or celebrities.
 */
async function getCelebrities(){
    //AUTHENTICATE
    const computerVisionClient = authenticate();
    const domainURLImage = 'https://recognition-jonandres.herokuapp.com/api/recognition/get-image/imagen';
    // Analyze URL image
    console.log('Analyzing image for landmarks...', domainURLImage.split('/').pop());
    const domain = (await computerVisionClient.analyzeImageByDomain('landmarks', domainURLImage)).result.landmarks;

    // Prints domain-specific, recognized objects
    if (domain.length) {
        console.log(`${domain.length} ${domain.length === 1 ? 'landmark' : 'landmarks'} found:`);
        for (const obj of domain) {
            console.log(`    ${obj.name}`.padEnd(20) + `(${obj.confidence.toFixed(2)} confidence)`.padEnd(20) + `${formatRectDomain(obj.faceRectangle)}`);
        }
    } else {
        console.log('No landmarks found.');
    }

    return domain;

}

function formatTags(tags) {
    return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
}

// Formats the bounding box
function formatRectFaces(rect) {
    return `top=${rect.top}`.padEnd(10) + `left=${rect.left}`.padEnd(10) + `bottom=${rect.top + rect.height}`.padEnd(12)
        + `right=${rect.left + rect.width}`.padEnd(10) + `(${rect.width}x${rect.height})`;
}

// Formats the bounding box
function formatRectObjects(rect) {
    return `top=${rect.y}`.padEnd(10) + `left=${rect.x}`.padEnd(10) + `bottom=${rect.y + rect.h}`.padEnd(12)
        + `right=${rect.x + rect.w}`.padEnd(10) + `(${rect.w}x${rect.h})`;
}

// Formats bounding box
function formatRectDomain(rect) {
    if (!rect) return '';
    return `top=${rect.top}`.padEnd(10) + `left=${rect.left}`.padEnd(10) + `bottom=${rect.top + rect.height}`.padEnd(12) +
        `right=${rect.left + rect.width}`.padEnd(10) + `(${rect.width}x${rect.height})`;
}

function authenticate(){
    const key = process.env.KEY_azure;
    const endpoint = 'https://jonandres-innovaccion1.cognitiveservices.azure.com/';

    return new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
}