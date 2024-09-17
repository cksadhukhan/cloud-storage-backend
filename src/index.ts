import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import "./middlewares";
import authRoutes from "./routes/auth.route";
import profileRoutes from "./routes/profile.route";
import { errorHandler } from "./middlewares";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(errorHandler);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
