import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import './Homepage.css';
import axios from 'axios';
import { cityDiscription } from "./cityDisp";

export default class Homepage extends React.Component {
    state = {
        homepageData: [],
        imgaddr: []
    }
    componentDidMount() {
        axios.get('http://localhost:4000/homepage').then((res) => {
            this.setState({ homepageData: res.data });

        }).catch((err) => {
            console.log("error in fetching homepage data : " + err.message);
        });
        let arr = ["https://q-xx.bstatic.com/xdata/images/city/400x400/684765.jpg?k=3f7d20034c13ac7686520ac1ccf1621337a1e59860abfd9cbd96f8d66b4fc138&o=",
            "https://r-xx.bstatic.com/xdata/images/city/400x400/971346.jpg?k=40eeb583a755f2835f4dcb6900cdeba2a46dc9d50e64f2aa04206f5f6fce5671&o=",
            "https://q-xx.bstatic.com/xdata/images/city/400x400/684919.jpg?k=0a73fce29109503c055e288c413d9a1c5bd66fdb26f01c1438e8017b0b64b42f&o=",
            "https://r-xx.bstatic.com/xdata/images/city/400x400/684880.jpg?k=e39b50ba8be4c6c6c413c963af6e0d452dbe0decaf72e13f9f798e65de549107&o=",
            "https://r-xx.bstatic.com/xdata/images/city/400x400/684682.jpg?k=30cf9de93f2a0f87eed7d2d0d9b3e6eccd5dcf3a4b68b4e0151c0800ddc84af7&o=",
            "https://q-xx.bstatic.com/xdata/images/city/400x400/684769.jpg?k=146b18e42b9eb74078f2e80e07e573e8dbac879208b86bae451f99882f566a99&o=",
            "https://r-xx.bstatic.com/xdata/images/city/400x400/684657.jpg?k=66dc5035b43e9bb86b756e381e4fec2558064af4a63a8af17836725a854c03ee&o=",
            "https://q-xx.bstatic.com/xdata/images/city/400x400/684769.jpg?k=146b18e42b9eb74078f2e80e07e573e8dbac879208b86bae451f99882f566a99&o="];
        this.setState({ imgaddr: arr });
        // console.log(document.getElementById(0));
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
    componentDidUpdate() {
        // text description for cards
        for (let i = 0; i < 8; i++) {
            let element = document.getElementById(i);
            let target = document.getElementById('sidebar');
            if (element !== null) {
                element.addEventListener('mouseover', () => {
                    target.style.color = 'white';
                    target.style.fontWeight = 'bolder'
                    target.innerText = cityDiscription[i];

                });

            }

        }
    }

    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
                    <div className="container-fluid">
                        <span>Travel Booking</span>
                        {/* <button className="navbar-togler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button> */}
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item offset-md-1">
                                    {/* <link className="nav-link active" aria-current="page" >Home</link> */}
                                    <Link to="/login"><button className="btn " id="button">Login</button></Link>
                                </li>
                                <li className="nav-item">
                                    {/* <link className="nav-link" >Features</link> */}
                                    <Link to="/Register"><button className="btn " id="button">Register</button></Link>
                                </li>
                                <li className="nav-item">
                                    {/* <link className="nav-link" >Pricing</link> */}
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav >
                {/*container*/}
                <div id='homepageContainer'>

                    {/*sidebar*/}
                    <div id="sidebar">
                    </div>

                    {/*Cards*/}
                    < div className="container m-5"  >
                        <div className="" id="heading"></div>
                        <div className="row">
                            {this.state.homepageData.map((i, index) => {
                                return (<>
                                    <div className="card m-2" style={{ width: "15rem", fontSize: "2rem" }} id={index}>
                                        <img src={this.state.imgaddr[index]} className="card-img-top" alt={i[0]} />
                                        <div className="card-body">
                                            <p className="card-text">{i[0]}</p>
                                        </div>
                                    </div>
                                </>
                                )
                            })}
                        </div>
                    </div >
                </div>
            </>
        )
    }
}