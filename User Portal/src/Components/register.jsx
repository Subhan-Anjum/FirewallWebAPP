import React, { useState } from "react";
import Header from "./header";
import { MDBInput, MDBBtn,MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from 'axios';
import Footer from "./fotter";
import { saveLogs } from './logs';

export default function Register() {
  const [submit,setSubmit]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;  
    const Cpassword = document.getElementById("cpassword").value; 

    if (password !== Cpassword) {
        document.getElementById("error").innerHTML = "PASSWORD & CONFIRM PASSWORD MUST BE SAME";
        document.getElementById("error").style.color = "red";
        document.getElementById("error").style.display = "block";
    } else {
      setSubmit(true);
        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await axios.post('http://localhost:4000/register', formData, {
                headers: {
                    "Content-Type": "application/json", 
                    "api-key": process.env.REACT_APP_API_KEY,
                },
            });

            const responseData = response.data;
            setSubmit(false);
            if(responseData.message=="already"){
              document.getElementById("error").innerHTML = "EMAIL ALREADY EXIST";
              document.getElementById("error").style.color = "red";
              document.getElementById("error").style.display = "block";
            }
            else{
              form.reset();
              window.location.href = `/verification?email=${responseData.email}&auth=${responseData.code}`;
            }
        } catch (error) {
            console.error('Error:', error.message);
            saveLogs(error.message,'/register',"User");
            setSubmit(false);
        }
    }
};

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row" style={{ marginTop: "7%" }}>
          <div className="col-md-6">
            <img
              src="./Assets/register.png"
              alt="Registration"
              className="img-fluid"
            />
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <MDBInput
                label="Username"
                v-model="Username"
                id='username'
                name="username"
                wrapperClass="mb-4"
                required
              />
              <MDBInput
                type="email"
                label="Email address"
                v-model="email"
                name="email"
                id="email"
                wrapperClass="mb-4"
                required
              />
              <MDBInput
                type="password"
                label="Password"
                id="password"
                name="password"
                v-model="password"
                wrapperClass="mb-4"
                required
              />
              <MDBInput
                type="password"
                id="cpassword"
                name="cpassword"
                label="Confirm Password"
                v-model="password"
                wrapperClass="mb-4"
                required
              />
              <span id="error"></span>
              {submit?(
                <MDBBtn 
                style={{ backgroundColor: "#786141" }}
                block
                className="my-4"><center><MDBSpinner style={{color:"white"}}></MDBSpinner></center></MDBBtn>
              ):(
                <MDBBtn
                style={{ backgroundColor: "#786141" }}
                block
                className="my-4"
              >
                Register
              </MDBBtn>
              )}
              Already have an account? <Link to="/login">Login</Link>
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
