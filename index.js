require("dotenv").config();
const github = require("./github");
const typeform = require("./typeform");
const args = require('minimist')(process.argv.slice(2))
const currentDate = new Date();

const year = args['year'] ?? currentDate.getFullYear();
const month = args['month'] ? args['month'] - 1 : currentDate.getMonth();

const date = new Date(year, month);
console.log(`Processing VoteMyGif for ${date.getMonth() + 1} / ${date.getFullYear()}`);

github.getGifs(date).then(gifsList => typeform.createForm(gifsList, date));
