require("dotenv").config();
const express = require('express')
const app = express();
const port = process.env.PORT
const cors = require('cors');
var fileUpload = require('express-fileupload');

app.use(express.json());
app.use(fileUpload());
app.use(cors());
// const AWS = require('./src/config/aws_config');
const appRoute = require('./src/route/text-speech_speech-text_route')
app.use('/aws',appRoute); 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})