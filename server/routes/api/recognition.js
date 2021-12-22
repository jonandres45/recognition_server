const express = require('express');
const router = express.Router();
const RecognitionController = require('../../controller/recognition.controller');
const upload = require('../../lib/storage');

router
    .post('/description', upload.single('img'), RecognitionController.sendAndGetDescription)
    .get('/labels', RecognitionController.sendAndGetLabels)
    .get('/get-image/:nombre', (req, res)=>{
        let nom = req.params.nombre;
        res.sendFile(  `${nom}.jpg`, {root: 'storage/'});
    })

module.exports = router;