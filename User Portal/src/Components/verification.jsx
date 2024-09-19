import React,{useState,useEffect} from "react";
import Header from "./header";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import axios from 'axios';
import Footer from "./fotter";
import { saveLogs } from './logs';

export default function Verification() {
    const [submit,setSubmit]=useState(false);
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const email = urlParams.get('email');
    const code = urlParams.get('auth');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmit(true);

        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await axios.post(`http://localhost:4000/verify?email=${email}&auth=${code}`, formData, {
                headers: {
                    "Content-Type": "application/json", 
                    "api-key": process.env.REACT_APP_API_KEY,
                },
            });

            form.reset();
            const responseData = response.data;
            if(responseData.message=="invalid"){
                setSubmit(false);
                document.getElementById("error").innerHTML="INVALID VERIFICATION CODE";
                document.getElementById("error").style.color='red';
                document.getElementById("error").style.display='block';
            }
            else if(responseData.message=="verified"){
                setSubmit(false);
                document.getElementById("error").innerHTML="EMAIL VERIFIED";
                document.getElementById("error").style.color='green';
                document.getElementById("error").style.display='block';
                setTimeout(()=>{window.location.href = `/login`;}, 2000);
            }
        } catch (error) {
            console.error('Error:', error.message);
            saveLogs(error.message,'/verification',"User");
            setSubmit(false);
        }
    };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row" style={{ marginTop: "7%" }}>
          <div className="col-md-6">
            <img
              src="./Assets/verify.png"
              alt="Registration"
              className="img-fluid"
            />
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <p style={{textAlign:"left"}}>Verification Code sent on your email</p>
              <MDBInput
                type="password"
                label="Verification Code"
                v-model="password"
                wrapperClass="mb-4"
                id="code"
                name="code"
                required
              />
              <span id='error'></span>
              <MDBBtn
                style={{ backgroundColor: "#786141" }}
                block
                className="my-4"
              >
                {submit?(
                    <MDBSpinner style={{color:'white'}}></MDBSpinner>
                ):(
                    <span>Verify</span>
                )}
              </MDBBtn>
            </form>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
