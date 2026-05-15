require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./src/config/db.config");
const { notFound, errorHandler } = require("./src/middlewares/error.middleware");
const authRoutes = require("./src/routes/auth.routes");
const locationRoutes = require("./src/routes/location.routes");
const hiveRoutes = require("./src/routes/hive.routes");
const inspectionRoutes = require("./src/routes/inspection.routes");
const vetTaskRoutes = require("./src/routes/vetTask.routes");
const iotRoutes = require("./src/routes/iot.routes");
const swaggerSpec = require("./src/docs/swagger");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BeeSmart API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/hives", hiveRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/vet-tasks", vetTaskRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`BeeSmart server running on port ${PORT}`);
});
