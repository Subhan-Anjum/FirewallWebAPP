const {connection}=require('../../utils/database');
const logs=require('./backendLogs');

async function support(req,response){
    connection.query(`SELECT * FROM support`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/support');
            return;
        }
        else{
            return response.status(200).json({data: res});
        }
    })    
}

module.exports={
    support,
}
