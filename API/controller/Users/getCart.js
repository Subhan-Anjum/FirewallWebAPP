const {connection}=require('../../utils/database');
const logs=require('./backendLogs');

async function getCart(req,response){
    const userId = req.query.id;

    connection.query(`SELECT * from cart JOIN users on users.Id=cart.userId JOIN inventory on inventory.Id=cart.productId JOIN brands on brands.Id=inventory.brandId WHERE userId=${userId}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getCart');
            return;
        }
        else{
            return response.status(200).json({data: res});
        }
    })    
}

module.exports={
    getCart,
}
