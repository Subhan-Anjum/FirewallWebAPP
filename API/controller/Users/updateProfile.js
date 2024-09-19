const jwt = require('jsonwebtoken');
const strftime = require('strftime');
const crypto = require('crypto');
const {connection}=require('../../utils/database');
const logs=require('./backendLogs');

async function updateProfile(req,response){
    const username=req.body.username;
    const email=req.body.email;
    const id=req.body.id;
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);
    let user={};

    connection.query(`SELECT * FROM users WHERE email='${email}'`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/updateProfile');
            return;
        }
        else{
            user=res[0];
            if(req.body.password == ''){
                connection.query(`UPDATE users SET username='${username}',email='${email}',updatedAt='${dateCreated}' WHERE Id=${id}`,(err,res)=>{
                    if(err) {
                        logs.saveLogs(err.message,'/updateProfile');
                        return;
                    }
                    else{
                        connection.query('INSERT INTO user_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [user.Id, 'UPDATE', JSON.stringify(user), JSON.stringify({ username: username, email:email }),dateCreated], (err, auditResult) => {
                            if(err) {
                                logs.saveLogs(err.message,'/updateProfile');
                                return;
                            }
                            else{
                                response.status(200).json({message:"updated"});
                            }   
                        });
                    }
                })
            }
            else if(req.body.password!=''){
                const password=crypto.createHash('sha256').update(req.body.password).digest('hex');
                connection.query(`UPDATE users SET username='${username}',email='${email}',password='${password}',updatedAt='${dateCreated}' WHERE Id=${id}`,(err,res)=>{
                    if(err) {
                        logs.saveLogs(err.message,'/updateProfile');
                        return;
                    }
                    else{
                        connection.query('INSERT INTO user_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [user.Id, 'UPDATE', JSON.stringify(user), JSON.stringify({ username: username, email:email }),dateCreated], (err, auditResult) => {
                            if(err) {
                                logs.saveLogs(err.message,'/updateProfile');
                                return;
                            }
                            else{
                                response.status(200).json({message:"updated"});
                            }   
                        });
                    }
                })
            } 
        }
    })
}

module.exports={
    updateProfile,
}
