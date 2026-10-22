require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",

  "https://immegratrion-nzw.onrender.com",
];
// app.use(cors({
//   origin: "http://localhost:5173",
// }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected");

  app.listen(process.env.PORT || 5001, () => {
    console.log("Server running");
  });
}

startServer().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
