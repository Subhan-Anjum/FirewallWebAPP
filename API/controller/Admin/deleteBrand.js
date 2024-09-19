const {connection}=require('../../utils/database');
const strftime = require('strftime');
const logs=require('../Users/backendLogs');

async function deleteBrands(req,response){
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);
    connection.query(`SELECT * FROM brands WHERE Id=${req.query.id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/deleteBrand');
            return;
        }
        else{ 
            connection.query('INSERT INTO brand_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [1, 'DELETE', JSON.stringify({ brand: res[0]}),'N/A',dateCreated], (err, auditResult) => {
                if(err) {
                    logs.saveLogs(err.message,'/deleteBrand');
                    return;
                }
                else{
                    connection.query(`DELETE FROM brands where Id=${req.query.id}`,(err,res)=>{
                        if(err) {
                            logs.saveLogs(err.message,'/deleteBrand');
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
    deleteBrands,
}
