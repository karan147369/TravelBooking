const express = require('express');
const routing = express.Router();
const verifyUser = require('../service/verifyUser');
const create = require("../../Database/setUpDb");
const sendOtp = require('../service/sendEmail');
const connection = require('../utilities/connection');
const { scryptSync, randomBytes } = require('crypto');
var jwt = require('jsonwebtoken');
var secretKey = "dfDl3454+;kj@1L:ds09:sdfR23!";
let Email = "";
routing.get('/setupDb', (req, res, next) => {
    create.setupDb().then((data) => {
        res.send(data)
    }).catch((err) => {
        next(err)
    })
    create.homePageSet().then((data) => {
        res.send(data)
    }).catch((err) => {
        next(err)
    })
    create.flightDb().then((data) => {
        res.send(data)
    }).catch((err) => {
        next(err)
    })
    create.userBooking().then((data) => {
        res.send(data)
    }).catch((err) => {
        next(err)
    })
})
routing.get('/getusername', async (req, res, next) => {
    let model = await connection.getAllocationData();
    let result = await model.find({ 'username': req.query.username });
    if (result.length > 0) res.send(false);
    else res.send(true);
})

routing.post('/login', async (req, res, next) => {
    let result = await verifyUser.verify(req.body.username, req.body.password);
    if (result !== null) {
        Email = result.email;
        res.json({ username: result.username, email: result.email, name: result.name });
    }
    else {
        res.send(null);
    }
})
routing.get('/verifyOtp', async (req, res, next) => {
    await sendOtp(Email);
    let pin = await verifyUser.verifyOtp(Email);
    res.json({ "otp": pin });

})
routing.get('/homepage', async (req, res, next) => {
    let model = await connection.getHomepageData();
    let result = await model.find({});

    let arr = []
    if (result) {
        for (i of result) {
            let values = [];
            values.push(i.place);
            values.push(i.src);
            arr.push(values);

        }
        res.send(arr)
    }
    else return null;
})
routing.post('/verifyEmail', async (req, res, next) => {
    let result = await verifyUser.getEmail(req.body.email);
    if (result) res.send(true);
    else res.send(false);
})
routing.post('/register', async (req, res, next) => {
    let model = await connection.getAllocationData();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(req.body.password, salt, 64).toString('hex');

    let result = await model.create({ "username": req.body.username, "password": `${salt}:${hashedPassword}`, "name": req.body.name, "email": req.body.email, "pin": 0 });

    if (result) res.send(true)
    else res.send(false)
})
routing.get('/flightData', async (req, res, next) => {
    let model = await connection.getFlightData();
    let result = await model.find();
    res.send(result)

})
routing.post('/userBooking', async (req, res, next) => {
    let model = await connection.getuserBooking();
    try {
        let isPresent = await model.find({ "email": req.body.email, "flightId": req.body.flightId });

        if (isPresent.length == 0) {
            let result = await model.create({ "email": req.body.email, "flightId": req.body.flightId });
            if (result) res.send(true)
            else res.send("failed")
        }
        else {
            res.send(false);
        }

    }
    catch (error) {
        throw error;
    }

})
routing.post('/getuserBooking', async (req, res, next) => {
    let model = await connection.getuserBooking();
    let result = await model.find({ "email": req.body.email });
    if (result.length > 0) res.send(result);
    else res.send(false)

})
routing.post('/cancelBooking', async (req, res, next) => {
    let model = await connection.getuserBooking();
    let result = await model.deleteOne({ "email": req.body.email, "flightId": req.body.flightId })
    if (result) res.send(true);
    else res.send(false)
})
routing.post('/search', async (req, res, next) => {
    let model = await connection.getFlightData();
    if (req.body.destination === "undefined" && req.body.source !== "undefined") {
        let result = await model.find({ "source": req.body.source })
        console.log(res.data)
        if (result) res.send(result)
        else res.send(false)
    }
    else if (req.body.destination !== "undefined" && req.body.source === "undefined") {
        let result = await model.find({ "destination": req.body.destination })
        if (result) res.send(result)
        else res.send(false)
    }
    else if (req.body.destination === "undefined" && req.body.source === "undefined") {
        let result = await model.find({})
        if (result) res.send(result)
        else res.send(false)
    }
    else {
        let result = await model.find({ "source": req.body.source, "destination": req.body.destination })
        if (result) res.send(result);
        else res.send(false);
    }

})
routing.get('/', async (req, res, next) => {
    res.status(404).json({ message: 'Route not found' })
})
routing.post('/getToken', async (req, res, next) => {
    const user = {
        "email": req.body.email,
        "name": req.body.name
    };
    try {
        const token = jwt.sign({ "user": user }, secretKey);
        res.json({ "token": token });
    }
    catch (err) {
        res.send({ "message": err.message });
    }


})
routing.post('/verifyToken', async (req, res, next) => {
    let token = req.body.token;
    try {
        const verified = jwt.verify(token, secretKey);
        res.send(verified.user);
    }
    catch (err) {
        res.send(false)
    }
})
routing.post('/updateTickets', async (req, res, next) => {
    let model = await connection.getFlightData();
    try {
        let response = await model.updateOne({ "flightId": req.body.flightId }, { $inc: { tickets: req.body.ticketCount } });
        console.log(response)
        res.json({ type: "success" });
    }
    catch (err) {
        res.json({ type: "error", error: err.message });
    }

})
module.exports = routing;

