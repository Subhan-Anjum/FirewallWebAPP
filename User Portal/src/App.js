import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './Components/home';
import Product from './Components/product';
import Cart from './Components/cart';
import OrderHistory from './Components/orderhistory';
import Support from './Components/support';
import Register from './Components/register';
import Login from './Components/login';
import Verification from './Components/verification';
import ReviewData from './Components/product';
import Profile from './Components/profile';
import Search from './Components/search';
import Success from './Components/success';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/product" component={Product} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/ordershistory" component={OrderHistory} />
        <Route exact path="/support" component={Support} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/verification" component={Verification} />
        <Route exact path="/productdetails" component={ReviewData} />
        <Route exact path="/success" component={Success} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </div>
  );
}

export default App;
