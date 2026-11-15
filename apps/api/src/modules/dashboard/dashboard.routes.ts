import { Router } from "express";
import { dashboardQuerySchema } from "./dashboard.schemas.js";
import { getDashboard } from "./dashboard.service.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", async (req, res) => {
  const { month } = dashboardQuerySchema.parse(req.query);
  const dashboard = await getDashboard(req.workspaceId, month);
  res.json(dashboard);
});
