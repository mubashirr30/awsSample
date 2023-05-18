const express = require("express");
const route = express.Router();
const text_to_speech = require("../controller/text-speech_controller");
const multer = require('multer');
const { speech_to_text, getText } = require("../controller/speech-text_controller");
const upload = multer();

route.post('/text-speech',text_to_speech);
route.post('/speech-text',upload.single('file'), speech_to_text);
route.get('/get-speech::jobname',getText)

module.exports = route;