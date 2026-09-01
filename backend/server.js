require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDatabase = require("./config/database");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", async (req, res) => {
  try {
    await connectDatabase();

    res.json({
      status: "ok",
      service: "sales-crm-backend",
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed"
    });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/deals", require("./routes/dealRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

// Local development
if (!process.env.VERCEL) {
  connectDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}

// Vercel
module.exports = app;
