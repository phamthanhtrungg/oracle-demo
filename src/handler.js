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
        ORDER BY GRANTEE
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

async function getRolesHandler(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const [roles, counts] = await Promise.all([
      connection.execute(
        `
      SELECT ROLE, PASSWORD_REQUIRED
      FROM DBA_ROLES
      ORDER BY ROLE ASC
      OFFSET ${size * page} ROWS FETCH NEXT ${size} ROWS ONLY
      `
      ),
      connection.execute("SELECT COUNT(*) COUNT FROM DBA_ROLES"),
    ]);

    return res.json({
      success: true,
      data: {
        rows: roles.rows,
        total: counts.rows > 0 ? counts.rows[0][0] : 0,
        page,
        size,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getUserByRoleHandler(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  const role = req.params.role;
  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide role" });
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
        FROM DBA_ROLE_PRIVS, (SELECT COUNT(*) as COUNT FROM DBA_ROLE_PRIVS WHERE GRANTED_ROLE = '${role}') 
        WHERE GRANTED_ROLE = '${role}'
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

async function getPrivsByRoleHandler(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  const role = req.params.role;
  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide role" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const [roles, counts] = await Promise.all([
      connection.execute(
        `
      SELECT PRIVILEGE
      FROM DBA_SYS_PRIVS
      WHERE GRANTEE = '${role}'  
      ORDER BY PRIVILEGE ASC
      OFFSET ${size * page} ROWS FETCH NEXT ${size} ROWS ONLY
      `
      ),
      connection.execute(
        `SELECT COUNT(*) FROM DBA_SYS_PRIVS WHERE GRANTEE = '${role}'`
      ),
    ]);

    return res.json({
      success: true,
      data: {
        rows: roles.rows,
        total: counts.rows > 0 ? counts.rows[0][0] : 0,
        page,
        size,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function dropRoleHandler(req, res, next) {
  const role = req.params.role;
  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide role" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    await connection.execute(` DROP ROLE ${role} `);

    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

async function editRoleHandler(req, res, next) {
  const role = req.params.role;
  const hasPwd = req.body.hasPwd !== undefined ? req.body.hasPwd : false;
  const pwd = req.body.pwd ?? "";
  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide role" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    let query = `ALTER ROLE ${role} NOT IDENTIFIED`;
    if (hasPwd) {
      query = `ALTER ROLE ${role} IDENTIFIED BY ${pwd}`;
    }
    await connection.execute(query);
    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

async function createRoleHandler(req, res, next) {
  const role = req.body.role;
  const hasPwd = req.body.hasPwd !== undefined ? req.body.hasPwd : false;
  const pwd = req.body.pwd ?? "";
  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide role" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    let query = `CREATE ROLE ${role} NOT IDENTIFIED`;
    if (hasPwd) {
      query = `CREATE ROLE ${role} IDENTIFIED BY ${pwd}`;
    }
    await connection.execute(query);
    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

async function getProfileHandler(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const [profiles, counts] = await Promise.all([
      connection.execute(
        `
      SELECT DISTINCT PROFILE
      FROM DBA_PROFILES
      ORDER BY PROFILE
      OFFSET ${size * page} ROWS FETCH NEXT ${size} ROWS ONLY
      `
      ),
      connection.execute(
        "SELECT COUNT(DISTINCT PROFILE) COUNT FROM DBA_PROFILES"
      ),
    ]);

    return res.json({
      success: true,
      data: {
        rows: profiles.rows,
        total: counts.rows > 0 ? counts.rows[0][0] : 0,
        page,
        size,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getResByProfileHandler(req, res, next) {
  const page = req.query.page || 0;
  const size = req.query.size || 10;
  const profile = req.params.profile;
  if (!profile) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide profile" });
  }
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    console.log(profile);
    const [profiles, counts] = await Promise.all([
      connection.execute(
        `
      SELECT RESOURCE_NAME, RESOURCE_TYPE, LIMIT 
      FROM DBA_PROFILES
      WHERE PROFILE = '${profile}'  
      OFFSET ${size * page} ROWS FETCH NEXT ${size} ROWS ONLY
      `
      ),
      connection.execute(
        `SELECT COUNT(*) FROM DBA_PROFILES WHERE PROFILE = '${profile}'`
      ),
    ]);

    return res.json({
      success: true,
      data: {
        rows: profiles.rows,
        total: counts.rows > 0 ? counts.rows[0][0] : 0,
        page,
        size,
      },
    });
  } catch (err) {
    next(err);
  }
}

export {
  getPrivilegesHandler,
  getUsersByPriv,
  revokePrivilegeHandler,
  getRolesHandler,
  getUserByRoleHandler,
  getPrivsByRoleHandler,
  dropRoleHandler,
  editRoleHandler,
  createRoleHandler,
  getProfileHandler,
  getResByProfileHandler,
};
