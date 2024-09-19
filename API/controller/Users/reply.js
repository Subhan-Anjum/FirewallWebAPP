const strftime = require('strftime');
const {connection}=require('../../utils/database');
const emailer=require('./sendEmail');
const logs=require('./backendLogs');

async function reply(req,response){
    const email=req.body.email;
    const subject=req.body.subject;
    const reply=req.body.reply;
    const id=req.body.id;

    connection.query(`UPDATE support SET replied=true WHERE Id=${id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/reply');
            return;
        }
        else{
            async function send(){
                const responseData = await emailer.sendEmail(email, subject, reply);
                response.status(200).json({message:"added"}); 
            }
            send();
        }
    })
}

module.exports={
    reply,
}
