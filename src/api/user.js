const Router = require("koa-router");
const router = new Router();
const { reuseHistory } = require("../services/user.service");

router.get("/:userId", reuseHistory);

module.exports = router;
