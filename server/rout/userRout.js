import express from "express";
import { getAllUsers } from "../routControler/userControler.js";

const router = express.Router();

router.get("/", getAllUsers);
// router.post("/search", );
// router.get("/:id", );

export default router;
