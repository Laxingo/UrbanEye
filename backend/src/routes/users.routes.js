import express from "express";
import { loginUser, createUser } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);

export default router;