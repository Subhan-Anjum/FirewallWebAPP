const jwt = require('jsonwebtoken');
const strftime = require('strftime');
const crypto = require('crypto');
const {connection}=require('../../utils/database');
const emailer=require('../Users/sendEmail');
const logs=require('../Users/backendLogs');

async function AddUser(req,response){
    const username=req.body.username;
    const email=req.body.email;
    const role="User";
    const code=emailer.generateRandomNumber();
    const password=crypto.createHash('sha256').update(code.toString()).digest('hex');
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    connection.query(`SELECT * FROM users WHERE email='${email}'`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/addusers');
            return;
        }
        else{
            if(res.length==0){
                const data={
                    username:username,
                    email:email,
                    password:password,
                    role:role,
                    createdAt:dateCreated,
                    updatedAt:dateCreated,
                    Active:true,
                }
                
                connection.query('INSERT INTO users SET ?',data,(err,res)=>{
                    if(err) {
                        logs.saveLogs(err.message,'/addUsers');
                        return;
                    }
                    else{
                        const audit={
                            userId:1,
                            action:"INSERT",
                            oldValue:"N/A",
                            newValue:`User Added: ${email}`,
                            dated:dateCreated,
                        }
                        connection.query('INSERT INTO user_audit SET ?',audit,(err,res)=>{
                            if(err) {
                                logs.saveLogs(err.message,'/addUsers');
                                return;
                            }
                            else{
                                const subject='You have been added to ESSENCE OUTFITTERS';
                                const body=`<p>Dear User!<p><p> you have been added to ESSENCE OUTFITTERS as a user. For login to your account here are your login details. <br/> <b>Email: </b>${email} <br/> <b>Password: </b>${code}</p>`;
                                async function send(){
                                    const responseData = await emailer.sendEmail(email, subject, body);
                                    const hashed=crypto.createHash('sha256').update(code.toString()).digest('hex');
                                    response.status(200).json({message:"added"}); 
                                }
                                send();
                            }
                        })
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
    AddUser,
}
