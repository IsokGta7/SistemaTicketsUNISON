import { ticketFiltersSchema } from "./ticket.dto"

describe("ticketFiltersSchema", () => {
  it("accepts known status and priority values and a plain category", () => {
    expect(ticketFiltersSchema.parse({ status: "new", priority: "high", category: "Hardware" })).toEqual({
      status: "new",
      priority: "high",
      category: "Hardware",
    })
  })

  it("accepts no filters at all", () => {
    expect(ticketFiltersSchema.parse({})).toEqual({})
  })

  it("rejects operator objects such as ?status[not]=x", () => {
    expect(ticketFiltersSchema.safeParse({ status: { not: "closed" } }).success).toBe(false)
    expect(ticketFiltersSchema.safeParse({ category: { contains: "" } }).success).toBe(false)
  })

  it("rejects arrays from repeated keys", () => {
    expect(ticketFiltersSchema.safeParse({ priority: ["low", "high"] }).success).toBe(false)
  })

  it("rejects values outside the status and priority enums", () => {
    expect(ticketFiltersSchema.safeParse({ status: "deleted" }).success).toBe(false)
    expect(ticketFiltersSchema.safeParse({ priority: "urgent" }).success).toBe(false)
  })

  it("strips keys it does not know", () => {
    expect(ticketFiltersSchema.parse({ status: "new", creatorId: "someone" })).toEqual({ status: "new" })
  })
})
