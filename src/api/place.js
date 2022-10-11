const Router = require("koa-router");
const client = require("../db");
const router = new Router();

router.get("/", async (ctx, next) => {
  try {
    const { id } = ctx.query;
    const res = await client.query(
      `select * from public.place where place_id = ${id};`,
    );
    ctx.body = { status: 200, data: res.rows };
  } catch (error) {
    console.log(error);
    ctx.body = { status: 500, data: error };
  }
});

module.exports = router;
