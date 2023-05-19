const express = require("express");
const route = express.Router();
const text_to_speech = require("../controller/text-speech_controller");

const { speech_to_text, getText } = require("../controller/speech-text_controller");


route.post('/text-speech',text_to_speech);
route.post('/speech-text', speech_to_text);
route.get('/get-speech::name',getText)

module.exports = route;