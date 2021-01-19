import oracledb from "oracledb";
import path from "path";

let connection;

oracledb.initOracleClient({
  libDir: path.join(__dirname, "instantclient_19_9"),
});

async function getPrivilegesHandler(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const [privileges, counts] = await Promise.all([
      connection.execute(
        `
      SELECT DISTINCT PRIVILEGE
      FROM DBA_SYS_PRIVS
      ORDER BY PRIVILEGE ASC
      OFFSET ${size * page} ROWS FETCH NEXT ${size} ROWS ONLY
      `
      ),
      connection.execute(
        "SELECT COUNT(DISTINCT PRIVILEGE) TOTAL FROM DBA_SYS_PRIVS"
      ),
    ]);

    return res.json({
      success: true,
      data: {
        rows: privileges.rows,
        total: counts.rows[0][0],
        page,
        size,
      },
    });
  } catch (err) {
    next(err);
  }
}

export { getPrivilegesHandler };
