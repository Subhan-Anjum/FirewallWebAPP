import React, { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Generatereportspage = () => {
    const [Orders, setOrders] = useState([]);
    const [selectedItem, setSelectedItem] = useState("Select an item");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:4000/getAllOrders`);
                const data = await response.json();
                setOrders(data.data);
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
    };

    const calculateTotalRevenue = () => {
        return Orders.reduce((total, product) => total + product.price, 0);
    };

    return (
        <>
        <div>
            <div style={{ width: "100%", display: "flex" }}>
                <div style={{ width: "10%" }}></div>
                <div style={{ width: "80%" }}>
                    <div style={{ margin: "35px" }}>
                        <h3 style={{ marginTop: "25px" }}>Analytical Reports</h3>
                        <div style={{ marginTop: "25px" }}>
                            <InputGroup>
                                <FormControl
                                    as="select"
                                    value={selectedItem}
                                    onChange={handleSelect}
                                >
                                    <option>Orders Report</option>
                                </FormControl>
                            </InputGroup>

                            <Button
                                variant="primary"
                                type="button"
                                className="mt-3"
                                onClick={generatePDF}
                            >
                                Download Report
                            </Button>
                        </div>

                        {/* Display the PDF content */}
                        <div style={{ marginTop: "20px" }}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product Buyer</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Dated</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Orders.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.username}</td>
                                            <td>{product.name}</td>
                                            <td>{product.quantity}</td>
                                            <td>{new Date(product.dated).toLocaleString()}</td>
                                            <td>{product.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ width: "10%" }}></div>
        </div>
        </>
    );
};

export default Generatereportspage;