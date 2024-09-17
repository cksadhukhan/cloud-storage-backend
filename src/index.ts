import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import "./middlewares";
import { errorHandler } from "./middlewares";
import { authRoutes, fileRoutes, profileRoutes } from "./routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(errorHandler);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/file", fileRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
