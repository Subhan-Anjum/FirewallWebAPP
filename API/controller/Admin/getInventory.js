const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function GetInventory(req,response){
    connection.query('SELECT inventory.Id, inventory.name,inventory.image, inventory.price,inventory.stock,inventory.stock,inventory.description,brands.brandName,inventory.createdAt,inventory.updatedAt,inventory.Active from inventory JOIN brands on brands.Id=inventory.brandId',(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getInventory');
            return;
        }
        else{
            return response.status(200).json({data:res});
        }
    })
}

module.exports={
    GetInventory,
}
