const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function GetBrands(req,response){
    connection.query('SELECT  * from brands',(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getBrands');
            return;
        }
        else{
            return response.status(200).json({data:res});
        }
    })
}

module.exports={
    GetBrands,
}
