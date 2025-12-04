import express from 'express';
import multer from 'multer';
import {
  parseAppointment,
  getAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET: list existing appointments
router.get('/', getAppointments);

// POST: parse text or image & create appointment (or ask for clarification)
router.post(
  '/parse',
  upload.single('image'), // optional file
  parseAppointment
);

export default router;
