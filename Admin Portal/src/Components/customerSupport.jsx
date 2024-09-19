import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
  MDBSwitch
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import axios from 'axios';
import { saveLogs } from './logs';

export default function CustomerSupport() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);

  // update Product
  const [id, setId] = useState("");
  const [subject,setSubject]=useState("");
  const [email,setEmail]=useState("");
  const [reply,setReply]=useState("");

  const toggleShow = () => setBasicModal(!basicModal);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getSupport();
  }, []);


  async function getSupport() {
    await fetch(`http://localhost:4000/getSupport`, {
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
        saveLogs(error.message,'/customersupport',"Admin");
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    const Data={
        id:id,
        subject:subject,
        reply:reply,
        email:email,
    }

    try {
      const response = await axios.post('http://localhost:4000/reply', Data, {
        headers: {
        "Content-Type": "application/json", 
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });

      setEmail("");
      setSubject("");
      setReply("");
      setId("");
      setSubmit(false);
      setBasicModal(false);
      getSupport();
    } catch (error) {
      console.error('Error:', error.message);
      setSubmit(false);
      saveLogs(error.message,'/customersupport',"Admin");
    }
  };

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
            Customer Support
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
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3">
                   Subject
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Message
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Dated
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Reply
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
                    {index+1}
                  </th>
                  <td class="px-6 py-4">{item.email}</td>
                  <td class="px-6 py-4">{item.subject}
                  </td>
                  <td class="px-6 py-4">{item.body}
                  </td>
                  <td class="px-6 py-4">{new Date(item.dated).toLocaleString()}
                  </td>
                  <td class="px-6 py-4">{item.replied==1?"Replied":"Not Replied"}
                  </td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={()=>{
                        setBasicModal(true);
                        setEmail(item.email);
                        setSubject(`Reply: ${item.subject}`);
                        setId(item.Id);
                    }}
                    >
                      <i className="fa fa-reply" style={{ color: "white" }}></i>
                    </a>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Reply to Customer</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleSubmit} encType="multipart/form-data" id="inventoryform">
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Reply
                  </p>
                  <Form.Control
                      as="textarea"
                      placeholder="Write something"
                      rows={3} 
                      size="lg"
                      id="card"
                      name="reply"
                      value={reply}
                      onChange={(e)=>setReply(e.target.value)}
                      required
                      style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btnsc"
                  style={{ borderRadius: 0 }}
                >
                  {submit ? (
                    <MDBSpinner color="info" />
                  ) : (
                    <span>Send</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
