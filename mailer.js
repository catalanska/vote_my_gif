const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const user = process.env.EMAIL_FROM;

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user,
      pass: process.env.GMAIL_PASS,
    },
  })
);

const mailOptions = (title, url) => {
  return {
    from: user,
    to: process.env.EMAIL_RECIPIENTS,
    subject: `${title} available`,
    text: `Visit ${url} and vote for your favourites!!`,
  };
};

module.exports = {
  notifyParticipants: ({ title, _links }) => {
    transporter.sendMail(
      mailOptions(title, _links.display),
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
  },
};
