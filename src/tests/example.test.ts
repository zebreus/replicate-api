import { add, subtract } from "../index"

it("adds two numbers", () => {
  expect(add(1, 2)).toBe(3)
})

it("subtracts two numbers", () => {
  expect(subtract(1, 2)).toBe(-1)
})
