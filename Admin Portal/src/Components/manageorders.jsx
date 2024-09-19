import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import {
  MDBBtn,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import { saveLogs } from './logs';

export default function ManageOrders() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [street, setStreet] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const [id, setId] = useState("");
  const toggleShow = () => setBasicModal(!basicModal);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getData();
  }, []);


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
        setData(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        saveLogs(error.message,'/manageorders',"Admin");
      });
  }

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            Manage Orders
          </h1>
          </div>

          <div
            class="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{ borderRadius: 0, marginTop: "30px" }}
          >
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                class="uppercase"
                id="tablehead"
                style={{ padding: "10px", color: "#313a50" }}
              >
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Sr
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Buyer
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Product
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Dated
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((item,index)=>(
                  <tr class="border-b">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium whitespace-nowrap "
                  >
                    1
                  </th>
                  <td class="px-6 py-4">{item.username}</td>
                  <td class="px-6 py-4">{item.name}</td>
                  <td class="px-6 py-4">{item.quantity}
                  </td>
                  <td class="px-6 py-4">{new Date(item.dated).toLocaleString()}
                  </td>
                  <td class="px-6 py-4">{item.price} Rs
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
