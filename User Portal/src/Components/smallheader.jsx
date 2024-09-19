import React, { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { MDBIcon, MDBNavbarToggler, Collapse } from "mdbreact";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";

const SmallHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Navbar style={{ backgroundColor: "#786141" }} expand="lg">
      <MDBNavbarToggler
        type="button"
        data-target="#navbarTogglerDemo01"
        aria-controls="navbar-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={toggleCollapse}
      >
        <MDBIcon icon="bars" fas style={{ color: "#011F5B" }} />
      </MDBNavbarToggler>
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mx-auto align-items-center">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/support">Support</Nav.Link>
          <Nav.Link href="/ordershistory">My Orders</Nav.Link>
        </Nav>
        <Nav className="align-items-center" style={{ marginRight: "10px" }}>
          <Nav.Link className="ml-auto" onClick={()=>{
            if(Cookies.get("userId")!=null){
              window.location.href="/cart";
            }
            else{
              window.location.href="/login";
            }
          }}>
            Cart
            <MDBIcon
              icon="shopping-cart"
              style={{ marginLeft: "5px" }}
              className="ml-2"
            />
          </Nav.Link>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default SmallHeader;
