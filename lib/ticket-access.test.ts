import { describe, expect, it } from "vitest"
import { canAccessTicket, isStaff, MAX_TICKETS_PAGE_SIZE, parsePagination } from "./ticket-access"

describe("isStaff", () => {
  it("treats admin and tecnico as staff", () => {
    expect(isStaff("admin")).toBe(true)
    expect(isStaff("tecnico")).toBe(true)
  })

  it("treats students, professors and missing roles as non-staff", () => {
    expect(isStaff("estudiante")).toBe(false)
    expect(isStaff("profesor")).toBe(false)
    expect(isStaff(undefined)).toBe(false)
    expect(isStaff("")).toBe(false)
  })
})

describe("canAccessTicket", () => {
  const ticket = { creatorId: "owner-1" }

  it("lets the creator in", () => {
    expect(canAccessTicket({ id: "owner-1", role: "estudiante" }, ticket)).toBe(true)
  })

  it("lets staff in regardless of creator", () => {
    expect(canAccessTicket({ id: "someone", role: "tecnico" }, ticket)).toBe(true)
  })

  it("keeps other non-staff users out", () => {
    expect(canAccessTicket({ id: "other", role: "profesor" }, ticket)).toBe(false)
  })

  it("does not match a missing user id against a missing creator", () => {
    expect(canAccessTicket({ id: undefined, role: "estudiante" }, { creatorId: undefined })).toBe(false)
  })
})

describe("parsePagination", () => {
  it("defaults to page 1 of 10", () => {
    expect(parsePagination(null, null)).toEqual({ page: 1, limit: 10, offset: 0 })
  })

  it("caps the limit", () => {
    expect(parsePagination("1", "100000").limit).toBe(MAX_TICKETS_PAGE_SIZE)
  })

  it("falls back on malformed or non-positive values", () => {
    expect(parsePagination("abc", "-5")).toEqual({ page: 1, limit: 10, offset: 0 })
    expect(parsePagination("0", "0")).toEqual({ page: 1, limit: 10, offset: 0 })
  })

  it("computes the offset from page and limit", () => {
    expect(parsePagination("3", "20")).toEqual({ page: 3, limit: 20, offset: 40 })
  })
})
