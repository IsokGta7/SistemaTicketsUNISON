import { Router } from "express"
import { reportController } from "./report.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"

const router = Router()

// Protected routes
router.get("/", authenticate, reportController.getAllReports.bind(reportController))
router.get("/my", authenticate, reportController.getMyReports.bind(reportController))
router.get("/:id", authenticate, reportController.getReportById.bind(reportController))
router.post("/", authenticate, reportController.createReport.bind(reportController))
router.patch("/:id", authenticate, authorize("admin"), reportController.updateReport.bind(reportController))

export default router
