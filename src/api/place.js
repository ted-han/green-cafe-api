const Router = require("koa-router");
const client = require("../db");
const router = new Router();

router.get("/", async (ctx, next) => {
  try {
    const res = await client.query(`select * from public.craft limit 2;`);
    console.log(res);
    ctx.body = { status: 200, data: res.rows };
  } catch (error) {
    console.log(error);
    ctx.body = { status: 500, data: error };
  }
});

module.exports = router;
