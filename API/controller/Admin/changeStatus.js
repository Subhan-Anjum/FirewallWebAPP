const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function UpdateStatus(req,response){
    const status=req.body.status;
    console.log(status);
    const id=req.body.id;
    connection.query(`UPDATE brands SET Active=${status} WHERE Id=${id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/changeStatus');
            return;
        }
        else{
                return response.status(200).json({
                    message: 'updated'
                });
            }
    })
}

module.exports={
    UpdateStatus,
}
