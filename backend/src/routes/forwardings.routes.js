// routes/forwardings.routes.js
import express from "express";
import {
  createForwarding,
  updateForwarding,
  deleteForwarding,
} from "../controllers/forwardings.controller.js";

const router = express.Router();

// POST /events/:id/forwardings
router.post("/events/:id/forwardings", createForwarding);

// PATCH /forwardings/:id
router.patch("/forwardings/:id", updateForwarding);

// DELETE /forwardings/:id
router.delete("/forwardings/:id", deleteForwarding);

export default router;
