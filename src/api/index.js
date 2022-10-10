const Router = require("koa-router");

const api = new Router();
const place = require("./place");

api.use("/place", place.routes());

module.exports = api;
