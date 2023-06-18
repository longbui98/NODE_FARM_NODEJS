const nodemailer = require("nodemailer");

const sendMail = async options => {
    //1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_POST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Active in gmail 'less secure app' option

    })
    //2) Defind the email options
    const mailOptions = {
        from: 'Long Dev Java <javaexpert@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html: 
    };
    //3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;