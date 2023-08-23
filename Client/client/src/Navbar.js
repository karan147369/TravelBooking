import React from "react";
import './Navbar.css';
import { Link } from "react-router-dom/cjs/react-router-dom";
export default class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
                <div className="container-fluid">
                    <span>Travel Booking</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {/* <link className="nav-link active" aria-current="page" >Home</link> */}
                                <Link to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                {/* <link className="nav-link" >Features</link> */}
                            </li>
                            <li className="nav-item">
                                {/* <link className="nav-link" >Pricing</link> */}
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </nav>
        )
 
    }         
    }