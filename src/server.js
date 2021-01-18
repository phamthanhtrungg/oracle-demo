import express from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import {
  getHomeHandler,
  getHomePageHandler,
  getUserHandler,
  postHomeHandler,
  getUserRoles,
  getUserPrivileges,
} from "./handler";
import {
  checkCookie,
  checkUserPrivileges,
  CustomErrorMiddleware,
} from "./middleware";

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  sessions({
    secret: "my_secret",
    name: "my_cookie",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(checkCookie);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app
  .route("/")
  .get(checkUserPrivileges(false, "/home"), getHomeHandler)
  .post(postHomeHandler);
app.get("/home", getHomePageHandler);
app.get("/home/users", getUserHandler);
app.get("/users/:username/roles", getUserRoles);
app.get("/users/:username/privileges", getUserPrivileges);

app.use(CustomErrorMiddleware);

app.listen(PORT, () => {
  console.log(`--> http://localhost:${PORT}`);
});
