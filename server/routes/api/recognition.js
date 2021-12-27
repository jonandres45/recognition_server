const express = require('express');
const router = express.Router();
const RecognitionController = require('../../controller/recognition.controller');
const upload = require('../../lib/storage');

router
    .post('/upload-image', upload.single('img'), RecognitionController.uploadImage)
    .get('/description', RecognitionController.sendAndGetDescription)
    .get('/labels', RecognitionController.sendAndGetLabels)
    .get('/faces', RecognitionController.sendAndGetFaces)
    .get('/objects', RecognitionController.sendAndGetObjects)
    .get('/landmark', RecognitionController.sendAndGetLandmark)
    .get('/content-adult', RecognitionController.sendAndGetContentAdult)
    .get('/get-image/:nombre', (req, res)=>{
        let nom = req.params.nombre;
        res.sendFile(  `${nom}.jpg`, {root: 'storage/'});
    })

module.exports = router;