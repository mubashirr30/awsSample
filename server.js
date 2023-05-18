require("dotenv").config();
const express = require('express')
const app = express();
const port = process.env.PORT
const cors = require('cors');



app.use(express.json());
app.use(cors());
// const AWS = require('./src/config/aws_config');
const appRoute = require('./src/route/text-speech_speech-text_route')
app.use('/aws',appRoute); 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {

  // axios.get(jwksUrl)
  // .then((response) => {
  //   const jwks = response.data;
  //   const publicKey = jwks.keys[0].n + jwks.keys[0].e;
  //   console.log("keys",publicKey)
  //   jwt.verify(idToken, publicKey, { algorithms: ['RS256'] }, (error, decoded) => {
  //     if (error) {
  //       console.error('Verification error:', error);
  //       return;
  //     }
  //     // Extract the email address from the ID token payload
  //     const email = decoded.email;
  //     // Use the email address as needed
  //     console.log('Email:', email);
  //   });
  // })
  // .catch((error) => {
  //   console.error('Failed to fetch Apple public key:', error);
  // });
  console.log(`Example app listening on port ${port}`)
})