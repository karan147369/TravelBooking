const connection = require('../utilities/connection');

const getUser = {};

getUser.verify = async (username, password) => {
    let model = await connection.getAllocationData();
    let result = await model.findOne({ "username": username });
    if (result) return result;
    else return null;
}
getUser.verifyOtp = async (email) => {
    let model = await connection.getAllocationData();
    let result = await model.findOne({ "email": email });
    if (result) return result;
    else return null;
}
getUser.getEmail = async (email) => {
    let model = await connection.getAllocationData();
    let result = await model.findOne({ "email": email })
    if (result) return true;
    else return false;
}
module.exports = getUser;