import express from "express";
import multer from "multer";
import { parseAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/parse", upload.single("image"), parseAppointment);

export default router;
