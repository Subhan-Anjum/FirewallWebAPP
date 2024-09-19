import './App.css';
import { useEffect } from 'react';
import {Switch,Route} from 'react-router-dom';
import Login from './Components/login';
import Home from './Components/home';
import Inventory from './Components/inventory';
import Reports from './Components/reports';
import Manageusers from './Components/manageusers';
import Myaccount from './Components/myaccount';
import ManageOrders from './Components/manageorders';
import Brands from './Components/brands';
import Error from './Components/error';
import CustomerSupport from './Components/customerSupport';
import PrivateRoute from './Components/private';
import GeneratePDF from './Components/new';

function App() {
  useEffect(()=>{
    document.body.style.overflowX="hidden";
  },[])
  return (
    <div className="App">
     <Switch>
      <Route exact path="/" component={Login}/>
      <PrivateRoute path="/manage-orders" component={ManageOrders}/>
      <PrivateRoute path="/dashboard" component={Home}/>
      <PrivateRoute path="/inventory" component={Inventory}/>
      <PrivateRoute path="/brands" component={Brands}/>
      <PrivateRoute path="/reports" component={Reports}/>
      <PrivateRoute path="/manage-users" component={Manageusers}/>
      <PrivateRoute path="/my-accounts" component={Myaccount}/>
      <PrivateRoute path="/customer-support" component={CustomerSupport}/>
      <PrivateRoute path="/generate" component={GeneratePDF}/>
      <Route path="/404" component={Error}/>
     </Switch>
    </div>
  );
}

export default App;
