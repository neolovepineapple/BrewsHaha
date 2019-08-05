import React from 'react';
import ReactDOM from 'react-dom';
import "gestalt/dist/gestalt.css";

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import App from './components/App';
import Navbar from './components/Navbar'
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Brews from "./components/Brews";

import Checkout from "./components/Checkout";

import registerServiceWorker from './registerServiceWorker';



const Root = ()=>(
    <Router>
        <React.Fragment>
        <Navbar />
        <Switch>
            <Route component={App} exact path="/" />
            <Route component={Signin} path="/signin" />
            <Route component={Signup} path="/signup" />
            <Route component={Checkout} path="/checkout" />
            <Route component={Brews} path="/:brandId"/>
        </Switch>
        </React.Fragment>
    </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
