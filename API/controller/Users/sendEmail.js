const {transporter}=require('../../utils/nodemailer');
const logs=require('./backendLogs');

function generateRandomNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendEmail(email,subject,body){
    const mailOptions = {
        from: `ESSENCE OUTFITTERS <shahbazrafique429@gmail.com>`,
        to: email,
        subject: subject,
        html: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(err) {
            logs.saveLogs(err.message,'/sendMail');
            return;
        }
         else {
            return true;
        }
      });
}

module.exports={
    sendEmail,
    generateRandomNumber,
}