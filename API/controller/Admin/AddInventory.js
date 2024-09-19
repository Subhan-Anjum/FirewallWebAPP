const jwt = require('jsonwebtoken');
const strftime = require('strftime');
const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function AddInventory(req,response){
    const name=req.body.name;
    const image=req.file.filename;
    const price=req.body.price;
    const stock=req.body.stock;
    const description=req.body.description;
    const brand=req.body.brand;
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    connection.query(`SELECT * FROM brands WHERE brandName='${brand}'`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/addInventory');
            return;
        }
        else{
            const data={
                name:name,
                price:price,
                stock:stock,
                description:description,
                image:image,
                brandId:res[0].Id,
                createdAt:dateCreated,
                updatedAt:dateCreated,
                Active:true,
            }
         
            connection.query('INSERT INTO inventory SET ?',data,(err,res)=>{
                if(err) {
                    logs.saveLogs(err.message,'/addInventory');
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
                    connection.query('INSERT INTO inventory_audit SET ?',audit,(err,res)=>{
                        if(err) {
                            logs.saveLogs(err.message,'/addInventory');
                        }
                        else{
                            return response.status(200).json({ message: "added" });
                        }
                    })
                }
            })
        }
    })
}

module.exports={
    AddInventory,
}
