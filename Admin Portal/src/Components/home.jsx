import React, { useEffect, useState } from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { saveLogs } from './logs';

export default function Home() {
  const [show, setShow] = useState(false);
  const [users,setUsers]=useState("");
  const [products,setProducts]=useState("");
  const [revenue,setRevenue]=useState("");
  const [brands,setBrands]=useState("");
  const [orders,setOrders]=useState("");

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }

    async function getAdminDashboard() {
      await fetch(`http://localhost:4000/getDashboard`, {
        method: "GET",
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
          setUsers(data.users);
          setBrands(data.brands);
          setOrders(data.orders);
          setRevenue(data.revenue);
          setProducts(data.products);
        })
        .catch((error) => {
          console.error("Error:", error);
          saveLogs(error.message,'/home',"Admin");
        });
    }
    getAdminDashboard();
  }, []);

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <MDBRow style={{ margin: "5px", marginTop: "30px" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Dashboard
            </h1>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="home"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Brands
                    </div>
                    <h2>{brands}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="box-open"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Products
                    </div>
                    <h2>{products}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="users"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Users
                    </div>
                    <h2>{users}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="shopping-cart"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Orders
                    </div>
                    <h2>{orders}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <MDBIcon
                      icon="money-bill-wave"
                      className="mr-2"
                      style={{ marginRight: "5px" }}
                    />
                      Revenue
                    </div>
                    <h2>{revenue} Rs</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </div>
      </div>
    </div>
  );
}
