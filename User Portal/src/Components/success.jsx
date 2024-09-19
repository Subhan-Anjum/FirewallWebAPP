import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function Success() {
  return (
    <div className="text-center" style={{ height: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center h-100">
        <MDBCard>
          <MDBCardBody>
            <center><img src="https://cdn-icons-png.flaticon.com/512/148/148767.png" alt="" style={{width:"70px"}}/></center>
            <MDBCardTitle style={{marginTop:"20px"}}>Payment Recieved</MDBCardTitle>
            <MDBCardText>
              Thanks for buying. Your payment has been recieved.
            </MDBCardText>
            <MDBBtn onClick={()=>{window.location.href='/'}}>Back to Home</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </div>
    </div>
  );
}
