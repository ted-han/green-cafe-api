const client = require("../db");

async function placeList(ctx, next) {
  try {
    const { latitude, longitude, tag, offset, limit } = ctx.query;
    let res;
    let sql;
    // 권한이 없거나 현재위치 정보 조회에 실패한 경우
    if (latitude === "37.497952" && longitude === "127.027619") {
      sql = `
        select
          p.place_id
          ,p.name
          ,p.address
          ,p.discount
          ,pi.url
          ,pt.tag_id
        FROM place p
        LEFT OUTER JOIN (
            select place_id, url
            from place_image
            where img_id = 1
          ) pi
        ON p.place_id = pi.place_id
        JOIN (
            select place_id, json_agg(tag_id) as tag_id
            from place_tag
            where place_id in (
                select place_id
                from place_tag
                ${tag && `where tag_id in (${tag})`}
              )
            group by place_id
          ) pt
        ON p.place_id = pt.place_id
        order by place_id asc
        limit ${limit}
        offset ${offset};
      `;
    } else {
      sql = `
        select
          p.place_id
          ,p.name
          ,p.address
          ,p.discount
          ,round(sqrt(power(abs(p.latitude - ${latitude}) * 110, 2) + power(abs(p.longitude - ${longitude}) * 88, 2)), 1) as km
          ,pi.url
          ,pt.tag_id
        FROM place p
        LEFT OUTER JOIN (
          select place_id, url
          from place_image
          where img_id = 1
          ) pi
        ON p.place_id = pi.place_id
        JOIN (
            select place_id, json_agg(tag_id) as tag_id
            from place_tag
            where place_id in (
                select place_id
                from place_tag
                ${tag && `where tag_id in (${tag})`}
              )
            group by place_id
          ) pt
        ON p.place_id = pt.place_id
        order by km asc
        limit ${limit}
        offset ${offset};
      `;
    }
    res = await client.query(sql);
    ctx.body = res.rows;
  } catch (error) {
    console.log(`placeList: ${error}`);
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
    console.log(`placeDetail: ${error}`);
    ctx.body = error;
  }
}

module.exports = {
  placeList,
  placeDetail,
};
