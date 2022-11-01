const client = require("../db");

async function reuseHistory(ctx, next) {
  try {
    const { userId } = ctx.params;
    const sql = `
      SELECT count(*) AS reuseCnt
      FROM reuse_history
      WHERE user_id = ${userId};
    `;
    const res = await client.query(sql);
    ctx.body = res.rows[0];
  } catch (error) {
    console.log(`reuseHistory: ${error}`);
    ctx.body = error;
  }
}

async function addReuse(ctx, next) {
  try {
    const { userId, reuseDt, memo } = ctx.request.body;
    const sql = `
      INSERT INTO reuse_history(user_id, reuse_dt, memo) VALUES(${userId}, '${reuseDt}', '${memo}');
    `;
    const res = await client.query(sql);
    ctx.body = res.rows[0];
  } catch (error) {
    console.log(`reuseHistory: ${error}`);
    ctx.body = error;
  }
}

module.exports = {
  reuseHistory,
  addReuse,
};
