import oracledb from "oracledb";
import path from "path";
import {
  GET_CURRENT_USER_QUERY,
  GET_USERS_QUERY,
  USERS_TABLE_HEADER,
  GET_USER_ROLES,
  GET_USER_PRIVILEGES,
  GET_ALL_PRIVILEGES,
} from "./constant";

let connection;

oracledb.initOracleClient({
  libDir: path.join(__dirname, "instantclient_19_9"),
});

function getHomeHandler(_, res) {
  return res.render("index.pug");
}

async function postHomeHandler(req, res) {
  const { username, password } = req.body;
  try {
    connection = await oracledb.getConnection({
      user: username,
      password: password,
      connectString: "localhost/orcl",
    });
    req.session.user = await connection.execute(GET_CURRENT_USER_QUERY);
    return res.redirect("/home");
  } catch (err) {
    console.log(err.message);
    return res.render("index.pug", { error: err.message });
  }
}

function getHomePageHandler(_, res) {
  return res.render("home.pug");
}

async function getPrivilegePageHandler(req, res, next) {
  try {
    const page = req.query.page ?? 0;
    const limit = req.query.limit ?? 10;
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const privileges = await connection.execute(
      `
    SELECT DISTINCT PRIVILEGE, TOTAL
    FROM DBA_SYS_PRIVS, (SELECT COUNT(DISTINCT PRIVILEGE) TOTAL FROM DBA_SYS_PRIVS)
    ORDER BY PRIVILEGE ASC
    OFFSET ${page * limit} ROWS FETCH NEXT ${limit} ROWS ONLY
      `
    );
    return res.render("privilege.pug", {
      privileges: privileges.rows,
      limit,
      page,
      total: privileges.rows[0][1],
    });
  } catch (err) {
    next(err);
  }
}

async function getUserHandler(_, res, next) {
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "admin",
      connectString: "localhost/orcl",
    });
    const query = await connection.execute(GET_USERS_QUERY);

    return res.render("user.pug", {
      tableHeaders: USERS_TABLE_HEADER,
      users: query.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserRolesHandler(req, res, next) {
  try {
    const username = req.params.username;
    const roles = await connection.execute(GET_USER_ROLES, [username]);
    return res.render("list.pug", { arr: roles.rows, title: "Roles" });
  } catch (err) {
    next(err);
  }
}

async function getUserPrivilegesHandler(req, res, next) {
  try {
    const username = req.params.username;
    const privileges = await connection.execute(GET_USER_PRIVILEGES, [
      username,
    ]);
    return res.render("list.pug", {
      arr: privileges.rows,
      title: "Privileges",
    });
  } catch (err) {
    next(err);
  }
}

export {
  getUserHandler,
  getHomeHandler,
  postHomeHandler,
  getHomePageHandler,
  getUserRolesHandler,
  getUserPrivilegesHandler,
  getPrivilegePageHandler,
};
