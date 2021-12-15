const express = require('express');
const router = express.Router();
const RecognitionController = require('../../controller/recognition.controller');

router.get('/', RecognitionController.sendImage);

module.exports = router;