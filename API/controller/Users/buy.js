const { connection } = require('../../utils/database');
const strftime = require('strftime');
const logs=require('./backendLogs');

async function buy(req, response) {
    const productId = req.query.productId;
    const userId = req.query.userId;
    const quantity = req.query.quantity;
    const price = req.query.price;
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    const data={
        productId:productId,
        userId:userId,
        quantity:quantity,
        total:price*quantity,
        dated:dateCreated,
    }
    
    connection.query('INSERT into orders SET ?',data,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/buy');
            return;
        }
        else{
            connection.query(`UPDATE inventory SET stock=stock-${quantity} WHERE Id=${productId}`,(err,res)=>{
                if(err) {
                    logs.saveLogs(err.message,'/buy');
                }
                else{
                    response.redirect('http://localhost:3000/success')
                }
            })
        }
    })
}

module.exports = {
    buy,
};
