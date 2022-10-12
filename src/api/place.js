const Router = require("koa-router");
const router = new Router();
const { placeList, placeDetail } = require("../services/place.service");

router.get("/", placeList);
router.get("/:id", placeDetail);

module.exports = router;
