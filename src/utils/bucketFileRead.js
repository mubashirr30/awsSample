const AWS = require("aws-sdk");
const csv = require("csv-parser");
// const { Readable } = require('stream');
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region:process.env.REGION,
  });
const s3Bucket = new AWS.S3();
const readFileStream =async (file) => {
    const params = {
      Bucket: process.env.GRAPH_BUCKET_NAME,
      Key: file,
    };
//   try {
//     const response = await s3Bucket.getObject(params).promise(); // await the promise
//     // console.log(response);
 
//     // const fileContent = response.Body.toString("utf-8");

//     return response;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
   

    return new Promise((resolve, reject) => {
      const results = [];
      s3Bucket
        .getObject(params)
        .createReadStream()
        .on("error", (error) => {
          reject(error);
        })
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            // const concatenatedData = results.join('');
            // console.log(concatenatedData);
          resolve(results);
        });
    });
  }

  module.exports = readFileStream; 