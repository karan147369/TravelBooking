import React from "react";
import './UserPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import moment from 'moment';

export default class UserPage extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {
        loggedIn: true,
        name: "",
        flightData: [],
        Bookings: [],
        NoBookingsMessage: true,
        isPreviousBookingEmpty: true,
        message: "",
        searchSource: "",
        sarchDestination: "",
        isSearchEmpty: false
    }
    componentDidMount() {
        let n = localStorage.getItem("name");
        let token = localStorage.getItem('token');
        if (token !== null) {
            axios.post('http://localhost:4000/verifyToken', { "token": localStorage.getItem('token') })
                .then((result) => {
                    if (result.data) {
                        this.setState({ name: result.data.name });
                        this.setState({ loggedIn: true });
                    }
                    else {
                        alert('Invalid token');
                        this.setState({ loggedIn: false })
                    }
                })
                .catch((err) => { console.log(err.message) });
        }
        else {
            this.setState({ loggedIn: false })
        }

        //get flightData and set state.
        axios.get('http://localhost:4000/flightData').then((res) => {
            this.setState({ flightData: res.data })
        }).catch((err) => {
            throw err;
        })
        // check if user already has bookings
        axios.post('http://localhost:4000/getUserBooking', { "email": localStorage.getItem('email') })
            .then((res) => {
                if (!res.data) {
                    let arr = [];
                    this.setState({ NoBookingsMessage: false })
                    this.setState({ isPreviousBookingEmpty: true });
                }
            })
            .catch((err) => { console.log(err.message) });
    }

    logout = (e) => {
        localStorage.clear();
        this.setState({ loggedIn: false });
    }
    redirectTologin = () => {
        this.props.history.push('/login');
    }

    bookFLight = async (flightId) => {
        try {
            let result = await axios.post('http://localhost:4000/userBooking', { "email": localStorage.getItem("email"), "flightId": flightId })
            if (result.data) {
                let element = document.getElementById(flightId);
                element.innerText = 'Booked Successfully';
                element.style.backgroundColor = '#e9ffce;';

                let response = await axios.post('http://localhost:4000/updateTickets', { "flightId": flightId, "ticketCount": -1 });
                if (response.data.type === 'success') {
                    let res = await axios.get('http://localhost:4000/flightData');
                    this.setState({ flightData: res.data });
                }
                else {
                    alert('No more tickets left')
                }


            }
            else {
                let element = document.getElementById(flightId);
                element.innerText = 'Already Booked';
                element.style.color = 'red';
                element.style.border = '1px solid red';
                element.style.backgroundColor = 'white';

                setTimeout(() => { element.innerText = 'Book Flight'; element.style.color = ''; element.style.border = '' }, 600)
            }
        }
        catch (error) {
            console.log(error.message)

        }


    }
    showBooking = () => {
        this.getBookingData();
        this.setState({ showBooking: !this.state.showBooking })

    }
    getBookingData = async () => {
        let result = await axios.post('http://localhost:4000/getuserBooking', { "email": localStorage.getItem("email") });
        axios.get('http://localhost:4000/flightData').then((getFlightdata) => {
            let arr = [];
            for (let i of result.data) {
                for (let j of getFlightdata.data) {
                    if (i.flightId === j.flightId) {
                        arr.push(j);
                    }
                }
            }
            if (result && getFlightdata) {
                this.setState({ NoBookingsMessage: true })
                this.setState({ Bookings: arr })
                this.setState({ isPreviousBookingEmpty: false })
            }
            else {
                this.setState({ isPreviousBookingEmpty: true })
            }
        }).catch();



    }
    cancelBooking = (e) => {
        const response = window.confirm("Are you sure you want to do that?");
        if (response) {
            axios.post('http://localhost:4000/cancelBooking', { "flightId": e.target.id, "email": localStorage.getItem("email") }).then((res) => {
                if (res.data) {
                    let arr = [];
                    for (let i of this.state.Bookings) {
                        if (i.flightId != e.target.id) {
                            arr.push(i)
                        }
                    }
                    this.setState({ Bookings: arr })
                    if (arr.length === 0) {
                        this.setState({ NoBookingsMessage: false })
                    }
                    // add back to flight data
                    axios.post('http://localhost:4000/updateTickets', { "flightId": e.target.id, "ticketCount": 1 })
                        .then((res) => {
                            //update flight data array to update no of tickets on screen
                            if (res.data.type === 'success') {
                                axios.get('http://localhost:4000/flightData')
                                    .then((resp) => {
                                        this.setState({ flightData: resp.data });
                                    })
                                    .catch((err) => { console.log(err.message) });
                            }
                        })
                        .catch((err) => { console.log(err.message) });

                }
            }).catch()
        }

    }

    showBookingTable = () => {
        return (
            <>
                {!this.state.NoBookingsMessage ?
                    <></>
                    :
                    <table className="border" id='table'>
                        <tr className="border">
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                        {this.state.Bookings.map((i) => {
                            return (
                                <tr className="m-5 border" >
                                    <td >{i.source}</td>
                                    <td>{i.destination}</td>
                                    <td>{moment(i.time).format('hh:mm DD-MM-YYYY')}</td>

                                    <td><button className="btn btn-primary btn-sm" id={i.flightId} onClick={(e) => { this.cancelBooking(e) }}>Cancel</button></td>

                                    <td></td>
                                </tr>
                            )

                        })}
                    </table>
                }
            </>
        )

    }
    search = () => {
        // console.log(this.state.searchSource + " " + this.state.sarchDestination)
        if (this.state.searchSource === '' && this.state.sarchDestination === '') {
            axios.post('http://localhost:4000/search', { "source": "undefined", "destination": "undefined" }).then((res) => {

                this.setState({ flightData: res.data })
                this.setState({ searchSource: "" })
                this.setState({ sarchDestination: "" })
                document.getElementById('source').value = '';
                document.getElementById('destination').value = '';
                if (res.data.length === 0) {
                    this.setState({ isSearchEmpty: true })
                }
                else {
                    this.setState({ isSearchEmpty: false })
                }

            }).catch((err) => {
                throw err;
            })
        }
        else if (this.state.sarchDestination === '') {
            axios.post('http://localhost:4000/search', { "source": this.state.searchSource, "destination": "undefined" }).then((res) => {
                console.log(res.data);
                this.setState({ flightData: res.data })
                this.setState({ searchSource: "" })
                this.setState({ sarchDestination: "" })
                document.getElementById('source').value = '';
                document.getElementById('destination').value = '';
                // console.log(res.data.length == 0)
                if (res.data.length === 0) {
                    this.setState({ isSearchEmpty: true })
                }
                else {
                    this.setState({ isSearchEmpty: false })
                }
            }).catch()
        }
        else if (this.state.searchSource === '') {
            axios.post('http://localhost:4000/search', { "source": "undefined", "destination": this.state.sarchDestination }).then((res) => {
                console.log(res.data);
                this.setState({ flightData: res.data })
                this.setState({ searchSource: "" })
                this.setState({ sarchDestination: "" })
                document.getElementById('source').value = '';
                document.getElementById('destination').value = '';
                // console.log(res.data.length == 0)
                if (res.data.length === 0) {
                    this.setState({ isSearchEmpty: true })
                }
                else {
                    this.setState({ isSearchEmpty: false })
                }
            }).catch()
        }
        else {
            axios.post('http://localhost:4000/search', { "source": this.state.searchSource, "destination": this.state.sarchDestination }).then((res) => {
                this.setState({ flightData: res.data })
                this.setState({ searchSource: "" })
                this.setState({ sarchDestination: "" })
                document.getElementById('source').value = '';
                document.getElementById('destination').value = '';
                if (res.data.length === 0) {
                    this.setState({ isSearchEmpty: true })
                }
                else {
                    this.setState({ isSearchEmpty: false })
                }
            }).catch()
        }
    }
    toUpper = (str) => {
        if (str.length > 0)
            return str[0].toUpperCase() + str.substring(1);
        else return '';
    }
    Setsearch = () => {

        let source = this.toUpper(document.getElementById('source').value);
        let dest = this.toUpper(document.getElementById('destination').value);
        if (source != '') {
            this.setState({ searchSource: source })
        }
        if (dest != '') {
            this.setState({ sarchDestination: dest })
        }
    }

    render() {
        return <>
            {/* navbar */}
            <div>
                <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
                    <div className="container-fluid ">
                        <div class="d-flex justify-content-start">  <span>Travel Booking</span></div>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                            <ul className="navbar-nav ">
                                <li className="nav-item offset-md-1">
                                    <button className="btn btn-danger" onClick={() => { this.logout() }} id="logoutButton">Logout</button>
                                </li>
                                <li className="nav-item">
                                    {/* <link className="nav-link" >Features</link> */}
                                    <button className="btn btn-secondary" id='previousbooking' onClick={() => { this.showBooking() }}>{this.state.showBooking ? "Go Back" : "View Previous Bookings"}</button>
                                </li>
                                <li className="nav-item">
                                    {/* <link className="nav-link" >Pricing</link> */}
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>

                {/*Body*/}
                {this.state.loggedIn ?
                    <div className="col-md-12" id="intro">
                        <span className="" id="intro_name">
                            {this.state.isSearchEmpty ?
                                <>No Flight Available</>
                                :
                                <>Welcome Back! &nbsp;
                                    {this.state.name}
                                </>
                            }

                        </span>

                    </div> :
                    this.redirectTologin()
                }
                {!this.state.showBooking ?
                    <div className="container">
                        <div className="row ">
                            <div className="row col-md-12">
                                <div id="searchBar" className="p-2 input-group input-group-sm col-md-4">
                                    <input type="search" placeholder="Source" className="form-control" id="source" onChange={() => { this.Setsearch() }}></input>
                                    <input type="destination" placeholder="Destination" className="form-control" id="destination" onChange={() => { this.Setsearch() }} ></input>
                                    {/* <input type="button"></input> */}
                                    <input type="button" value="Search" className="btn btn-primary btn-sm input-group-append" onClick={() => this.search()}></input >
                                </div>
                            </div>

                            {this.state.flightData.map((i, index) => {
                                return <>
                                    <div className="card m-4" style={{ width: "18rem" }}>
                                        <div className="card-body">
                                            <table className="p-2">
                                                <tr>
                                                    <td>Source:</td>
                                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                    <td className="field">{i.source}</td>
                                                </tr>
                                                <tr>
                                                    <td>Destination:</td>
                                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                    <td className="field">{i.destination}</td>
                                                </tr>
                                                <tr>
                                                    <td>Price:</td>
                                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                    <td className="field">&#8377;{i.price}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3} className="field">{moment((i.time)).format("DD-MM-YYYY")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{moment((i.time)).format("hh:mm")}</td>
                                                </tr>
                                                <td colSpan={3} className="field">Tickets left:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{i.tickets > 0 ? i.tickets : "No Tickets Available"}</td>
                                                <tr>
                                                    <td colSpan={3}>

                                                        <button className="btn btn-outline-success" onClick={() => this.bookFLight(i.flightId)} id={i.flightId}><span >Book Flight</span>
                                                        </button>


                                                    </td>
                                                </tr>


                                            </table>
                                        </div>
                                    </div>
                                </>
                            })}
                        </div>
                    </div>
                    : <>
                        {this.state.NoBookingsMessage ? null : <div><span id="bookingMessage">No bookings to show</span></div>}
                        {this.state.isPreviousBookingEmpty ? null : this.showBookingTable()}
                    </>

                }
                {/* {this.state.Nobooking ? alert('No Bookings Available') :
                    null
                } */}


            </div>
        </>
    }
}