import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import './Register.css';
import axios from 'axios';

function debounce(callback, delay = 1500) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => { callback(...args) }, delay);
    }
}
export default class Register extends React.Component {

    state = {
        email: "",
        password: "",
        validPassword: false,
        username: "",
        name: "",
        validUsername: false,
        usernameMessage: "",
        emailMessage: "",
        validEmail: false,
        passwordMatch: false,
        passwordMessage: "",
        confirmPasswordMessage: "",
        userAdded: false,
        registerMessage: "",
        nameMessage: "",
        validName: false

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
    callDebounceemail = debounce(async (e) => {
        let result = await axios.post("http://localhost:4000/verifyEmail", { "email": e.target.value });
        let regex = /^[a-z A-Z 0-9]{1,}[@][a-z]{1,}(.com|.in)$/
        if (!regex.test(e.target.value)) {
            this.setState({ emailMessage: "Enter valid Email." })
            this.setState({ validEmail: false })
        }
        else if (result.data) {
            this.setState({ emailMessage: "Email Already Exists." })
            this.setState({ validEmail: false })
        }
        else {
            this.setState({ emailMessage: "" })
            this.setState({ validEmail: true })
        }

    });
    verifyEmail = async (e) => {
        this.setState({ email: e.target.value })
        this.callDebounceemail(e);

    }
    callDebounceuser = debounce(async (e) => {
        let result = await axios.get(`http://localhost:4000/getusername?username=${e.target.value}`);
        console.log(result);
        if (result.data) {
            if (e.target.value.length <= 3) {
                this.setState({ validUsername: false })
                this.setState({ usernameMessage: "Username must be atlest four characters." })
            }
            else {
                this.setState({ validUsername: true })
                this.setState({ usernameMessage: "" })
            }
        }
        else {
            this.setState({ validUsername: false })
            this.setState({ usernameMessage: "Username Already exists." })
        }
    })

    verifyUsername = (e) => {
        this.setState({ username: e.target.value })
        this.callDebounceuser(e);
    }
    verifyPassword = (e) => {
        if (e.target.id === 'password') {
            this.setState({ password: e.target.value })
            let checkUpper = /[A-Z]{1,}/
            let checkLower = /[1-z]{1,}/
            let checkNum = /[0-9]{1,}/
            let checkSp = /[!@#$%^&*]{1,}/
            if (e.target.value.length >= 8 && checkLower.test(e.target.value) && checkUpper.test(e.target.value) && checkNum.test(e.target.value) && checkSp.test(e.target.value)) {
                this.setState({ validPassword: true });
                this.setState({ passwordMessage: "" });
            }
            else {
                this.setState({ validPassword: false });
                this.setState({ passwordMessage: "Password must 8 characters long and must contain atleast one uppercase, lowercase, number and special character." })
            }
        }
        if (e.target.id == 'confirmpassword') {
            if (e.target.value === this.state.password) {
                this.setState({ confirmPasswordMessage: "" })
                this.setState({ passwordMatch: true })

            }
            else {
                this.setState({ confirmPasswordMessage: "Password doesn't match!" })
                this.setState({ passwordMatch: false })

            }
            // console.log(e.target.value + " " + this.state.password)
        }


    }
    verifyname = (e) => {
        this.setState({ name: e.target.value })
        if (e.target.value.length < 3) {
            this.setState({ validName: false })
            this.setState({ nameMessage: "Name should have atleast three characters" })
        }
        else {
            this.setState({ validName: true })
            this.setState({ nameMessage: "" })
        }
    }
    registerUser = async () => {
        // console.log({ "username": this.state.username, "name": this.state.name, "password": this.state.password, "email": this.state.email })
        let result = await axios.post('http://localhost:4000/register', { "username": this.state.username, "name": this.state.name, "password": this.state.password, "email": this.state.email })
        if (result) {
            this.setState({ userAdded: true })
            this.setState({ registerMessage: "You are registered successfully" })
            //localStorage.setItem('name', this.state.name);
            this.props.history.push('/login');
        }
        else {
            this.setState({ userAdded: false });
            this.setState({ registerMessage: "Something Went Wrong!!" });
        }
    }
    render() {
        return (<><body>
            {/*Navbar*/}
            <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
                <div className="container-fluid">
                    <Link to='/homepage'><span id='logo' style={{ color: 'black' }}>Travel Booking</span></Link>
                </div>
            </nav >

            {/*BODY*/}

            <img src='https://img.freepik.com/free-photo/selective-focus-miniature-tourist-compass-map-with-plastic-toy-airplane-abstract-background-travel-concept_1423-180.jpg' id='backgroundImageReg'></img>
            <p id='signup'>Sign Up</p>
            <div className=' bg-dark-subtle pl-5' id="container">
                <form className='col-md-4 offset-md-1' id='formReg'>
                    <div className="mb-2">
                        <label htmlFor="name" className="form-label text-primary"></label>
                        <input type="text" className="form-control" id="name" placeholder="Name" aria-describedby="usernamehelp" onChange={(e) => { this.verifyname(e) }} />
                        <div className="text-danger">{this.state.nameMessage}</div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="username" className="form-label text-primary"></label>
                        <input type="text" className="form-control" id="username" placeholder="UserName" aria-describedby="usernamehelp" onChange={(e) => { this.verifyUsername(e) }} />
                        <div className="text-danger">{this.state.usernameMessage}</div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label text-primary"></label>
                        <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => { this.verifyEmail(e) }} />
                        <div className="text-danger">{this.state.emailMessage}</div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="exampleInputPassword1" className="form-label"></label>
                        <input type="password" placeholder="Password" className="form-control" id="password" onChange={(e) => { this.verifyPassword(e) }} />
                        <div className="text-danger">{this.state.passwordMessage}</div>

                    </div>
                    <div className="mb-2">
                        <label htmlFor="exampleInputPassword1" className="form-label"></label>
                        <input type="password" placeholder="Confirm Password" className="form-control" id="confirmpassword" onChange={(e) => { this.verifyPassword(e) }} />
                        <div className="text-danger">{this.state.confirmPasswordMessage}</div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="message" className="form-label"></label>
                        <button type="button" className="btn btn-primary" disabled={!(this.state.validEmail && this.state.validPassword && this.state.validUsername && this.state.passwordMatch && this.state.validName)} onClick={() => { this.registerUser() }}>Sign Up</button>
                    </div>
                    {this.state.userAdded ?
                        <div className='text-success form-control'>{this.state.registerMessage}</div>
                        :
                        <div className='text-danger'>{this.state.registerMessage}</div>
                    }
                </form>
            </div>
        </body>

        </>)
    }
}