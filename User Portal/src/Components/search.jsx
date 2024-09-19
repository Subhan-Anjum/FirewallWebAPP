import React, { useEffect, useState } from "react";
import Header from "./header";
import LoginHeader from "./loginHeader";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import {  MDBCardImage, MDBRow, MDBCol } from "mdb-react-ui-kit";
import {Link} from 'react-router-dom';
import Footer from "./fotter";
import Cookies from "js-cookie";
import { saveLogs } from './logs';

export default function Search() {
  const [data,setData]=useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get('brand');


  useEffect(()=>{
    document.body.style.overflowX="hidden";
    getProducts();
  })

  async function getProducts() {
    await fetch(`http://localhost:4000/getInventory`, {
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
        setData(data.data.filter((item) => item.Active === 1 && item.brandName.toLowerCase().includes(brand.toLowerCase())));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      {Cookies.get("email")==null || Cookies.get("email")=="" ? <Header/> : <LoginHeader/> }
      {/* Carousel */}
      <MDBCarousel showControls>
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={1}
          src="./Assets/image2.png"
          alt="Collection"
        />
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={2}
          src="./Assets/image1.png"
          alt="Collection"
        />
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={3}
          src="./Assets/image3.png"
          alt="Collection"
        />
      </MDBCarousel>

      {/* Products */}
      <h1
        className="mainheadings"
        style={{ marginLeft: "4%", marginTop: "30px" }}
      >
        Featured products
      </h1>

      <MDBRow
        className="row-cols-1 row-cols-md-4 g-4"
        style={{ margin: "30px", marginTop: "-10px" }}
      >
        {data.map((products,index)=>(
          <MDBCol>
            <Link to={`/productdetails?id=${products.Id}`}>
              <MDBCardImage
                className="productphoto"
                style={{ borderRadius: "0px", border: "4px solid #ac9a8d",cursor:"pointer" }}
                src={`http://localhost:4000/images/${products.image}`}
                alt="Collection1"
                position="top"
              />
            </Link>
            <p className="cardtext" style={{textTransform: "capitalize"}}>{products.brandName}</p>
            <p className="cardprice">Rs {products.price}.00</p>
          </MDBCol>
        ))}
      </MDBRow>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
