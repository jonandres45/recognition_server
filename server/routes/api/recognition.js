const express = require('express');
const router = express.Router();
const RecognitionController = require('../../controller/recognition.controller');

router
    .post('/description', RecognitionController.sendAndGetDescription)
    .get('/labels', RecognitionController.sendAndGetLabels)

module.exports = router;