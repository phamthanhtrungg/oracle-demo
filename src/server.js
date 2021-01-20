import express from "express";
import morgan from "morgan";
import cors from "cors";
import {
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
} from "./handler";
import { CustomErrorMiddleware } from "./middleware";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/api/privileges", getPrivilegesHandler);
app.get("/api/privileges/:priv/users", getUsersByPriv);
app.post("/api/privilege/revoke", revokePrivilegeHandler);

app.get("/api/roles", getRolesHandler);
app.post("/api/roles", createRoleHandler);
app.put("/api/roles/:role", editRoleHandler);
app.delete("/api/roles/:role", dropRoleHandler);
app.get("/api/roles/:role/users", getUserByRoleHandler);
app.get("/api/roles/:role/privs", getPrivsByRoleHandler);

app.get("/api/profiles", getProfileHandler);
app.get("/api/profiles/:profile/res", getResByProfileHandler);

app.use(CustomErrorMiddleware);

app.listen(PORT, () => {
  console.log(`--> http://localhost:${PORT}`);
});
