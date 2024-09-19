const {connection}=require('../../utils/database');
const strftime = require('strftime');

async function frontEndLogs(request,response){
    const now = new Date();
    const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

    const log={
        ErrorMsg:request.body.msg,
        currentUrl:request.body.url,
        portal:request.body.portal,
        dated:dateCreated,
    }

    connection.query(`INSERT into frontend_logs SET ? `,log,(err,res)=>{
        if(err) throw err;
        else{
            return response.status(200).json({message:"added"});
        }
    })  
}

module.exports={
    frontEndLogs,
}
