const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) => {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
    });

    // Configure the mailoptions object
    const mailOptions = {
        from: 'phu0348880746@gmail.com',
        to: email,
        subject: subject,
        html: html
    };

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent: ', info.response);
    }
    });
}