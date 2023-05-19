const AWS = require('../config/aws_config');
const s3 = new AWS.S3();

const uploadFile = (params)=>{

      // let params =params
      console.log(params);
      return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: data.Key,
                url: data.Location,
              }); 
            }
          });
        });
  
  }

  module.exports = {
    uploadFile
  }