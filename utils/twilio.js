const config = require('../configs/config/config')
const client = require('twilio')(config.ACCOUNT_SID, config.ACCOUNT_AUTH_TOKEN);

module.exports.sendSms = function (mobile, message){
    console.log('SMS')
    client.messages
    .create({
       body: message,
       from: '+18337630004',
       to: mobile
     })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err))

}

module.exports.sendVoiceSms = function (mobile, otp){
  console.log('VOICE')
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const response = new VoiceResponse();
  otp = otp.toString();
  response.say({
    voice: 'alice',
    loop: 2
  }, 'Your OTP for EKTA is '+otp);
  client.calls
  .create({
    twiml: response.toString(),
     from: '+18337630004',
     to: mobile
   })
  .then(message => console.log(message.sid))
  .catch(err => console.log(err))

}
