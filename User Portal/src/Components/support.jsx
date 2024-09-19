import React, { useState } from "react";
import Header from "./header";
import { MDBInput, MDBBtn, MDBTextArea, MDBSpinner } from "mdb-react-ui-kit";
import Footer from "./fotter";
import Cookies from "js-cookie";
import LoginHeader from "./loginHeader";
import { saveLogs } from './logs';

export default function Support() {
  const [submit,setSubmit]=useState(false);

  const handleSupport = async (event) => {
    event.preventDefault();
      setSubmit(true);
      const email=document.getElementById("email").value;
      const subject=document.getElementById("subject").value;
      const body=document.getElementById("body").value;
  
      const data = {
        email: email,
        subject: subject,
        body:body,
      };
  
      await fetch(
        `http://localhost:4000/support`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(data), 
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request failed.");
          }
          return response.json();
        })
        .then((data) => {
          setSubmit(false);
          if (data.message === "added") {
            document.getElementById("email").value="";
            document.getElementById("subject").value="";
            document.getElementById("body").value="";
            document.getElementById("msg").innerHTML="You message has been delivered";
            document.getElementById("msg").style.color="green";
            document.getElementById("msg").style.display="block";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          saveLogs(error.message,'/support',"User");
        });
    }

  return (
    <div>
      {Cookies.get("email")==null || Cookies.get("email")=="" ? <Header/> : <LoginHeader/> }
      <div className="container">
        <div className="row" style={{ marginTop: "7%" }}>
          <div className="col-md-6">
            <img
              src="./Assets/cs.png"
              alt="Customer Support"
              className="img-fluid"
            />
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSupport}>
              <MDBInput
                type="email"
                label="Email address"
                v-model="email"
                wrapperClass="mb-4"
                id="email"
                name="email"
                required
              />

              <MDBInput label="Subject" v-model="subject" wrapperClass="mb-4" id="subject" name="subject" required/>

              <MDBTextArea wrapperClass="mb-4" label="Message" id="body" name="message" required/>
              <span id="msg"></span>
              <MDBBtn
                style={{ backgroundColor: "#786141" }}
                type="submit"
                block
                className="my-4"
              >
                {submit?(
                  <center><MDBSpinner style={{color:"white"}}></MDBSpinner></center>
                ):(
                  <span>Send</span>
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
