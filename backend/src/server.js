import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
