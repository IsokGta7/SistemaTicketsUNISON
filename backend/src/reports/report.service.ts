import prisma from "../db/client"
import type { CreateReportDto, ReportDto, UpdateReportDto } from "./report.dto"

export class ReportService {
  async getAllReports(): Promise<ReportDto[]> {
    const reports = await prisma.report.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return reports.map(this.mapToReportDto)
  }

  async getReportsByUser(userId: string): Promise<ReportDto[]> {
    const reports = await prisma.report.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return reports.map(this.mapToReportDto)
  }

  async getReportById(id: string): Promise<ReportDto | null> {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!report) {
      return null
    }

    return this.mapToReportDto(report)
  }

  async createReport(data: CreateReportDto, userId: string): Promise<ReportDto> {
    const report = await prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return this.mapToReportDto(report)
  }

  async updateReport(id: string, data: UpdateReportDto): Promise<ReportDto> {
    const report = await prisma.report.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return this.mapToReportDto(report)
  }

  private mapToReportDto(report: any): ReportDto {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      type: report.type,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      user: report.user
        ? {
            id: report.user.id,
            firstName: report.user.firstName,
            lastName: report.user.lastName,
            email: report.user.email,
          }
        : undefined,
    }
  }
}

export const reportService = new ReportService()
