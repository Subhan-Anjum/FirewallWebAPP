import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBCard, MDBCardBody, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import { saveLogs } from './logs';
import axios from 'axios';

export default function Myaccount() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [csubmit, setCSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [csuccess, setCSuccess] = useState(false);
  const [username,setUsername]=useState("");
  const [email, setEmail] = useState("");
  const [previous, setPrevious] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newpass, setNewpass] = useState("");

  useEffect(() => {
    setShow(true);
    setUsername(Cookies.get("username"));
    setEmail(Cookies.get("email"));
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
  }, []);

  const handleUsername=(event)=>{
    setUsername(event.target.value);
  }

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePrevious = (event) => {
    setPrevious(event.target.value);
  };
  const handleCurrent = (event) => {
    setConfirm(event.target.value);
  };
  const handleNewpass = (event) => {
    setNewpass(event.target.value);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post('http://localhost:4000/updateAdmin', formData, {
        headers: {
          "Content-Type": "application/json", 
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });
      const responseData = response.data;
      if(responseData.message=="updated"){
        form.reset();
        Cookies.set('email',email, { expires: 2 });
        Cookies.set('username', username, { expires: 2 });
        setSubmit(false);
        setSuccess(true);
        setTimeout(function () {
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setSubmit(false);
    }
  };

  const handleCredentials = async (e) => {
    e.preventDefault();
    setCSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    if(confirm==newpass){
      try {
        const response = await axios.post('http://localhost:4000/updateCredentials', formData, {
          headers: {
            "Content-Type": "application/json", 
            "api-key": process.env.REACT_APP_API_KEY,
          },
        });
        const responseData = response.data;
        if (responseData.message == "updated") {
          setPrevious("");
          setConfirm("");
          setNewpass("");
          setCSubmit(false);
          setCSuccess(true);
          setTimeout(function () {
            setCSuccess(false);
          }, 2000);
        } else if (responseData.message == "incorrect") {
          setCSubmit(false);
          setCSuccess(false);
          document.getElementById("error").innerHTML =
            "Current Password is incorrect";
          document.getElementById("error").style.color = "red";
          document.getElementById("error").style.display = "block";
        }
      } catch (error) {
        console.error('Error:', error.message);
        setSubmit(false);
        saveLogs(error.message,'/myaccount',"Admin");
      }
    }
    else{
      document.getElementById("error").innerHTML =
        "Password & confirm Password must be same";
      document.getElementById("error").style.color = "red";
      document.getElementById("error").style.display = "block";
    }
  };

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            My Account
          </h1>
          <MDBCard
            style={{ borderRadius: 0, margin: "5px", marginTop: "40px" }}
            id="card"
          >
            <h4
              id="cardhead"
              style={{ textAlign: "left", padding: "15px", fontWeight: "bold" }}
            >
              Personal Details
            </h4>
            <form onSubmit={handleChange}>
              <MDBCardBody style={{ textAlign: "left" }}>
                <Form.Group className="mb-3">
                  <div className="d-flex flex-wrap">
                    <div className="mb-2 mb-lg-0 pe-lg-2 flex-grow-1">
                      <p style={{ marginBottom: "0px" }}>Name</p>
                      <Form.Control
                        type="text"
                        size="lg"
                        id="card"
                        name="username"
                        value={username}
                        onChange={handleUsername}
                        required
                        style={{ borderRadius: 0, color: "black" }}
                      />
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="d-flex flex-wrap">
                    <div className="mb-2 mb-lg-0 pe-lg-2 flex-grow-1">
                      <p style={{ marginBottom: "0px" }}>Email</p>
                      <Form.Control
                        type="text"
                        size="lg"
                        id="card"
                        name="email"
                        value={email}
                        onChange={handleEmail}
                        required
                        style={{ borderRadius: 0, color: "black" }}
                      />
                    </div>
                  </div>
                </Form.Group>

                <MDBBtn
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    backgroundColor: success ? "green" : "",
                    color: success ? "white" : "",
                  }}
                  className="btnsc"
                >
                  {submit ? (
                    <MDBSpinner color="info" />
                  ) : success ? (
                    <span>Updated</span>
                  ) : (
                    <span>Update</span>
                  )}
                </MDBBtn>
              </MDBCardBody>
            </form>
          </MDBCard>

          <MDBCard
            style={{
              borderRadius: 0,
              margin: "5px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
            id="card"
          >
            <h4
              id="cardhead"
              style={{ textAlign: "left", padding: "15px", fontWeight: "bold" }}
            >
              Change Credentials
            </h4>
            <form onSubmit={handleCredentials}>
              <MDBCardBody style={{ textAlign: "left" }}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Current Password"
                    size="lg"
                    id="card"
                    name="password"
                    value={previous}
                    onChange={handlePrevious}
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="New Password"
                    size="lg"
                    id="card"
                    name="newpass"
                    value={newpass}
                    onChange={handleNewpass}
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    size="lg"
                    id="card"
                    value={confirm}
                    onChange={handleCurrent}
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                  <span id="error"></span>
                </Form.Group>

                <MDBBtn
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    backgroundColor: csuccess ? "green" : "",
                    color: csuccess ? "white" : "",
                  }}
                  className="btnsc"
                >
                  {csubmit ? (
                    <MDBSpinner color="info" />
                  ) : csuccess ? (
                    <span>Changed</span>
                  ) : (
                    <span>Change Credentials</span>
                  )}
                </MDBBtn>
              </MDBCardBody>
            </form>
          </MDBCard>
        </div>
      </div>
    </div>
  );
}
