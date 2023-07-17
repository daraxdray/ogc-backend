const nodemailer = require("nodemailer");

// initializing smtp to send email
var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testtestocm@gmail.com",
    pass: "wyzugdduvytnpszx",
  },
});
exports.sendResetEmailOld = async (email, token) => {
  smtpTransport.sendMail({
    from: "OGC-noreplay@gmail.com",
    to: email,
    subject: "New website OGC",
    text: `we are happy to annouce the launch of our new site you can use your email and this password: ${token} to login and please go complete your profile`, //html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
  console.log("sending email");
  return true;
};

exports.sendResetEmail = async (email, token) => {
  smtpTransport.sendMail({
    from: "OGC PUBLICATIONS <ogcpublications@gmail.com>",
    to: email,
    subject: "RESET YOUR PASSWORD",
    text: `You have requested a new password. Your new password is : ${token}`, //html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
  console.log("sending email");
  return true;
};
exports.sendResetEmailForMobile = async (email, token) => {
  var url = token;

  smtpTransport.sendMail({
    from: "OGC-noreply@gmail.com",
    to: email,
    subject: "Resetting your password for OGC Mobile",
    text: `Enter this verification code in the mobile application to reset your password ${url}. If you haven't requested this, please ignore this message`,
    //html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
  console.log("sending email");
};
/* exports.sendVerifyEmail = async (email, token) => {
  // change first part to your domain
  var url = "http://164.90.241.8:3000/user/verifyemail?token=" + token;

  await smtpTransport.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "VERIFY Your EMAIL",
    text: `Click on this link to verify ${url}`,
    html: `<h3> Click on this link to verify your email : ${url} </h3>`,
  });
}; */

exports.sendBookSubmission = async (request) => {
  smtpTransport.sendMail({
    from: "testtestocm@gmail.com",
    to: "achref.bannouri@korsgy.com",
    subject: "Book Submission request",
    text: `this is a new book submission request from ${request.email}  \n ${request.firstname} ${request.lastname}`,
    //html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
  console.log("sending email");
};

exports.sendContactEmail = async (request) => {
  smtpTransport.sendMail({
    from: "testtestocm@gmail.com",
    to: "support@ogcpublications.com",
    subject: `${request.subject}`,
    text: `From:  ${request.firstname} ${request.lastname} \n 
    Email: ${request.email} \n
    Message: ${request.message}`,
    //html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
  console.log("sending email");
};
