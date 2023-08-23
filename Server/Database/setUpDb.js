const collection = require('../login/utilities/connection');
const path = require('path')
const setUpObj = {}
const allocateDb = [{
    "username": "karan123",
    "password": "Karan@123",
    "name": "karan",
    "email": "karan147369@gmail.com",
    "pin": 0
}, {
    "username": "karan1234",
    "password": "123",
    "name": "karan1",
    "email": "karan1369@gmail.com",
    "pin": 0
}, {
    "username": "karan12345",
    "password": "123",
    "name": "karan2",
    "email": "karan7369@gmail.com",
    "pin": 0
}]
const flightDb = [
    {
        "source": "Delhi",
        "flightId": "DB-1234",
        "destination": "Bangalore",
        "price": 10200,
        "time": new Date("April 19, 2023 11:13:00"),
        "tickets": 3

    }, {
        "source": "Delhi",
        "flightId": "DM-3453",
        "destination": "Mumbai",
        "price": 8434,
        "time": new Date("April 21, 2023 22:13:00"),
        "tickets": 12

    }, {
        "source": "Mumbai",
        "flightId": "MB-7874",
        "destination": "Bangalore",
        "price": 4876,
        "time": new Date("April 25, 2023 02:09:00"),
        "tickets": 10

    }, {
        "source": "Mumbai",
        "flightId": "MCh-2342",
        "destination": "Chandigarh",
        "price": 10200,
        "time": new Date("May 01, 2023 03:05:00"),
        "tickets": 3

    }, {
        "source": "Chandigarh",
        "flightId": "CD-2093",
        "destination": "Delhi",
        "price": 4565,
        "time": new Date("April 29, 2023 18:00:00"),
        "tickets": 6

    }, {
        "source": "Delhi",
        "flightId": "DJ-1233",
        "destination": "Jaipur",
        "price": 3565,
        "time": new Date("May 04, 2023 20:15:00"),
        "tickets": 7

    }, {
        "source": "Chandigarh",
        "flightId": "CB-4589",
        "destination": "Bangalore",
        "price": 10200,
        "time": new Date("April 02, 2023 19:20:00"),
        "tickets": 12

    }, {
        "source": "Jaipur",
        "flightId": "JC-0912",
        "destination": "Chennai",
        "price": 6778,
        "time": new Date("April 28, 2023 11:34:00"),
        "tickets": 67

    }, {
        "source": "Goa",
        "flightId": "GD-5639",
        "destination": "Delhi",
        "price": 14345,
        "time": new Date("April 26, 2023 14:33:00"),
        "tickets": 54

    }, {
        "source": "Goa",
        "flightId": "GC-0956",
        "destination": "Chennai",
        "price": 5983,
        "time": new Date("April 25, 2023 05:10:00"),
        "tickets": 65

    }, {
        "source": "Delhi",
        "flightId": "DC-1233",
        "destination": "Chandigarh",
        "price": 4855,
        "time": new Date("April 25, 2023 06:45:00"),
        "tickets": 56

    }
]
const homePagedb = [
    {
        "place": "Delhi",
        "src": ""
    },
    {
        "place": "Mumbai",
        "src": __dirname + "../mumbai.png"
    },
    {
        "place": "Kasol",
        "src": "file:///D://karan05//OneDrive%20-%20Infosys%20Limited//Desktop//TravelBooking//Server/kasol.png"
    },
    {
        "place": "Ooty",
        "src": __dirname + "../ooty.png"
    },
    {
        "place": "Shimal",
        "src": __dirname + "../shimla.png"
    }
    , {
        "place": "Chandigarh",
        "src": "",

    },
    {
        "place": "Jaipur",
        "src": ""
    }, {
        "place": "Pondicherry",
        "src": ""
    }
]
const userBooking = [
    {}
]
setUpObj.setupDb = async () => {
    let inventory = await collection.getAllocationData();
    await inventory.deleteMany();
    let allocatedData = await inventory.insertMany(allocateDb);
    if (allocatedData) {
        return "Insertion Successfull"
    } else {
        let err = new Error("Insertion failed");
        err.status = 500;
        throw err;
    }
}
setUpObj.homePageSet = async () => {
    let inventory = await collection.getHomepageData();
    await inventory.deleteMany();
    let allocatedData = await inventory.insertMany(homePagedb);
    if (allocatedData) {
        return "Insertion Successfull"
    } else {
        let err = new Error("Insertion failed");
        err.status = 500;
        throw err;
    }
}
setUpObj.flightDb = async () => {
    let inventory = await collection.getFlightData();
    await inventory.deleteMany();
    let allocatedData = await inventory.insertMany(flightDb);
    if (allocatedData) {
        return "Insertion Successfull"
    } else {
        let err = new Error("Insertion failed");
        err.status = 500;
        throw err;
    }
}
setUpObj.userBooking = async () => {
    let inventory = await collection.getFlightData();
    await inventory.deleteMany();
    let allocatedData = await inventory.insertMany(userBooking);
    if (allocatedData) {
        return "Insertion Successfull"
    } else {
        let err = new Error("Insertion failed");
        err.status = 500;
        throw err;
    }
}
module.exports = setUpObj;