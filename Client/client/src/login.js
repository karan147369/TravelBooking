import React from 'react';
import './login.css';
import axios from 'axios';
import { Link } from "react-router-dom/cjs/react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state,
            userValidated: false,
            OtpSent: 0,
            OtpUser: 0,
            buttonDisabled: true,
            passwordMessage: "",
            otpMessage: "",
            email: ""

        }
    }
    componentDidMount() {
        //verify token
        if (localStorage.getItem('token') !== null) {
            axios.post('http://localhost:4000/verifyToken', { "token": localStorage.getItem('token') })
                .then((result) => {
                    if (result.data) {
                        this.props.history.push('/userPage');
                    }
                    else {
                        alert('Invalid token');
                    }
                })
                .catch((err) => { console.log(err.message) });
        }
    }
    twoFactorAuth = () => {

        return <>

            <div id="otpfield">
                <form className='col-md-4 m-auto' id='otpform'>
                    <div className="mb-3">
                        <label htmlFor="otp" className="form-label"></label>
                        <input type="number" placeholder="Enter OTP" className="form-control" id="otp" onChange={(e) => { this.getValues(e) }} />
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary" onClick={() => { this.validateOtp() }}>Validate</button>
                    </div>
                    <div className='text-danger'>
                        {this.state.otpMessage}
                    </div>
                </form>
            </div>
        </>

    }
    validateOtp = async () => {
        if (this.state.OtpUser == this.state.OtpSent) {
            this.setState({ otpMessage: "" });
            const token = await axios.post('http://localhost:4000/getToken', { "email": this.state.email, "name": this.state.name });
            localStorage.setItem('token', token.data.token);
            localStorage.setItem("name", this.state.name);
            localStorage.setItem("email", this.state.email);
            this.props.history.push('/UserPage');
        }
        else {
            this.setState({ otpMessage: "Incorrect OTP!" })
        }
    }
    getValues = (e) => {
        if (e.target.id === 'username') {
            this.setState({ username: e.target.value })
            this.props.updateState(e.target.value);
        }
        if (e.target.id === 'password') {
            this.setState({ password: e.target.value })
            let checkUpper = /[A-Z]{1,}/
            let checkLower = /[1-z]{1,}/
            let checkNum = /[0-9]{1,}/
            let checkSp = /[!@#$%^&*]{1,}/
            if (e.target.value.length >= 8 && checkLower.test(e.target.value) && checkUpper.test(e.target.value) && checkNum.test(e.target.value) && checkSp.test(e.target.value)) {
                this.setState({ buttonDisabled: false });
                this.setState({ passwordMessage: "" })
            }
            else {
                this.setState({ buttonDisabled: true });
                this.setState({ passwordMessage: "Password must 8 characters long and must contain atleast one uppercase, lowercase, number and special character." })
            }
        }
        if (e.target.id === 'otp') {
            this.setState({ OtpUser: e.target.value })
        }
    }
    getOtp = async () => {
        this.setState({ userValidated: true })
        let otp = await axios.get('http://localhost:4000/verifyOtp');
        // console.log("otp: " + otp.data.otp.pin)
        this.setState({ OtpSent: otp.data.otp.pin })


    }
    validateUser = async () => {

        let res = await axios.post('http://localhost:4000/login', { "username": this.state.username, "password": this.state.password })
        if (res.data.username != null) {
            this.setState({ validUser: true, validDetails: true, name: res.data.name });
            this.setState({ email: res.data.email })
            this.getOtp();

        }
        else {
            this.setState({ validDetails: false });

            this.setState({ loginMessage: "Invalid Combination" })
        }

    }

    render() {
        return (<><body>
            {/*Navbar*/}
            <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
                <div className="container-fluid">
                    <Link to='/homepage'><span id='logo' style={{ color: 'black' }}>Travel Booking</span></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item ml-5 mr-5">
                                {/* <link className="nav-link active" aria-current="page" >Home</link> */}

                            </li>

                            {/* <link className="nav-link" >Features</link> */}



                        </ul>
                    </div>
                </div>
            </nav>

            {/*Main content*/}

            <div className=' bg-dark-subtle pl-5' id="Logincontainer">
                {this.state.userValidated ? this.twoFactorAuth() :
                    <>
                        <p id='loginParagraph'>Login</p>
                        <img id='backgroundImage' src='https://img.freepik.com/free-vector/online-app-tourism-traveler-with-mobile-phone-passport-booking-buying-plane-ticket_74855-10966.jpg'></img>

                        <form className='col-md-4 offset-md-1' id='form'>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label text-primary"></label>
                                <input type="text" className="form-control" id="username" placeholder="UserName" aria-describedby="usernamehelp" onChange={(e) => { this.getValues(e) }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label"></label>
                                <input type="password" placeholder="Password" className="form-control" id="password" onChange={(e) => { this.getValues(e) }} />
                                {<div className='text-danger'>{this.state.passwordMessage}</div>}
                            </div>

                            <button type="button" className="btn btn-primary" disabled={this.state.buttonDisabled} onClick={() => { this.validateUser() }}>Login</button>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label"></label>
                                {!this.state.validDetails ? <p className='text-danger'>{this.state.loginMessage}</p> : null}
                            </div>
                        </form>
                    </>
                }

            </div></body></>)
    }
}