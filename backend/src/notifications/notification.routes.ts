import { Router } from "express"
import { notificationController } from "./notification.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = Router()

// Protected routes
router.get("/", authenticate, notificationController.getMyNotifications.bind(notificationController))
router.post("/read", authenticate, notificationController.markAsRead.bind(notificationController))
router.post("/read-all", authenticate, notificationController.markAllAsRead.bind(notificationController))

export default router
