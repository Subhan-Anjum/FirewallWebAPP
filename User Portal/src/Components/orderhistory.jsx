import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import LoginHeader from "./loginHeader";
import React,{useEffect,useState} from "react";
import Footer from "./fotter";
import Header from "./header";
import Cookies from "js-cookie";
import { saveLogs } from './logs';

export default function OrderHistory() {
  const [orders,setOrders]=useState([]);
  const [total,setTotal]=useState(0);

  useEffect(()=>{
    getOrders();
  },[])

  async function getOrders() {
    try {
      const response = await fetch(`http://localhost:4000/getOrders?id=${Cookies.get("userId")}`, {
        method: "GET",
        headers: {
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error("Request failed.");
      }
  
      const data = await response.json();
      const sumOfProducts = data.data.reduce((total, product) => {
        return total + product.total;
      }, 0);
      setTotal(sumOfProducts);
  
      setOrders(data.data);
    } catch (error) {
      console.error("Error:", error);
      saveLogs(error.message,'/orderHistory',"User");
    }
  }
  return (
    <>
      {Cookies.get("email")==null || Cookies.get("email")=="" ? <Header/> : <LoginHeader/> }
      <section className="h-100 gradient-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="10" xl="8">
              {orders.length!=0?(
                <MDBCard style={{ borderRadius: "10px" }}>
                <MDBCardHeader className="px-4 py-5">
                  <MDBTypography tag="h5" className="text-muted mb-0">
                    Your Order History
                  </MDBTypography>
                </MDBCardHeader>
                <MDBCardBody className="p-4">
                  {orders.map((order,index)=>(
                  <MDBCard className="shadow-0 border mb-4">
                    <MDBCardBody>
                        <div>
                        <MDBRow>
                          <MDBCol md="2">
                            <MDBCardImage
                              src={`http://localhost:4000/images/${order.image}`}
                              fluid
                              alt="Phone"
                              style={{width:"100px",height:"100px"}}
                            />
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0">{order.brandName}</p>
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0 small">{order.name}</p>
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0 small">{new Date(order.dated).toLocaleString()}</p>
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0 small">Qty: {order.quantity}</p>
                          </MDBCol>
                          <MDBCol
                            md="2"
                            className="text-center d-flex justify-content-center align-items-center"
                          >
                            <p className="text-muted mb-0 small">Rs {order.total}.00</p>
                          </MDBCol>
                        </MDBRow>
                        <hr
                          className="mb-4"
                          style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                        />
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                  ))}

                </MDBCardBody>
                <MDBCardFooter
                  className="border-0 px-4 py-5"
                  style={{
                    backgroundColor: "#786141",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  <MDBTypography
                    tag="h5"
                    className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                  >
                    Total paid:{" "}
                    <span
                      className="h3 mb-0 ms-2"
                      style={{ fontFamily: "bahnschrift" }}
                    >
                      Rs {total}.00
                    </span>
                  </MDBTypography>
                </MDBCardFooter>
              </MDBCard>
              ):(
               <center><h1>No Order History</h1></center>
              )}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <Footer />
    </>
  );
}
