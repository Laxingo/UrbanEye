// routes/confirmations.routes.js
import express from "express";
import { createConfirmation } from "../controllers/confirmations.controller.js";

const router = express.Router();

// POST /events/:id/confirmations
router.post("/events/:id/confirmations", createConfirmation);

export default router;
