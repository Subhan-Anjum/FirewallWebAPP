const {connection}=require('../../utils/database');
const strftime = require('strftime');
const logs=require('../Users/backendLogs');

async function deleteInventory(req,response){
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    connection.query(`SELECT * FROM inventory WHERE Id=${req.query.id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/deleteInventory');
            return;
        }
        else{
            connection.query('INSERT INTO inventory_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [1, 'DELETE', JSON.stringify({ product: res[0]}),'N/A',dateCreated], (err, auditResult) => {
                if(err) {
                    logs.saveLogs(err.message,'/deleteInventory');
                    return;
                }
                else{
                    connection.query(`DELETE from inventory where Id=${req.query.id}`,(err,res)=>{
                        if(err) {
                            logs.saveLogs(err.message,'/deleteInventory');
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
    deleteInventory,
}
