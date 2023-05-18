const AWS = require('../config/aws_config');
const readFileStream = require('../utils/bucketFileRead');
const polly = new AWS.Polly();


const text_to_speech = async(req,res,next) =>{
// console.log('text-speech',req.body.text);
if(!req?.body?.type || !req.body.periodType){
    return res.status(500).send({message:'Please enter the data',code:400});
}
    const {type,periodType} = req.body;

    const filePath = `Data/FnO/${type}/OI_Outlook/${periodType}/OI_CurrentData_Description.csv`;

    let data = await readFileStream(filePath);
    data = data[data.length - 1];
    console.log(data);
    const outputString = data.Description.replace(/<[^>]+>/g, '');
    // res.json(outputString);
    // data=("")
    console.log(outputString);
const params = {
    OutputFormat: 'mp3',
    Text: outputString,
    VoiceId: 'Aditi',
  }
  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error synthesizing speech');
    }

    res.set('Content-Type', 'audio/mpeg');
    res.status(200).send(data.AudioStream);
  });
} 
module.exports = text_to_speech;
