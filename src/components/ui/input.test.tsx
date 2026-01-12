import { render, screen, fireEvent } from "@testing-library/react"
import { Input } from "./input"

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument()
  })

  it("handles input changes", () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "test" } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("can be disabled", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("can have default value", () => {
    render(<Input defaultValue="default" />)
    expect(screen.getByRole("textbox")).toHaveValue("default")
  })

  it("applies type attribute correctly", () => {
    render(<Input type="email" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email")
  })
})
