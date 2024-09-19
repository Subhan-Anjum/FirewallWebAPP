const {connection}=require('../../utils/database');
const logs=require('./backendLogs');

async function getOrders(req,response){
    const userId = req.query.id;
    connection.query(`SELECT * from orders JOIN users on users.Id=orders.userId JOIN inventory on inventory.Id=orders.productId JOIN brands on brands.Id=inventory.brandId WHERE userId=${userId}`,(err,res)=>{
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
