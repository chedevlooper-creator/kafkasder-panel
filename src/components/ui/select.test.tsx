import { render, screen } from "@testing-library/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

describe("Select", () => {
  it("renders correctly", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText("Select an option")).toBeInTheDocument()
  })

  it("displays placeholder when no value is selected", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opt1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText("Choose...")).toBeInTheDocument()
  })

  it("can be disabled", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
      </Select>
    )

    expect(screen.getByRole("combobox")).toBeDisabled()
  })
})
