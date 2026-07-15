const dns = require("node:dns");
const path = require("path");
const dotenv = require("dotenv");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env"
  ),
});

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI,
  SECRET,
};