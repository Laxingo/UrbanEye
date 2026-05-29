import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;