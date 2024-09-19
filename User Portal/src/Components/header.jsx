import React, { useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  MDBNavbarToggler,
  Collapse,
  MDBIcon,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  MDBInput,
} from "mdbreact";
import Smallheader from "./smallheader";
import Cookies from "js-cookie";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Header */}
      <Navbar
        light
        expand="md"
        style={{ marginTop: "-10px", backgroundColor: "white" }}
      >
        <NavbarBrand>
          <img
            src="./assets/logo.png"
            height="80"
            width="80"
            alt="Essence Outfitters"
            style={{ marginLeft: "30px" }}
          />
          <h4
            className="font-weight-bold text-uppercase mb-0 ml-2"
            style={{ color: "#54b5be", fontWeight: "bold" }}
          >
            Essence <span style={{ color: "#786141" }}>Outfitters</span>
          </h4>
        </NavbarBrand>
        <MDBNavbarToggler
          type="button"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={toggleCollapse}
        >
          <MDBIcon icon="bars" fas style={{ color: "white" }} />
        </MDBNavbarToggler>
        <Collapse isOpen={isOpen} navbar>
          <NavbarNav left></NavbarNav>
          <NavbarNav className="mx-auto" style={{ marginTop: "30px" }}>
            <form className="form-inline my-2 my-lg-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-white border-0">
                    <i className="fa fa-search" onClick={() => {
                      if (document.getElementById("search").value != "") {
                        window.location.href = `/search?brand=${document.getElementById("search").value}`
                      }
                    }} style={{
                      cursor: "pointer"
                    }}></i>
                  </span>
                </div>
                <MDBInput
                  hint="Search"
                  type="text"
                  id="search"
                  containerClass="mt-0 border-0"
                />
              </div>
            </form>
          </NavbarNav>
          <NavbarNav className="ml-auto" right>
            <NavItem>
              <Dropdown>
                <DropdownToggle nav caret style={{ color: "black" }}>
                  Language
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>English</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
            <NavItem>
              <Dropdown>
                <DropdownToggle
                  nav
                  caret
                  style={{ color: "black", marginRight: "20px" }}
                >
                  My Account
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="/register">Register</DropdownItem>
                  <DropdownItem href="/login" onClick={() => { Cookies.set('rateLimiter', 0, { expires: 0.5 }); }}>Login</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </NavbarNav>
        </Collapse>
      </Navbar>
      {/* header navbar */}
      <Smallheader />
    </div>
  );
}
