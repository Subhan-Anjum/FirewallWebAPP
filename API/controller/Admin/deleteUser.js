const {connection}=require('../../utils/database');
const strftime = require('strftime');
const logs=require('../Users/backendLogs');

async function DeleteUser(req,response){
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);
    connection.query(`SELECT * from users WHERE Id=${req.query.id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/deleteUser');
            return;
        }
        else{
            connection.query('INSERT INTO user_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [1, 'DELETE', JSON.stringify({ user: res[0]}),'N/A',dateCreated], (err, auditResult) => {
                if(err) {
                    logs.saveLogs(err.message,'/deleteUser');
                    return;
                }
                else{
                    connection.query(`DELETE FROM users WHERE Id=${req.query.id}`,(err,res)=>{
                        if(err) {
                            logs.saveLogs(err.message,'/deleteUser');
                            return;
                        }
                        else{
                            return response.status(200).json({message:"deleted"});
                        }
                    })
                }   
            });
        }
    })
}

module.exports={
    DeleteUser,
}
