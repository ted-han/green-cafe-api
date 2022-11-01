const Router = require("koa-router");
const router = new Router();
const { reuseHistory, addReuse } = require("../services/user.service");

router.get("/:userId", reuseHistory);
router.post("/reuse", addReuse);

module.exports = router;
