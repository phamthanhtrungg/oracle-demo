import oracledb from "oracledb";
import path from "path";
import {
  GET_CURRENT_USER_QUERY,
  GET_USERS_QUERY,
  USERS_TABLE_HEADER,
  GET_USER_ROLES,
  GET_USER_PRIVILEGE,
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

async function getUserRoles(req, res, next) {
  try {
    const username = req.params.username;
    console.log(username);
    const roles = await connection.execute(GET_USER_ROLES, [username]);
    return res.render("list.pug", { arr: roles.rows });
  } catch (err) {
    next(err);
  }
}

export {
  getUserHandler,
  getHomeHandler,
  postHomeHandler,
  getHomePageHandler,
  getUserRoles,
};
