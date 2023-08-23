const verifyUser = {};
const getUser = require('../model/getUser');
const { scryptSync } = require('crypto');
verifyUser.verify = async (username, password) => {
    let result = await getUser.verify(username);
    // console.log(result);
    if (result) {
        const pswd = result.password.split(':');
        const salt = pswd[0];
        const hashedPassword = scryptSync(password, salt, 64).toString('hex');
        if (pswd[1] === hashedPassword) return { "username": result.username, "email": result.email, "name": result.name };
        else return null;
    }
    else return null;

}
verifyUser.verifyOtp = async (email) => {
    let result = await getUser.verifyOtp(email);
    if (result) {
        return { "pin": result.pin }
    }
    else return null;
}

verifyUser.getEmail = async (email) => {
    let result = await getUser.getEmail(email);
    if (result) {
        return true;
    }
    else return false;
}
module.exports = verifyUser;