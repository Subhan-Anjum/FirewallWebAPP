import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { Form } from 'react-bootstrap';
import Footer from "./fotter";
import axios from 'axios';
import Cookies from "js-cookie";
import { saveLogs } from './logs';
import RateLimiter from './RateLimiter';

// Rate limiter setup
const rateLimiter = new RateLimiter(5, 120000); // 5 attempts per 2 minutes

export default function Login() {
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    // Retrieve the expiration time from the cookie
    const expirationTime = Cookies.get('rateLimitExpiration');
    if (expirationTime) {
      const timeRemaining = expirationTime - Date.now();
      if (timeRemaining > 0) {
        // Set the rate limiter's last reset time to the expiration time
        rateLimiter.lastReset = expirationTime;
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    // Cookies.set('rateLimiter', 'undefined', { expires: 0.00138 });
    // Cookies.set('rate', 'false', { expires: 0.00138 });

    try {
      // console.log(Cookies.get('rateLimiter'));
      // console.log(parseInt(Cookies.get('rateLimiter')) < rateLimiter.limit);
      // console.log(Cookies.get('rateLimiter') !== 'undefined');
      // console.log(Cookies.get('rate') === 'true');
      if ((Cookies.get('rate') !== 'true' & Cookies.get('rateLimiter') !== 'undefined') || Cookies.get('rateLimiter') === 'undefined') {
        const response = await axios.post('http://localhost:4000/login', formData, {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        });

        setSubmit(false);
        const responseData = response.data;
        if (responseData.message === "success") {
          Cookies.set('email', responseData.email, { expires: 2 });
          Cookies.set('token', responseData.token, { expires: 2 });
          Cookies.set('userId', responseData.userid, { expires: 2 });
          window.location.href = process.env.REACT_APP_URL;
        } else if (responseData.message === "invalid") {
          document.getElementById("message").innerHTML = "INVALID USERNAME OR PASSWORD";
          document.getElementById("message").style.color = "red";
          document.getElementById("message").style.display = "block";
          rateLimiter.incrementCount(); // Increment invalid attempt count
          Cookies.set('rateLimiter', rateLimiter.count, { expires: 0.00138 });
          if (parseInt(Cookies.get('rateLimiter')) > rateLimiter.limit & Cookies.get('rateLimiter') !== 'undefined') {
            Cookies.set('rate', true, { expires: 0.00138 });
          }
        }
      } else {
        // Rate limit exceeded
        alert("Your account has been locked for 2 minutes Try Again Later")
        document.getElementById("message").innerHTML = "Too many login attempts. Please try again later.";
        document.getElementById("message").style.color = "red";
        document.getElementById("message").style.display = "block";
      }
    } catch (error) {
      console.error('Error:', error.message);
      setSubmit(false);
      saveLogs(error.message, '/login', "User");
    }
  };

  // Store the expiration time in cookies
  useEffect(() => {
    const expirationTime = rateLimiter.lastReset + rateLimiter.interval;
    Cookies.set('rateLimitExpiration', expirationTime, { expires: new Date(expirationTime) });
  }, [rateLimiter.lastReset]);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row" style={{ marginTop: "7%" }}>
          <div className="col-md-6">
            <img
              src="./Assets/login.png"
              alt="Registration"
              className="img-fluid"
            />
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <MDBInput
                type="email"
                label="Email address"
                v-model="email"
                wrapperClass="mb-4"
                id="email"
                name="email"
                required
              />
              <MDBInput
                type="password"
                label="Password"
                v-model="password"
                id="password"
                name="password"
                wrapperClass="mb-4"
                required
              />
              <span id="message"></span>
              <MDBBtn
                style={{ backgroundColor: "#786141" }}
                block
                className="my-4"
              >
                {submit ? (
                  <MDBSpinner style={{ color: "white" }}></MDBSpinner>
                ) : (
                  <span>Login</span>
                )}
              </MDBBtn>
              Don't have an account? <Link to="/register">Register</Link>
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
