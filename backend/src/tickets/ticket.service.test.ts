import { TicketService } from "./ticket.service"
import prisma from "../db/client"

// Mock Prisma client
jest.mock("../db/client", () => ({
  ticket: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  ticketHistory: {
    create: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
}))

describe("TicketService", () => {
  let ticketService: TicketService

  beforeEach(() => {
    ticketService = new TicketService()
    jest.clearAllMocks()
  })

  describe("getAllTickets", () => {
    it("should return all tickets", async () => {
      // Mock tickets
      const mockTickets = [
        {
          id: "1",
          title: "Test Ticket",
          description: "Test Description",
          status: "new",
          priority: "medium",
          category: "Hardware",
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: {
            id: "1",
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
          },
        },
      ]
      ;(prisma.ticket.findMany as jest.Mock).mockResolvedValue(mockTickets)

      const result = await ticketService.getAllTickets()

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe("Test Ticket")
      expect(prisma.ticket.findMany).toHaveBeenCalled()
    })
  })

  describe("createTicket", () => {
    it("should create a ticket successfully", async () => {
      // Mock ticket creation
      const mockTicket = {
        id: "1",
        title: "Test Ticket",
        description: "Test Description",
        status: "new",
        priority: "medium",
        category: "Hardware",
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: {
          id: "1",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        },
      }
      ;(prisma.ticket.create as jest.Mock).mockResolvedValue(mockTicket)
      ;(prisma.ticketHistory.create as jest.Mock).mockResolvedValue({})

      const result = await ticketService.createTicket(
        {
          title: "Test Ticket",
          description: "Test Description",
          category: "Hardware",
          priority: "medium",
        },
        "1",
      )

      expect(result.title).toBe("Test Ticket")
      expect(prisma.ticket.create).toHaveBeenCalled()
      expect(prisma.ticketHistory.create).toHaveBeenCalled()
    })
  })
})
