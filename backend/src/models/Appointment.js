import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    department: { type: String, required: true },
    date: { type: String, required: true },    // YYYY-MM-DD
    time: { type: String, required: true },    // HH:mm
    tz: { type: String, default: 'Asia/Kolkata' },
    rawText: { type: String, required: true },
    entities: {
      date_phrase: String,
      time_phrase: String,
      department: String
    },
    status: {
      type: String,
      enum: ['ok', 'needs_clarification'],
      default: 'ok'
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
