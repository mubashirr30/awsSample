const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.PUBLIC_KEY,
    secretAccessKey: process.env.PRIVATE_KEY,
    region:process.env.REGION,
  });
  
  module.exports = AWS;