const nodemailer = require('nodemailer');
const randomNumber = require('../utilities/randomNumber');
const connection = require('../utilities/connection');
const emailId = "";
// const receiver = (email) => {
//     emailId = email;
// }
// function randomNumber(min, max) {

//     return Math.floor(Math.random() * 1000000 - Math.random() * 100000);

// }




main = async (email) => {
    // let testAccount = await nodemailer.createTestAccount();
    const pin = randomNumber.randomNumber();
    console.log("rand no inside email: " + pin)
    // create reusable transporter object using the default SMTP transport
    let model = await connection.getAllocationData();
    let result = await model.updateOne({ "email": email }, { "pin": pin });

    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        service: "gmail",
        auth: {
            user: "vijayrohit2904@gmail.com", // generated ethereal user
            pass: "iyzwykxkesbvgnmo", // generated ethereal password
        },
    });

    let info = transporter.sendMail({
        from: "karan147369@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Pin for verification is:  " + pin, // Subject line
        text: `${pin}`, // plain text body
        html: "", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
module.exports = main;