import express from "express";
import { getAllUsers } from "../routControler/userControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.get("/",isLogin, getAllUsers);
// router.post("/search", );
// router.get("/:id", );

export default router;
