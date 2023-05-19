const AWS = require('../config/aws_config');
AWS.config.update({
  accessKeyId: process.env.PUBLIC_KEY,
  secretAccessKey: process.env.PRIVATE_KEY,
  region:process.env.REGION,
});

const transcribeService = new AWS.TranscribeService();
const axios = require('axios');
const { uploadFile } = require('../utils/bucketFileUpload');

const speech_to_text = async(req,res,next) =>{
  
  const audioData = req.files.audio;
  let filename =req.body.jobname;
  const bucketparams = {
    Bucket: process.env.BUCKET,
    Key: filename,
    Body: audioData.data,
    ContentType: audioData.mimetype,
    ACL: 'public-read'
    };
console.log(bucketparams,'28',);
    uploadFile(bucketparams).then((result) => {
      console.log(result);
      const params = {
        TranscriptionJobName: req.body.jobname, // Specify a name for the transcription job
        LanguageCode: 'en-US', // Specify the language code for the audio
        Media: {
          MediaFileUri: result.url
        },
        OutputBucketName: process.env.BUCKET // Specify the S3 bucket name to store the transcription output
      };


transcribeService.startTranscriptionJob(params, (err, data) => {
    if (err) {
      console.log("error occured: " + err?.message);
      res.status(500).json({ error: err?.message,success:false,status:"Failed"});
    } else {

      res.json({ jobId: data.TranscriptionJob.TranscriptionJobName,text:data });
    }
  });
      
    })
    .catch((err) => {
      res.status(400).send({ message:"Failed to upload Audio file to cloud",success:false,status:"Failed"});
    });

   
}

const getText = async(req,res,next) =>{
  console.log('35 get hit');
    let jobname = req.params.name;
  console.log(jobname);
    const checkStatusParams = {
        TranscriptionJobName: jobname
      };
      transcribeService.getTranscriptionJob(checkStatusParams,async (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'An error occurred' });
        } else {
          console.log(data,'46');
          const jobStatus = data.TranscriptionJob.TranscriptionJobStatus;
          if (jobStatus === 'COMPLETED') {
            // Retrieve the transcript
            const transcriptUri = data.TranscriptionJob.Transcript.TranscriptFileUri;
            const transcriptFile = await axios.get(transcriptUri);
            console.log(transcriptFile.data);
            // const transcriptJson = await transcriptFile.json();
            // const transcribedText = transcriptJson.results.transcripts.map(transcript => transcript.transcript).join('\n');
            res.status(200).send({message:'Succesfull get text',data:transcriptFile.data,success:true,error:'',status:"Success"})
          } else if (jobStatus === 'FAILED') { 
            console.log('Transcription job failed.');
            res.status(500).json({ error: 'Transcription job failed',message:"Can't get text",error:true,status:"Failed" });
          }
          else{
            res.status(200).json({ error: 'Working on transcription',message:"Please wait for a while",error:true,status:"Wait" });
          }
        }
      });
}
module.exports = {speech_to_text,getText};