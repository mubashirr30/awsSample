const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.PUBLIC_KEY,
    secretAccessKey: process.env.PRIVATE_KEY,
    region:process.env.REGION,
  });
  // console.log( process.env.PUBLIC_KEY,process.env.PRIVATE_KEY,process.env.REGION,'8');
  module.exports = AWS;