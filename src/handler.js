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

async function getUsersByPriv(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  const priv = req.params.priv;
  if (!priv) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide privilege" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const users = await connection.execute(
      `
        SELECT GRANTEE, COUNT
        FROM DBA_SYS_PRIVS, (SELECT COUNT(*) as COUNT FROM DBA_SYS_PRIVS WHERE PRIVILEGE = '${priv}') 
        WHERE PRIVILEGE = '${priv}'
        OFFSET ${size * page} ROWS FETCH NEXT ${size} ROWS ONLY
       `
    );

    return res.json({
      success: true,
      data: {
        rows: users.rows,
        total: users.rows > 0 ? users.rows[0][0] : 0,
        page,
        size,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function revokePrivilegeHandler(req, res, next) {
  const username = req.body.username;
  const priv = req.body.priv;
  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide username" });
  }
  if (!priv) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide priv" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    await connection.execute(`REVOKE ${priv} FROM ${username}`);
    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export { getPrivilegesHandler, getUsersByPriv, revokePrivilegeHandler };
