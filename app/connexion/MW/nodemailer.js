const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const template = require('./lostPassMail_template');

const transporter = nodemailer.createTransport(smtpTransport({
  service: `gmail`,
  host: `smtp.gmail.com`,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD
  }
}));

const sendLostPassMail = (user, callback) => {
  const message = template.before + user.firstname + template.after_name + user.password + template.after_mdp

  transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: `TOPIC(S) - réinitialisation du mot de passe`,
    html: message
  }, callback);
}


module.exports = { transporter, sendLostPassMail };
