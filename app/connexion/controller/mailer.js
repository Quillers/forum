const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport(smtpTransport({
  service: `gmail`,
  host: `smtp.gmail.com`,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD
  }
}));

const setMailOptions = (userEmail, message) => {
  return {
    from: process.env.EMAIL,
    to: userEmail,
    subject: `Lien de réinitialisation du mot de passe`,
    html: message
  }
};


const sendMail = (userEmail, message) => {

  const mailOptions = setMailOptions(userEmail, message);

  console.log(mailOptions);

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: `, info.response);
    }
  });
}

module.exports = { sendMail, setMailOptions, transporter };
