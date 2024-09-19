const {connection}=require('../../utils/database');
const strftime = require('strftime');

async function saveLogs(msg,url){
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    const log={
        ErrorMsg:msg,
        currentUrl:url,
        dated:dateCreated,
    }

    connection.query(`INSERT into backend_logs SET ? `,log,(err,res)=>{
        if(err) throw err;
        else{
            console.log("Log saved");
        }
    })  
}

module.exports={
    saveLogs,
}
