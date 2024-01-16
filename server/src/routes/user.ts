import express from "express"

// controllers
import { delUser, getAllUsers, getUser, newUser } from "../controllers/user.js";

const app = express.Router();

// route -> /api/v1/user/new
app.post("/new",newUser);

// route -> /api/v1/user/all
app.get("/all",getAllUsers);

// route -> /api/v1/user/:id
app.route("/:id").get(getUser).delete(delUser);


export default app;