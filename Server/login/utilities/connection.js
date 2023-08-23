const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = Schema({
    username: { type: String, required: true },
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    pin: Number

}, { collection: "user" })

const homePage = Schema({
    place: String,
    src: String
})
const flightData = Schema({
    source: String,
    flightId: String,
    destination: String,
    price: Number,
    time: { type: Date },
    tickets: { type: Number, minimum: 0 }
})
const userBooking = Schema({
    email: String,
    flightId: String
}, { collection: "userBooking" })

const collection = {};
const dbURL = "mongodb://localhost:27017/travelBooking";

collection.getAllocationData = async () => {
    try {
        let dbConnection = await mongoose.connect(dbURL);
        let model = await dbConnection.model('user', user);
        return model;
    } catch (error) {
        let err = new Error("Could not connect to database");
        err.status = 500;
        throw err;
    }
}
collection.getHomepageData = async () => {
    try {
        let dbConnection = await mongoose.connect(dbURL);
        let model = await dbConnection.model('homepage', homePage);
        return model;
    } catch (error) {
        let err = new Error("Could not connect to database");
        err.status = 500;
        throw err;
    }
}
collection.getFlightData = async () => {
    try {
        let dbConnection = await mongoose.connect(dbURL);
        let model = await dbConnection.model('flightData', flightData);
        return model;
    } catch (error) {
        let err = new Error("Could not connect to database");
        err.status = 500;
        throw err;
    }
}
collection.getuserBooking = async () => {
    try {
        let dbConnection = await mongoose.connect(dbURL);
        let model = await dbConnection.model('userBooking', userBooking);
        return model;
    } catch (error) {
        let err = new Error("Could not connect to database");
        err.status = 500;
        throw err;
    }
}


module.exports = collection;