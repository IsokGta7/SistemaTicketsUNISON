import { Router } from "express"
import { reportController } from "./report.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { STAFF_ROLES } from "../auth/roles"

const router = Router()

// Protected routes
// Listing every report is for staff; owners use /my.
router.get("/", authenticate, authorize(...STAFF_ROLES), reportController.getAllReports.bind(reportController))
router.get("/my", authenticate, reportController.getMyReports.bind(reportController))
router.get("/:id", authenticate, reportController.getReportById.bind(reportController))
router.post("/", authenticate, reportController.createReport.bind(reportController))
router.patch("/:id", authenticate, authorize("admin"), reportController.updateReport.bind(reportController))

export default router
