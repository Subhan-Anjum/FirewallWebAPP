const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function GetUsers(req,response){
    connection.query('SELECT  * from users',(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getUsers');
            return;
        }
        else{
            return response.status(200).json({data:res});
        }
    })
}

module.exports={
    GetUsers,
}
