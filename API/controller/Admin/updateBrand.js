const strftime = require('strftime');
const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function updateBrand(req,response){
    const name=req.body.name;
    const id=req.body.id;
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);
    let oldValue={};

    connection.query(`SELECT * FROM brands WHERE Id=${id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/updateBrand');
            return;
        }
        else{
            oldValue=res[0];
            connection.query('INSERT INTO brand_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)', [1, 'UPDATE', JSON.stringify(oldValue), JSON.stringify({ brandName:name }),dateCreated], (err, auditResult) => {
                if(err) {
                    logs.saveLogs(err.message,'/updateBrand');
                    return;
                }
                else{
                    connection.query(`UPDATE brands SET brandName='${name}',updateAt='${dateCreated}' WHERE Id=${id}`,(err,res)=>{
                        if(err) {
                            logs.saveLogs(err.message,'/updateBrand');
                            return;
                        }
                        else{
                            return response.status(200).json({ message: "updated" });
                        }
                    })
                }   
            });
        }
    })
}

module.exports={
    updateBrand,
}
