import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getPrivilegesHandler, getUsersByPriv } from "./handler";
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

app.use(CustomErrorMiddleware);

app.listen(PORT, () => {
  console.log(`--> http://localhost:${PORT}`);
});
