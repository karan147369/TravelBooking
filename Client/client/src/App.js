import logo from './logo.svg';
import './App.css';
import Login from './login.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPage from './UserPage';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from "react-router-dom";
// import Navbar from './Navbar.js';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Homepage from './Homepage.js'
import Register from './Register';
import Footer from './Footer';
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buttonDisabled: true,
      username: "",
      password: "",
      name: "",
      validUser: false,
      validDetails: true,
      loginMessage: ""
    }
  }

  updateState = (value) => {
    this.setState({ username: value });
  }
  render() {
    return (
      <>

        {/* <Navbar></Navbar> */}
        <Router>
          <Switch>
            {/* <Redirect path='/' to='/login' /> */}
            <Route exact path="/" component={Homepage}></Route>
            <Route exact path='/login' render={(props) => <Login {...props} state={this.state} updateState={this.updateState} />}></Route>
            <Route exact path="/Register" component={Register}></Route>
            <Route exact path='/userPage' render={(props) => <UserPage {...props} username={this.state.username} updateState={() => this.updateState()} />}></Route>
            <Route path="*" ><Redirect to="/" /></Route>
          </Switch>
          <Route exact path="/(|login)" component={Footer}></Route>
        </Router>

      </>
    );
  }
}

// export default App;
