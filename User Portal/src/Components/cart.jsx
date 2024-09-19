import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import LoginHeader from "./loginHeader";
import React,{useEffect,useState} from "react";
import Footer from "./fotter";
import Header from "./header";
import Cookies from "js-cookie";
import axios from 'axios';
import { saveLogs } from './logs';

export default function Cart() {
  const [cart,setCart]=useState([]);

  useEffect(()=>{
    getCart();
  },[])

  async function getCart() {
    try {
      const response = await fetch(`http://localhost:4000/getCart?id=${Cookies.get("userId")}`, {
        method: "GET",
        headers: {
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error("Request failed.");
      }
  
      const data = await response.json();
      setCart(data.data);
    } catch (error) {
      console.error("Error:", error);
      saveLogs(error.message,'/cart',"User");
    }
  }
  

  async function deleteCart(id) {
    if(window.confirm("Are you sure you want to delete?")){
        await fetch(`http://localhost:4000/deleteCart?id=${id}`, {
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
          if(data.message=="deleted"){
            getCart();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          saveLogs(error.message,'/cart',"User");
        }); 
    }
  }

  const handleBuy = async (image,price,id, quantity) => {
    if(Cookies.get("userId")==null || Cookies.get("userId")==""){
      alert("Login to buy product");
    }
    else{
      const Data={
        userId:Cookies.get("userId"),
        productId:id,
        quantity:quantity,
        image:image,
        price:price,
      }

      try {
          const response = await axios.post('http://localhost:4000/buyProduct', Data, {
              headers: {
                  "Content-Type": "application/json", 
                  "api-key": process.env.REACT_APP_API_KEY,
              },
          });

          const responseData = response.data;
          if(responseData.message=="outofstock"){
            alert("Product is out of stock");
          }
          else{
            window.location.href=responseData.sessionUrl;
          }
      } catch (error) {
          console.error('Error:', error.message);
          saveLogs(error.message,'/cart',"User");
      }
    }
  };

  return (
    <section className="h-100 h-custom">
      {Cookies.get("email")==null || Cookies.get("email")=="" ? <Header/> : <LoginHeader/> }
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard>
              <MDBCardBody className="p-4">
                <MDBRow>
                  <MDBCol lg="12">
                    <MDBTypography tag="h5">Shopping Cart</MDBTypography>
                    {cart.map((item,index)=>(
                      <MDBCard className="mb-3" style={{ marginTop: "30px" }}>
                      <MDBCardBody>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-row align-items-center">
                            <div>
                              <MDBCardImage
                                src={`http://localhost:4000/images/${item.image}`}
                                fluid
                                className="rounded-3"
                                style={{ width: "65px",height:"65px" }}
                                alt="Shopping item"
                              />
                            </div>
                            <div className="ms-3">
                              <MDBTypography
                                tag="h5"
                                style={{ fontFamily: "bahnschrift" }}
                              >
                                {item.brandName}
                              </MDBTypography>
                              <p className="small mb-0">{item.name}</p>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center">
                            <div style={{ width: "50px" }}>
                              <MDBTypography
                                tag="h5"
                                className="fw-normal mb-0"
                              >
                                {item.quantity}
                              </MDBTypography>
                            </div>
                            <div style={{ width: "120px" }}>
                              <MDBTypography
                                tag="h5"
                                className="mb-0"
                                style={{ fontFamily: "bahnschrift" }}
                              >
                                Rs {item.price*item.quantity}
                              </MDBTypography>
                            </div>
                            <a href="#" style={{ color: "#cecece" }} onClick={()=>{
                              deleteCart(item.cartId);
                            }}>
                              <MDBIcon fas icon="trash-alt" />
                            </a>
                            <MDBBtn style={{marginLeft:"15px",color:"#786141",backgroundColor:"transparent"}} onClick={()=>{
                              handleBuy(item.image,item.price,item.productId,item.quantity)
                            }}>Buy</MDBBtn>
                          </div>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                    ))}
                    </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </section>
  );
}
