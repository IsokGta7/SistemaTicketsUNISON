import type { Request, Response } from "express"
import { reportService } from "./report.service"
import { createReportDtoSchema, updateReportDtoSchema } from "./report.dto"

export class ReportController {
  async getAllReports(req: Request, res: Response) {
    try {
      const reports = await reportService.getAllReports()
      return res.status(200).json(reports)
    } catch (error) {
      console.error("Error getting reports:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getMyReports(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const reports = await reportService.getReportsByUser(userId)
      return res.status(200).json(reports)
    } catch (error) {
      console.error("Error getting user reports:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getReportById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const report = await reportService.getReportById(id)

      if (!report) {
        return res.status(404).json({ message: "Report not found" })
      }

      return res.status(200).json(report)
    } catch (error) {
      console.error("Error getting report:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async createReport(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const validatedData = createReportDtoSchema.parse(req.body)
      const report = await reportService.createReport(validatedData, userId)

      return res.status(201).json(report)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Error creating report:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async updateReport(req: Request, res: Response) {
    try {
      const { id } = req.params
      const validatedData = updateReportDtoSchema.parse(req.body)

      const report = await reportService.updateReport(id, validatedData)
      return res.status(200).json(report)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Error updating report:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}

export const reportController = new ReportController()
