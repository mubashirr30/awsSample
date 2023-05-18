const AWS = require('../config/aws_config');
const transcribeService = new AWS.TranscribeService();
const https = require('https');


const speech_to_text = async(req,res,next) =>{
    const audioData = req.file.buffer;
    const params = {
        TranscriptionJobName: 'speech-to-text-1', // Specify a name for the transcription job
        LanguageCode: 'en-US', // Specify the language code for the audio
        Media: {
          MediaFileUri: 's3://hedged-prod-assets-01/speech_20230517101921967.mp3'
        },
        OutputBucketName: 'hedged-prod-assets-01' // Specify the S3 bucket name to store the transcription output
      };
console.log('speech_to_text called');

transcribeService.startTranscriptionJob(params, (err, data) => {
    if (err) {
      console.log("error occured: " + err?.message);
      res.status(500).json({ error: 'An error occurred' });
    } else {

      res.json({ jobId: data.TranscriptionJob.TranscriptionJobName,text:data });
    }
  });
}

const getText = async(req,res,next) =>{
    let jobname = req.params.jobname;
    const checkStatusParams = {
        TranscriptionJobName: jobname
      };
      transcribeService.getTranscriptionJob(checkStatusParams, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'An error occurred' });
        } else {
          const jobStatus = data.TranscriptionJob.TranscriptionJobStatus;
          if (jobStatus === 'COMPLETED') {
            // Retrieve the transcript
            const transcriptUri = data.TranscriptionJob.Transcript.TranscriptFileUri;

            // https.get(transcriptUri, (res) => {
            //   let body = '';
            //   res.on('data', (chunk) => {
            //     body += chunk;
            //   });
            //   res.on('end', () => {
            //     const transcript = JSON.parse(body).results.transcripts[0].transcript;
            //     console.log('Transcript:', transcript);

            //     // Save the transcript to a variable
            //     const response = { transcript: transcript };
            //     console.log(response,'55');
            //     // Send the transcript as a response
            //     // res.json(response);
            //   });
            // }).on('error', (e) => {
            //   console.log('Error occurred:', e);
            //   res.status(500).json({ error: 'An error occurred' });
            // });
          } else if (jobStatus === 'FAILED') {
            
            console.log('Transcription job failed.');
            res.status(500).json({ error: 'Transcription job failed' });
          }
        }
      });
}
module.exports = {speech_to_text,getText};