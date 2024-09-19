const strftime = require('strftime');
const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function AddBrand(req,response){
    const name=req.body.name;
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    const data={
        brandName:name,
        createdAt:dateCreated,
        updateAt:dateCreated,
        Active:true,
    }
 
    connection.query('INSERT INTO brands SET ?',data,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/addBrand');
            return;
        }
        else{
            const audit={
                userId:1,
                action:"INSERT",
                oldValue:"N/A",
                newValue: JSON.stringify(data),
                dated:dateCreated,
            }
            connection.query('INSERT INTO brand_audit SET ?',audit,(err,res)=>{
                if(err) {
                    logs.saveLogs(err.message,'/addBrand');
                    return;
                }
                else{
                    return response.status(200).json({ message: "added" });
                }
            })
        }
    })
}

module.exports={
    AddBrand,
}
