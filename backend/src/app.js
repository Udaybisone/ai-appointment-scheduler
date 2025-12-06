import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/appointments", appointmentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
