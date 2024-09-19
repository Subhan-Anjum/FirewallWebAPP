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

export default function Inventory() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [inventory,setInventory]=useState([]);

  // update Product
  const [id, setId] = useState("");
  const [showUpdate,setshowUpdate]=useState("");
  const [Uname,setUName]=useState("");
  const [Ubrand,setUbrand]=useState("");
  const [Uprice,setUprice]=useState("");
  const [Ustock,setUstock]=useState("");
  const [Udescription,setUdescription]=useState("");

  const toggleShow = () => setBasicModal(!basicModal);
  const toogleUpdate = () => setshowUpdate(!showUpdate);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getInventory();
    getBrands();
  }, []);


  async function getBrands() {
    await fetch(`http://localhost:4000/getBrands`, {
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
        setData(data.data.filter((item)=>item.Active==1));
      })
      .catch((error) => {
        console.error("Error:", error);
        saveLogs(error.message,'/manageinventory',"Admin");
      });
  }

  async function getInventory() {
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
        console.log(data.data);
        setInventory(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        saveLogs(error.message,'/manageinventory',"Admin");
      });
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await fetch(`http://localhost:4000/deleteInventory?id=${id}`, {
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
          if (data.message == "deleted") {
            getInventory();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          saveLogs(error.message,'/manageinventory',"Admin");
        });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);

    try {
      const response = await axios.post('http://localhost:4000/addInventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });

      form.reset();
      getInventory();
      setSubmit(false);
      setBasicModal(false);
    } catch (error) {
      console.error('Error:', error.message);
      setSubmit(false);
      saveLogs(error.message,'/manageinventory',"Admin");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const formData = new FormData(form);

    const data = {
      name: Uname,
      image: formData.get('image'), 
      brand: Ubrand,
      price: Uprice,
      stock: Ustock,
      description: Udescription,
    };  


    try {
      const response = await axios.post(`http://localhost:4000/updateInventory?id=${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });

      console.log('Response:', response.data);
      form.reset();
      getInventory();
      setSubmit(false);
      setshowUpdate(false);
    } catch (error) {
      console.error('Error:', error.message);
      setSubmit(false);
      saveLogs(error.message,'/manageinventory',"Admin");
    }
  };

  async function handleSwitchChange (active,Id) {
    let Data={};
    if(active==1){
      Data={
        status:false,
        id:Id,
      };
    }
    else{
      Data={
        status:true,
        id:Id,
      }
    }
    try {
      const response = await fetch(
        `http://localhost:4000/changeStatusInventory`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json", 
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(Data),
        }
      );

      if (!response.ok) {
        throw new Error('Request failed.');
      }

      const data = await response.json();

      if (data.message === 'updated') {
        getInventory();
      }
    } catch (error) {
      console.error('Error:', error);
      saveLogs(error.message,'/manageinventory',"Admin");
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
            Inventory
          </h1>
          <MDBBtn style={{height:"50px",marginTop:"3%",backgroundColor:'#e8eaf1',color:"#313a50",borderRadius:"0"}} onClick={()=>{setBasicModal(true)}}>Add Product</MDBBtn>
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
                    Image
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Product Name
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Brand
                  </th>
                  <th scope="col" class="px-6 py-3">
                    price
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Stock
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Details
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Action
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Updated At
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Edit
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {inventory.map((item,index)=>(
                  <tr class="border-b">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium whitespace-nowrap "
                  >
                    {index+1}
                  </th>
                  <td class="px-6 py-4"><img src={`http://localhost:4000/images/${item.image}`} alt="" style={{width:"130px",height:"90px"}}/></td>
                  <td class="px-6 py-4">{item.name}</td>
                  <td class="px-6 py-4">{item.brandName}
                  </td>
                  <td class="px-6 py-4">{item.price}
                  </td>
                  <td class="px-6 py-4">{item.stock} {item.stock<=10? <i class="fas fa-exclamation-triangle" style={{marginLeft:"5px",color:"red"}}></i>:""}
                  </td>
                  {item.description.length<100?(
                    <td class="px-6 py-4">{item.description.substring(0,100)}
                  </td>
                  ):(
                    <td class="px-6 py-4">{item.description.substring(0,100)}...
                  </td>
                  )}
                  <td class="px-6 py-4">{item.Active==1?"Active":"Inactive"}
                  </td>
                  <td class="px-6 py-4">
                  <MDBSwitch
                    checked={item.Active === 1}
                    onChange={() => handleSwitchChange(item.Active, item.Id)}
                    style={{
                      backgroundColor: item.status === 1 ? 'white' : 'lightgrey',
                      borderColor: item.status === 1 ? 'white' : 'lightgrey',
                      color: item.status === 1 ? 'black' : 'white',
                    }}
                  />
                  </td>
                  <td class="px-6 py-4">{new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td class="px-6 py-4">{new Date(item.updatedAt).toLocaleString()}
                  </td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={()=>{
                        setshowUpdate(true);
                        setUName(item.name);
                        setUbrand(item.brandName);
                        setUprice(item.price);
                        setUstock(item.stock);
                        setUdescription(item.description);
                        setId(item.Id);
                      }}
                    >
                      <i
                        className="fa fa-edit"
                        style={{ color: "green" }}
                      ></i>
                    </a>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={()=>{handleDelete(item.Id)}}
                    >
                      <i className="fa fa-trash" style={{ color: "red" }}></i>
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
              <MDBModalTitle>Add Product</MDBModalTitle>
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
                    Name
                  </p>
                  <Form.Control
                    type="text"
                    placeholder="Pent Shirt"
                    size="lg"
                    name="name"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Image
                  </p>
                  <Form.Control
                    type="file"
                    size="lg"
                    id="card"
                    name="image"
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Brand
                  </p>
                  <select class="form-select" aria-label="Default select example" id="card" name="brand" style={{color:'black'}}>
                    <option selected>Choose Brand</option>
                    {data.map((item,index)=>(
                      <option value={item.brandName} style={{color:"white"}}>{item.brandName}</option>
                    ))}
                </select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Price (Rs)
                  </p>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="5600"
                    size="lg"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Stock
                  </p>
                  <Form.Control
                    type="number"
                    placeholder="40"
                    size="lg"
                    id="card"
                    name="stock"
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Description
                  </p>
                  <Form.Control
                      as="textarea"
                      placeholder="Write something"
                      rows={3} 
                      size="lg"
                      id="card"
                      name="description"
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
                    <span>Add</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal show={showUpdate} setShow={setshowUpdate} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Update Product</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toogleUpdate}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdate} encType="multipart/form-data" id="inventoryform">
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Name
                  </p>
                  <Form.Control
                    type="text"
                    placeholder="Pent Shirt"
                    size="lg"
                    name="name"
                    id="card"
                    value={Uname}
                    onChange={(e)=>{setUName(e.target.value)}}
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Image
                  </p>
                  <Form.Control
                    type="file"
                    size="lg"
                    id="card"
                    name="image"
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Brand
                  </p>
                  <select class="form-select" aria-label="Default select example" id="card" name="brand" style={{color:"black"}}
                    value={Ubrand}
                    onChange={(e)=>{setUbrand(e.target.value)}}>
                    <option selected>Choose Brand</option>
                    {data.map((item,index)=>(
                      <option value={item.brandName} style={{color:"white"}}>{item.brandName}</option>
                    ))}
                </select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Price (Rs)
                  </p>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="5600"
                    size="lg"
                    id="card"
                    value={Uprice}
                    onChange={(e)=>{setUprice(e.target.value)}}
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Stock
                  </p>
                  <Form.Control
                    type="number"
                    placeholder="40"
                    size="lg"
                    id="card"
                    name="stock"
                    value={Ustock}
                    onChange={(e)=>{setUstock(e.target.value)}}
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Description
                  </p>
                  <Form.Control
                      as="textarea"
                      placeholder="Write something"
                      rows={3} 
                      size="lg"
                      id="card"
                      name="description"
                      value={Udescription}
                      onChange={(e)=>{setUdescription(e.target.value)}}
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
                    <span>Update</span>
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
