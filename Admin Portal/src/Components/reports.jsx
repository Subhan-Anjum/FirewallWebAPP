import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBCard, MDBCardBody, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import {Table} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveLogs } from './logs';

export default function Reports() {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [Orders, setOrders] = useState([]);
  const [Inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Select an item");


  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }

    async function getData() {
      await fetch(`http://localhost:4000/getAllOrders`, {
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
          setOrders(data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
          saveLogs(error.message,'/reports',"Admin");
        });
    }
    getData();
  }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:4000/getAllOrders`);
                const data = await response.json();
                const responses = await fetch(`http://localhost:4000/getInventory`);
                const datas = await responses.json();
                setOrders(data.data);
                setInventory(datas.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleSelect = (event) => {
        setSelectedItem(event.target.value);
    };

    const generatePDF = async () => {
      if(selectedItem=="orders"){
          try {
            const pdfDoc = new jsPDF();
            pdfDoc.text("Product Purchase Report", 20, 20);
            pdfDoc.autoTable({
                head: [
                    ["Product Buyer", "Product", "Quantity", "Dated", "Price"],
                ],
                body: Orders.map((product) => [
                    product.username,
                    product.name,
                    product.quantity,
                    new Date(product.dated).toLocaleString(),
                    product.price,
                ]),
                theme: "grid",
                headStyles: { fillColor: "#3C4763", textColor: "#ffffff" },
                styles: {
                    fontSize: 10,
                    halign: "center",
                    cellPadding: 2,
                },
                margin: { top: 30 },
            });
            const totalRevenue = calculateTotalRevenue();
            pdfDoc.text(`Total: PKR ${totalRevenue}`, 20, pdfDoc.autoTable.previous.finalY + 10);
            pdfDoc.save("orders_report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
      }
      else if(selectedItem=="inventory"){
        try {
          const pdfDoc = new jsPDF();
          pdfDoc.text("Inventory Report", 20, 20);
          pdfDoc.autoTable({
              head: [
                  ["Product", "Brand", "Price", "Stock","Status","Created At","Updated At"],
              ],
              body: Inventory.map((product) => [
                  product.name,
                  product.brandName,
                  product.price,
                  product.stock,
                  product.Active==1?"Active":"Inactive",
                  new Date(product.createdAt).toLocaleString(),
                  new Date(product.updatedAt).toLocaleString(),
              ]),
              theme: "grid",
              headStyles: { fillColor: "#3C4763", textColor: "#ffffff" },
              styles: {
                  fontSize: 10,
                  halign: "center",
                  cellPadding: 2,
              },
              margin: { top: 30 },
          });
          pdfDoc.save("orders_report.pdf");
      } catch (error) {
          console.error("Error generating PDF:", error);
      }
      }
    };

    const calculateTotalRevenue = () => {
        return Orders.reduce((total, product) => total + product.price, 0);
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
            Reports
          </h1>
          <MDBCard
            style={{ borderRadius: 0, marginTop: "40px", margin: "5px" }}
            id="card"
          >
            <h4
              id="cardhead"
              style={{ textAlign: "left", padding: "15px", fontWeight: "bold" }}
            >
              Generate Reports
            </h4>
            <form>
              <MDBCardBody style={{ textAlign: "left" }}>
                <Form.Group className="mb-3">
                  <select
                    className="form-control form-control-lg"
                    id="card" 
                    style={{ borderRadius: 0, color: "black" }}
                    value={selectedItem}
                    onChange={(e)=>{setSelectedItem(e.target.value)}}
                  >
                    <option
                      value=""
                      selected
                      style={{ color: "#6f6f70" }}
                    >
                      Select Report
                    </option>
                      <option value="inventory">Inventory Report</option>
                      <option value="orders">Orders Report</option>
                  </select>
                  <span id="location-error"></span>
                </Form.Group>
                <MDBBtn
                  type="submit"
                  style={{
                    width: "100%",
                    borderRadius: 0,
                    backgroundColor: success ? "green" : "",
                    color: success ? "white" : "",
                  }}
                  onClick={generatePDF}
                  className="btnsc"
                >
                    <span>Generate Report</span>
                </MDBBtn>
              </MDBCardBody>
            </form>
          </MDBCard>
        </div>
      </div>
    </div>
  );
}
