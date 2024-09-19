import { useEffect, useState } from "react";
import { Col, Row, Form, Container, Button } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import { Card, CardBody, CardTitle } from "reactstrap";
import { MDBCardBody, MDBCardImage,MDBSpinner } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import LoginHeader from "./loginHeader";
import Footer from "./fotter";
import Header from "./header";
import Cookies from "js-cookie";
import axios from 'axios';
import { saveLogs } from './logs';

function ReviewData() {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [data,setData]=useState([]);
  const [similar,setSimilar]=useState([]);
  const [quantity,setQuantity]=useState(1);
  const [submit,setSubmit]=useState(false);
  const [buySubmit,setBuysubmit]=useState(false);
  const [reviewSubmit,setReviewsubmit]=useState(false);
  const [reviews,setReviews]=useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  useEffect(()=>{
    document.body.style.overflowX="hidden";
    window.scrollTo(0, 0);
    getProducts();
    getReviews();
  },[])

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

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
        setData(data.data.filter((item)=>item.Id==id && item.Active==1));
        const filterId=data.data.filter((item)=>item.Id==id);
        setSimilar(data.data.filter((item)=>item.brandName==filterId[0].brandName && item.Id!=filterId[0].Id && item.Active==1));
      })
      .catch((error) => {
        console.error("Error:", error);
        saveLogs(error.message,'/productdetails',"User");
      });
  }

  async function getReviews() {
    await fetch(`http://localhost:4000/getReviews?id=${id}`, {
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
        setReviews(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleCart = async (e) => {
    if(Cookies.get("userId")==null || Cookies.get("userId")==""){
      alert("Login to add product to cart");
    }
    else{
      setSubmit(true);
      const Data={
        userId:Cookies.get("userId"),
        productId:id,
        quantity:quantity,
      }

      try {
          const response = await axios.post('http://localhost:4000/addtoCart', Data, {
              headers: {
                  "Content-Type": "application/json", 
                  "api-key": process.env.REACT_APP_API_KEY,
              },
          });

          const responseData = response.data;
          if(responseData.message=="added"){
            window.location.href="/cart";
          }
          else if(responseData.message=="already"){
            setSubmit(false);
            alert("Product Already added to your cart");
          }
      } catch (error) {
          console.error('Error:', error.message);
          setSubmit(false);
      }
    }
  };

  const handleBuy = async (image,price) => {
    if(Cookies.get("userId")==null || Cookies.get("userId")==""){
      alert("Login to buy product");
    }
    else{
      setBuysubmit(true);
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
          setBuysubmit(false);
          if(responseData.message=="outofstock"){
            alert("Product is out of stock");
          }
          else{
            window.location.href=responseData.sessionUrl;
          }
      } catch (error) {
          console.error('Error:', error.message);
          setSubmit(false);
      }
    }
  };

  const handleReview = async (event) => {
    event.preventDefault();
    if(Cookies.get("userId")==null || Cookies.get("userId")==""){
      alert("Login to give review");
    }
    else{
      setReviewsubmit(true);
      const review=document.getElementById("review").value;
      const Data={
        userId:Cookies.get("userId"),
        productId:id,
        rating:rating,
        review:review,
      }

      try {
          const response = await axios.post('http://localhost:4000/review', Data, {
              headers: {
                  "Content-Type": "application/json", 
                  "api-key": process.env.REACT_APP_API_KEY,
              },
          });

          const responseData = response.data;
          setReviewsubmit(false);
          if(responseData.message=="already"){
            alert("You have already gave a review");
          }
          else{
            setShowForm(false);
            getReviews();
          }
      } catch (error) {
          console.error('Error:', error.message);
      }
    }
  };

  function generateGoldenStars(num) {
    const goldenStar = '\u2B50'; 
    let stars="";
    for (let i = 1; i <= parseInt(num); i++) {
        stars=(goldenStar + ' ').repeat(i);
    }
    return stars;
}


  return (
    <div className="ReviewDataclass">
      {Cookies.get("email")==null || Cookies.get("email")=="" ? <Header/> : <LoginHeader/> }
      <section className="py-5">
        <div className="container">
          <div className="row gx-5">
            <Col lg={6}>
              <div className="rounded-4 mb-3 d-flex justify-content-center">
                {data.map((item,index)=>(
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "500px",
                      width: "auto",
                      height: "auto",
                    }}
                    src={`http://localhost:4000/images/${item.image}`}
                  />
                ))}
              </div>
              <Container>
                <Row className="mt-4" style={{ justifyContent: "center" }}>
                  <Col md={6}>
                    <div className="well well-sm">
                      <div className="text-right">
                        <Button variant="success" className="btn-green" onClick={()=>{
                          setShowForm(!showForm);
                        }}>
                          Leave a Review
                        </Button>
                      </div>

                      {showForm && (
                        <div className="row" id="post-review-box">
                          <div className="col-md-12">
                            <form
                              id="review-form"
                              onSubmit={handleReview}
                            >
                              <Form.Group controlId="formRating">
                                <Form.Label>Rating:</Form.Label>
                                <Rating
                                  onClick={handleRating}
                                  ratingValue={rating}
                                  size={20}
                                  label
                                  transition
                                  fillColor="orange"
                                  emptyColor="gray"
                                  className="foo" // Will remove the inline style if applied
                                />
                                {/* Use rating value */}
                                {rating}
                              </Form.Group>

                              <Form.Group controlId="formComment">
                                <Form.Control
                                  as="textarea"
                                  rows={5}
                                  name="reviewtext"
                                  id="review"
                                  placeholder="Enter your review here..."
                                />
                              </Form.Group>

                              <div className="text-right" style={{marginTop:"4px"}}>
                                <div
                                  className="stars starrr"
                                  data-rating="0"
                                ></div>
                                <Button
                                  variant="danger"
                                  onClick={handleCancel}
                                  style={{
                                    display: "inline-block",
                                    marginRight: 10,
                                  }}
                                >
                                  <span className="glyphicon glyphicon-remove"></span>
                                  Cancel
                                </Button>
                                <Button variant="success" type="submit">
                                  {reviewSubmit?(
                                    <center><MDBSpinner style={{color:"white"}}></MDBSpinner></center>
                                  ):(
                                    <span>Submit</span>
                                  )}    
                                </Button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col lg={6} style={{ textAlign: "left" }}>
              <div className="ps-lg-3">
              
                {data.map((item,index)=>(
                  <div>
                  <h4 className="title text-dark"></h4>
                  <p>{item.brandName}</p>
                  <h4 style={{ fontFamily: "bahnschrift", marginTop: "-13px" }}>
                    {item.name}
                  </h4>

                  <div className="mb-3">
                    <span className="h5">Rs. {item.price}.00</span>
                    <p style={{ textAlign: "justify" }}>
                     {item.description}
                    </p>
                  </div>
                </div>
                ))}

                <p style={{ textAlign: "justify" }}></p>

                <hr />
                <Row className="mb-4">
                  <Col md={4} xs={6} className="mb-3">
                    <Form.Label className="mb-2 d-block">Quantity</Form.Label>
                    <div
                      className="input-group mb-3"
                      style={{ width: "170px" }}
                    >
                      <Button
                        variant="white"
                        className="border border-secondary px-3"
                        type="button"
                        id="button-addon1"
                        onClick={()=>{
                          if(quantity-1>0){
                            setQuantity(quantity-1);
                          }
                        }}
                      >
                        <i className="fas fa-minus"></i>
                      </Button>
                      <Form.Control
                        type="text"
                        className="text-center border border-secondary"
                        id="quantity"
                        value={quantity}
                        aria-label="Example text with button addon"
                        aria-describedby="button-addon1"
                      />
                      <Button
                        variant="white"
                        className="border border-secondary px-3"
                        type="button"
                        id="button-addon2"
                        onClick={()=>{
                            setQuantity(quantity+1);
                        }}
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
                {data.map((item,index)=>(
                  <a>
                  <Button
                    variant="warning"
                    className="shadow-0"
                    style={{ marginRight: "5px" }}
                    onClick={()=>{
                      handleBuy(item.image,item.price)
                    }}
                  >
                    {buySubmit?(
                      <center><MDBSpinner style={{color:"white"}}></MDBSpinner></center>
                    ):(
                      <span>Buy Now</span>
                    )}
                  </Button>
                  </a>
                ))} 
                <a>
                  <Button
                    variant="primary"
                    className="shadow-0"
                    style={{ marginRight: "5px" }}
                    onClick={handleCart}
                  >
                    {submit?(
                      <center><MDBSpinner style={{color:"white"}}></MDBSpinner></center>
                    ):(
                      <span>Add to cart</span>
                    )}
                  </Button>
                </a>
              </div>
            </Col>
          </div>
        </div>
      </section>
      <section class="bg-light border-top py-4">
        <div class="container">
          <div class="row gx-4">
            <div class="col-lg-8 mb-4">
              <div class="border rounded-2 px-3 py-2 bg-white">
                <Tabs defaultActiveKey="ex1-pills-2" id="ex1-content">
                  <Tab eventKey="ex1-pills-2" title="Customer Ratings">
                    <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                      Customers Rating
                    </p>
                    <div className="header">
                    <MDBCardBody>
                      {reviews.map((review,index)=>(
                        <div>
                        <div className="d-flex flex-start align-items-center">
                          <MDBCardImage
                            className="rounded-circle shadow-1-strong me-3"
                            src={"./Assets/user.png"}
                            alt="avatar"
                            width="40"
                            height="40"
                          />
                          <div style={{ marginBottom: "-15px" }}>
                            <h6
                              className="fw-bold mb-1"
                              style={{
                                textAlign: "left",
                                color: "white",
                                fontFamily: "Bahnschrift",
                              }}
                            >
                              <Link
                                style={{
                                  textDecoration: "none",
                                  color: `black`,
                                }}
                              >
                                {review.username}
                              </Link>
                            </h6>
                            <p className="text-muted small mb-0">
                              Shared publicly -{" "}
                              {new Date(review.dated).toLocaleString("en-US", {
                                timeZone: "UTC",
                              })}
                            </p>
                            <div
                              className="starrating"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            ></div>
                          </div>
                        </div>

                        <p
                          className="mt-3 mb-4 pb-2"
                          style={{
                            color: "black",
                            textAlign: "left",
                            marginLeft: "55px",
                            textAlign: "justify",
                          }}
                        >
                          {generateGoldenStars(review.rating)}
                        </p>
                        <hr
                          style={{
                            border: "none",
                            borderTop: "2px solid #ac9a8d",
                            margin: "10px 0",
                            marginTop: "-20px",
                          }}
                        />
                        </div>
                      ))}
                      </MDBCardBody>
                    </div>
                  </Tab>
                  <Tab eventKey="ex1-pills-3" title="Customer Reviews">
                    <p style={{ marginTop: "5px", fontWeight: "bold" }}>
                      Customers Rating
                    </p>
                    <div className="header">
                      <MDBCardBody>
                      {reviews.map((review,index)=>(
                          <div>
                            <div className="d-flex flex-start align-items-center">               
                          <MDBCardImage
                            className="rounded-circle shadow-1-strong me-3"
                            src={"./Assets/user.png"}
                            alt="avatar"
                            width="40"
                            height="40"
                          />
                          <div style={{ marginBottom: "-15px" }}>
                            <h6
                              className="fw-bold mb-1"
                              style={{
                                textAlign: "left",
                                color: "white",
                                fontFamily: "Bahnschrift",
                              }}
                            >
                              <Link
                                to={`/public-profile/`}
                                style={{
                                  textDecoration: "none",
                                  color: `black`,
                                }}
                              >
                                {review.username}
                              </Link>
                            </h6>
                            <p className="text-muted small mb-0">
                              Shared publicly -{" "}
                              {new Date(review.dated).toLocaleString("en-US", {
                                timeZone: "UTC",
                              })}
                            </p>
                            <div
                              className="starrating"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            ></div>
                          </div>
                        </div>
                        <p
                          className="mt-3 mb-4 pb-2"
                          style={{
                            color: "black",
                            textAlign: "left",
                            marginLeft: "55px",
                            textAlign: "justify",
                          }}
                        >
                          {review.review}
                        </p>
                        <hr
                          style={{
                            border: "none",
                            borderTop: "2px solid #ac9a8d",
                            margin: "10px 0",
                            marginTop: "-20px",
                          }}
                        />
                          </div>
                        ))}        
                      </MDBCardBody>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
            <Col lg="4">
              <div className="px-0 border rounded-2 shadow-0">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Similar items</CardTitle>
                    <br />
                    {similar.map((item,index)=>(
                       <div className="d-flex mb-3">
                        <a href="#" className="me-3">
                          <img
                            src={`http://localhost:4000/images/${item.image}`}
                            style={{ minWidth: "96px", height: "96px" }}
                            className="img-md img-thumbnail"
                          />
                        </a>
                        <div className="info">
                          <strong
                            className="text-dark"
                            style={{ fontFamily: "bahnschrift" }}
                          >
                            Rs {item.price}.00
                          </strong>
                          <p
                            style={{
                              marginLeft: "-10px",
                            }}
                          >
                            {item.brandName}
                          </p>
                        </div>
                     </div>
                    ))}
                  </CardBody>
                </Card>
              </div>
            </Col>
          </div>
        </div>
      </section>

      <div style={{ marginTop: "5%" }}>
        <Footer />
      </div>
    </div>
  );
}
export default ReviewData;
