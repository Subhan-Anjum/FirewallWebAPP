const strftime = require('strftime');
const crypto = require('crypto');
const {connection}=require('../../utils/database');
const emailer=require('./sendEmail');
const logs=require('./backendLogs');

async function Register(req,response){
    const username=req.body.username;
    const email=req.body.email;
    const password=crypto.createHash('sha256').update(req.body.password).digest('hex');
    const role="User";
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    const data={
        username:username,
        email:email,
        password:password,
        role:role,
        createdAt:dateCreated,
        updatedAt:dateCreated,
        Active:false,
    }
    
    connection.query(`SELECT * FROM users WHERE email='${email}'`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/register');
            return;
        }
        else{
            if(res.length==0){
                connection.query('INSERT INTO users SET ?',data,(err,res)=>{
                    if(err) {
                        logs.saveLogs(err.message,'/register');
                        return;
                    }
                    else{
                        const code=emailer.generateRandomNumber();
                        const subject='Verify Your Account';
                        const body=`<p>Dear User!<p><p> Thanks for you interest in ESSENCE OUTFITTERS. 
                        To Create Your Account verify you email. You Verification Code is <br/> <center><h1>${code}</h1></center>`;
                        async function send(){
                            const responseData = await emailer.sendEmail(email, subject, body);
                            const hashed=crypto.createHash('sha256').update(code.toString()).digest('hex');
                            response.status(200).json({message:"sent",email:email,code:hashed}); 
                        }
                        send();
                    }
                })
            }
            else{
                response.status(200).json({message:"already"}); 
            }
        }
    })
}

module.exports={
    Register,
}
