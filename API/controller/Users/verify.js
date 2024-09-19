const crypto = require('crypto');
const {connection}=require('../../utils/database');
const strftime = require('strftime');
const emailer=require('./sendEmail');
const logs=require('./backendLogs');

async function Verify(req,response){
    const email=req.query.email;
    const code=req.query.auth;
    const hash=crypto.createHash('sha256').update(req.body.code).digest('hex');
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    if(code!=hash){
        response.status(200).json({message:"invalid"}); 
    }
    else{
        connection.query(`UPDATE users SET Active=true WHERE email='${email}'`,(err,res)=>{
            if(err) {
                logs.saveLogs(err.message,'/verify');
                return;
            }
            else{
                connection.query(`SELECT * FROM users WHERE email='${email}'`,(err,res)=>{
                    if(err) {
                        logs.saveLogs(err.message,'/verify');
                    }
                    else{
                        const audit={
                            userId: res[0].Id,
                            action:"INSERT",
                            oldValue:"N/A",
                            newValue:JSON.stringify(res[0]),
                            dated:dateCreated,
                        }
                        connection.query('INSERT INTO user_audit SET ?',audit,(err,res)=>{
                            if(err) {
                                logs.saveLogs(err.message,'/verify');
                                return;
                            }
                            else{
                                async function send(){
                                    const subject='Your Account has been verified';
                                    const body='Thanks for registering on ESSENCE OUTFITTERS. Your email has been verified';
                                    const responseData = await emailer.sendEmail(email, subject, body);
                                    response.status(200).json({message:"verified"}); 
                                }
                                send();
                            }
                        });
                    }
                })
            }
        })
    }
}

module.exports={
    Verify,
}
