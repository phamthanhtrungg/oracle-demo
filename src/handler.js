import oracledb from "oracledb";
import path from "path";

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
    req.session.user = connection;
    return res.redirect("/home");
  } catch (err) {
    console.log(err.message);
    return res.render("index.pug", { error: err.message });
  }
}

function getHomePageHandler(_, res) {
  return res.render("home.pug");
}

export { getHomeHandler, postHomeHandler, getHomePageHandler };
