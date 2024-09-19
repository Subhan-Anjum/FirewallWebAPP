import axios from 'axios';

export async function saveLogs(msg, url,portal) {
    const log={
        msg:msg,
        url:url,
        portal:portal,
      }

      try {
          const response = await axios.post('http://localhost:4000/frontendLogs', log, {
              headers: {
                  "Content-Type": "application/json", 
                  "api-key": process.env.REACT_APP_API_KEY,
              },
          });

          const responseData = response.data;
          if(responseData.message==="added"){
            console.log("Log saved");
          }
      } catch (error) {
          console.error('Error:', error.message);
      }
}