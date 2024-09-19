const {connection}=require('../../utils/database');
const logs=require('../Users/backendLogs');

async function updateAdmin(req,response){
    console.log(req.body);
    const name=req.body.username;
    const email=req.body.email;
 
    connection.query(`UPDATE users SET username='${name}',email='${email}' WHERE Id=1`,(err,res)=>{
        if(err) {
            logs.saveLogs(err.message,'/updateAdmin');
            return;
        }
        else{
            return response.status(200).json({ message: "updated" });
        }
    })
}

module.exports={
    updateAdmin,
}
