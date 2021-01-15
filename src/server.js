import express from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { getHomeHandler, getHomePageHandler, postHomeHandler } from "./handler";
import { checkCookie, checkUserPrivileges } from "./middleware";

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
app.use(checkCookie);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app
  .route("/")
  .get(checkUserPrivileges(false, "/home"), getHomeHandler)
  .post(postHomeHandler);
app.get("/home", checkUserPrivileges(true, "/"), getHomePageHandler);

app.listen(PORT, () => {
  console.log(`--> http://localhost:${PORT}`);
});
