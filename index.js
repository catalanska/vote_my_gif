require("dotenv").config();
const github = require("./github");
const typeform = require("./typeform");
const mailer = require("./mailer");

github.getGifs().then(typeform.createForm).then(mailer.notifyParticipants);
