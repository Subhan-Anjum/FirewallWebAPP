const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function updateInventoryStatus(req,response){
    const status=req.body.status;
    const id=req.body.id;
    connection.query(`UPDATE inventory SET Active=${status} WHERE Id=${id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/changeStatusInventory');
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
    updateInventoryStatus,
}
