import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import { saveLogs } from './logs';

function Login() {
  const [submit, setSubmit] = useState(false);
  const [valid, setValid] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
  }, []);

  const handleEmail = (event) => {
    setEmail(event.target.value);
    if (event.target.value.length === 0) {
      event.target.style.backgroundColor = "#f6eacf";
      event.target.style.border = "1px solid #daa93e";
    } else {
      event.target.style.backgroundColor = "#d1e4df";
      event.target.style.border = "1px solid #579c89";
    }
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length === 0) {
      event.target.style.backgroundColor = "#f6eacf";
      event.target.style.border = "1px solid #daa93e";
    } else {
      event.target.style.backgroundColor = "#d1e4df";
      event.target.style.border = "1px solid #579c89";
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmit(true);
    const data = {
      email: email,
      password: password,
    };

    await fetch(
      `http://localhost:4000/adminlogin`,
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
        if (data.message === "success") {
          Cookies.set('email', data.email, { expires: 2 });
          Cookies.set('username', data.username, { expires: 2 });
          Cookies.set('token', data.token, { expires: 2 });
          window.location.href = process.env.REACT_APP_URL;
        } else {
          setSubmit(false);
          setValid(true);
          setTimeout(() => { setValid(false) }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        saveLogs(error.message, '/login', "Admin");
      });
  };


  return (
    <div>
      <div className="login-container">
        <MDBContainer fluid>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol col="12">
              <MDBCard
                className="my-5 mx-auto"
                id="card"
                style={{ borderRadius: 0, maxWidth: "400px" }}
              >
                <MDBCardBody className="p-5 w-100 d-flex flex-column">
                  <form onSubmit={handleLogin}>
                    <center>
                      <img
                        src="./Assets/logo.png"
                        alt="Sushi"
                        style={{
                          width: "180px",
                          borderRadius: "50%",
                          height: "180px",
                        }}
                      />
                    </center>
                    <h4 style={{ marginTop: "10px", marginBottom: "30px" }}>
                      Login
                    </h4>
                    <Form.Group className="mb-3">
                      <Form.Control
                        // type="email"
                        placeholder="Email"
                        size="lg"
                        value={email}
                        onChange={handleEmail}
                        style={{ borderRadius: 0 }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        size="lg"
                        value={password}
                        onChange={handlePassword}
                        style={{ borderRadius: 0 }}
                      />
                    </Form.Group>
                    <MDBBtn
                      type="submit"
                      size="lg"
                      style={{
                        borderRadius: 0,
                        width: "100%",
                        backgroundColor: valid ? "red" : "",
                      }}
                      className="btnsc"
                    >
                      {submit ? (
                        <MDBSpinner color="info" />
                      ) : valid ? (
                        <span>Incorrect Login</span>
                      ) : (
                        <span>Login</span>
                      )}
                    </MDBBtn>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Essence Outfitters. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Login;
