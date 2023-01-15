const figlet = require("figlet");
const chalk = require("chalk");

const ctx = new chalk.Instance({ level: 3 });

module.exports = (msg, font = "Standard") =>
  console.log(figlet.textSync(msg, { font }));
