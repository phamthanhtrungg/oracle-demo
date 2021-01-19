import express from "express";
import morgan from "morgan";
import {
  getHomeHandler,
  getHomePageHandler,
  getUserHandler,
  postHomeHandler,
  getUserRolesHandler,
  getUserPrivilegesHandler,
  getPrivilegePageHandler,
  getUserByPrivilegeHandler,
} from "./handler";
import { checkUserPrivileges, CustomErrorMiddleware } from "./middleware";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app
  .route("/")
  .get(checkUserPrivileges(false, "/home"), getHomeHandler)
  .post(postHomeHandler);
app.get("/home", getHomePageHandler);
app.get("/home/privileges", getPrivilegePageHandler);
app.get("/home/users", getUserHandler);
app.get("/users/:username/roles", getUserRolesHandler);
app.get("/users/:username/privileges", getUserPrivilegesHandler);
app.get("/privileges/:privilege/users", getUserByPrivilegeHandler);

app.use(CustomErrorMiddleware);

app.listen(PORT, () => {
  console.log(`--> http://localhost:${PORT}`);
});
