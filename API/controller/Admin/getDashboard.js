const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function GetDashboard(req,response){
    let brands=0;
    let users=0;
    let products=0;
    let orders=0;
    let revenue=0;

    connection.query('SELECT * FROM brands',(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/getDashboard');
            return;
        }
        else{
            brands=res.length;
            connection.query('SELECT * FROM users',(err,res)=>{
                if(err) {
                    logs.saveLogs(err.message,'/getDashboard');
                    return;
                }
                else{
                    users=res.length-1;
                    connection.query('SELECT * FROM orders',(err,res)=>{
                        if(err) {
                            logs.saveLogs(err.message,'/getDashboard');
                            return;
                        }
                        else{
                            orders=res.length;
                            connection.query('SELECT * FROM inventory',(err,res)=>{
                                if(err) {
                                    logs.saveLogs(err.message,'/getDashboard');
                                    return;
                                }
                                else{
                                    products=res.length;
                                    connection.query('SELECT SUM(total) as Total from orders',(err,res)=>{
                                        if(err) {
                                             logs.saveLogs(err.message,'/getDashboard');
                                             return;
                                        }
                                        else{
                                            revenue=res[0].Total;
                                            return response.status(200).json({brands:brands,users:users,products:products,orders:orders,revenue:revenue});
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports={
    GetDashboard,
}
