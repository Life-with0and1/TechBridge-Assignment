import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pool from "./src/db/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});