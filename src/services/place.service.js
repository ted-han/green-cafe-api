const client = require("../db");

async function placeList(ctx, next) {
  try {
    const { offset, limit } = ctx.query;
    const sql = `
        select
          p.place_id
          ,p.name
          ,p.address
          ,round(sqrt(power(abs(p.latitude - 37.497952) * 110, 2) + power(abs(p.longitude - 127.027619) * 88, 2)), 1) as km
          ,pi.url
          ,pt.tag_name
        FROM place p
        LEFT OUTER JOIN (
          select place_id, url
          from place_image
          where img_id = 1
          ) pi
        ON p.place_id = pi.place_id
        LEFT OUTER JOIN (
          select place_id, json_agg(tag_name) as tag_name
          from place_tag
          group by place_id
          ) pt
        ON p.place_id = pt.place_id
        order by km asc
        limit ${limit}
        offset ${offset};
      `;
    const res = await client.query(sql);
    ctx.body = res.rows;
  } catch (error) {
    console.log(error);
    ctx.body = error;
  }
}

async function placeDetail(ctx, next) {
  try {
    const { id } = ctx.params;
    const sql = `
        select
          p.name
          ,p.address
          ,p.instagram
          ,p.latitude
          ,p.longitude
          ,round(sqrt(power(abs(p.latitude - 37.497952) * 110, 2) + power(abs(p.longitude - 127.027619) * 88, 2)), 1) as km
          ,pi.url
          ,pt.tag_name
        FROM place p
        LEFT OUTER JOIN (
          select place_id, json_agg(url) as url
          from place_image
          group by place_id
          ) pi
        ON p.place_id = pi.place_id
        LEFT OUTER JOIN (
          select place_id, json_agg(tag_name) as tag_name
          from place_tag
          group by place_id
          ) pt
        ON p.place_id = pt.place_id
        WHERE p.place_id = ${id};
      `;
    const res = await client.query(sql);

    ctx.body = res.rows[0];
  } catch (error) {
    console.log(error);
    ctx.body = error;
  }
}

module.exports = {
  placeList,
  placeDetail,
};
