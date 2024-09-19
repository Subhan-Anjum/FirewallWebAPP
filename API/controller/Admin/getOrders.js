const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function getOrders(req,response){
    connection.query(`SELECT * from orders JOIN users on users.Id=orders.userId JOIN inventory on inventory.Id=orders.productId JOIN brands on brands.Id=inventory.brandId`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getOrders');
            return;
        }
        else{
            return response.status(200).json({data: res});
        }
    })    
}

module.exports={
    getOrders,
}
