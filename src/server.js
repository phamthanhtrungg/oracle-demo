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
  createProfileHandler,
  editResByProfileHandler,
  dropProfileHandler,
  getUserByProfileHandler,
  revokeProfileHandler,
  getUsersHandler,
  dropUserHandler,
  getRoleByUserHandler,
  gePrivByUserHandler,
  getTableSpaceHandler,
  getAllRolesHandler,
  getAllProfileHandler,
  createUserHandler,
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
app.post("/api/profiles", createProfileHandler);
app.post("/api/profiles/revoke", revokeProfileHandler);
app.delete("/api/profiles/:profile", dropProfileHandler);
app.get("/api/profiles/:profile/res", getResByProfileHandler);
app.put("/api/profiles/:profile/res", editResByProfileHandler);
app.get("/api/profiles/:profile/users", getUserByProfileHandler);

app.get("/api/users", getUsersHandler);
app.post("/api/users", createUserHandler);
app.delete("/api/users/:user", dropUserHandler);
app.get("/api/users/:user/roles", getRoleByUserHandler);
app.get("/api/users/:user/privs", gePrivByUserHandler);
app.get("/api/tablespaces", getTableSpaceHandler);
app.get("/api/all_roles", getAllRolesHandler);
app.get("/api/all_profiles", getAllProfileHandler);

app.use(CustomErrorMiddleware);

app.listen(PORT, () => {
  console.log(`--> http://localhost:${PORT}`);
});
