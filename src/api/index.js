const Router = require("koa-router");

const api = new Router();
const place = require("./place");
const user = require("./user");

api.use("/place", place.routes());
api.use("/user", user.routes());

module.exports = api;
