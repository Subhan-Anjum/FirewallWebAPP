const {connection}=require('../../utils/database');
const logs=require('./backendLogs');

async function getProfile(req,response){
    const id = req.query.id;
    connection.query(`SELECT * FROM users WHERE Id=${id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getProfile');
            return;
        }
        else{
            return response.status(200).json({data: res});
        }
    })    
}

module.exports={
    getProfile,
}
