const {connection}=require('../../utils/database');
const logs=require('./backendLogs');

async function deleteCart(req,response){
    const id = req.query.id;
    connection.query(`DELETE FROM cart WHERE cartId=${id}`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/deleteCart');
            return;
        }
        else{
            return response.status(200).json({message:"deleted"});
        }
    })    
}

module.exports={
    deleteCart,
}
