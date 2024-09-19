import React, { useEffect, useState } from "react";
import Header from "./header";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import {
    MDBCol,
    MDBCard,
    MDBCardBody,
  } from "mdb-react-ui-kit";
import Footer from "./fotter";
import axios from 'axios';
import Cookies from "js-cookie";
import { saveLogs } from './logs';

export default function Profile() {
  const [submit,setSubmit]=useState(false);
  const [dsubmit,setdSubmit]=useState(false);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");

  useEffect(()=>{
    getProfile();
  },[])

  async function getProfile() {
    try {
      const response = await fetch(`http://localhost:4000/getProfile?id=${Cookies.get("userId")}`, {
        method: "GET",
        headers: {
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error("Request failed.");
      }
  
      const data = await response.json();
      setUsername(data.data[0].username);
      setEmail(data.data[0].email);
    } catch (error) {
      console.error("Error:", error);
      saveLogs(error.message,'/profile',"User");
    }
  }

  async function handleDelete() {
    if (window.confirm("Are you sure you want to deactivate you account?")) {
        setdSubmit(true);
      await fetch(`http://localhost:4000/deleteuser?id=${Cookies.get("userId")}`, {
        method: "DELETE",
        headers: {
          "api-key": process.env.REACT_APP_API_KEY,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request failed.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.message == "deleted") {
            Cookies.remove("email");
            Cookies.remove("userId");
            window.location.href="/";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const password=document.getElementById("password").value;
    const cpassword=document.getElementById("cpassword").value;

    if(password!=cpassword){
        document.getElementById("pass-error").innerHTML="PASSWORD & CONFIRM PASSWORD MUST BE SAME";
        document.getElementById("pass-error").style.color="red";
        document.getElementById("pass-error").style.display="block";
    }
    else{
        const Data={
            username:username,
            email:email,
            password:password,
            id:Cookies.get("userId"),
        }
    
        try {
            const response = await axios.post('http://localhost:4000/updateProfile',Data, {
                headers: {
                    "Content-Type": "application/json", 
                    "api-key": process.env.REACT_APP_API_KEY,
                },
            });
    
            setSubmit(false);
            const responseData = response.data;
            if(responseData.message=="updated"){
                document.getElementById("password").value="";
                document.getElementById("cpassword").value="";
                document.getElementById("pass-error").innerHTML="PROFILE HAS BEEN UPDATED";
                document.getElementById("pass-error").style.color="green";
                document.getElementById("pass-error").style.display="block";
                getProfile();
            }
        } catch (error) {
            console.error('Error:', error.message);
            setSubmit(false);
        }
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
      <center>
          <MDBCol md="7">
            <MDBCard className="my-5">
              <form
                onSubmit={handleSubmit}
                method="post"
                id="addform"
              >
                <MDBCardBody className="p-5">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Username"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="text"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email"
                    required
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Change Password"
                    name="password"
                    id="password"
                    type="password"
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Confirm Password"
                    name="cpassword"
                    id="cpassword"
                    type="password"
                  />
                  <span id="pass-error"></span>
                  <br />
                  <MDBBtn
                    type="submit"
                    className="w-100 mb-4"
                    size="md"
                    style={{
                      backgroundColor: "#786141",
                      color: "white",
                    }}
                  >
                    {submit?<MDBSpinner style={{color:"white"}}></MDBSpinner>:<span>Change</span>}
                  </MDBBtn>
                  <MDBBtn
                    type="submit"
                    className="w-100 mb-4"
                    size="md"
                    style={{
                      backgroundColor: "red",
                      color: "white",
                    }}
                    onClick={handleDelete}
                  >
                    {dsubmit?<MDBSpinner style={{color:"white"}}></MDBSpinner>:<span>Deactivate My Account</span>}
                  </MDBBtn>
                </MDBCardBody>
              </form>
            </MDBCard>
          </MDBCol>
        </center>
      </div>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
