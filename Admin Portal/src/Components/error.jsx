import React ,{useEffect,useState} from 'react';
import Cookies from "js-cookie";

export default function Error() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
        if (Cookies.get("mode") == "light") {
            document.body.className = "light-mode";
        } else {
            document.body.className = "dark-mode";
        }
    }); 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1 style={{fontSize:"70px"}}>404</h1>
        <p>Page Not Found or You don't have access</p>
    </div>
  )
}
