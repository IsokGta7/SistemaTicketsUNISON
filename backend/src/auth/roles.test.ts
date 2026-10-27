import { canAccessOwned, isStaff } from "./roles"

describe("roles", () => {
  it("treats only admin and tecnico as staff", () => {
    expect(isStaff("admin")).toBe(true)
    expect(isStaff("tecnico")).toBe(true)
    expect(isStaff("profesor")).toBe(false)
    expect(isStaff("estudiante")).toBe(false)
    expect(isStaff(undefined)).toBe(false)
  })

  it("lets the owner and staff in, and nobody else", () => {
    expect(canAccessOwned({ id: "u1", role: "estudiante" }, "u1")).toBe(true)
    expect(canAccessOwned({ id: "u2", role: "tecnico" }, "u1")).toBe(true)
    expect(canAccessOwned({ id: "u2", role: "profesor" }, "u1")).toBe(false)
  })

  it("never matches a missing user id against a missing owner", () => {
    expect(canAccessOwned({ id: undefined, role: "estudiante" }, undefined)).toBe(false)
  })
})
