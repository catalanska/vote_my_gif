require("dotenv").config();
const github = require("./github");
const typeform = require("./typeform");


github.getGifs().then(typeform.createForm);
