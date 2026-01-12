import { render, screen } from "@testing-library/react"
import { EmptyState } from "./empty-state"

describe("EmptyState", () => {
  it("renders correctly with default variant", () => {
    render(
      <EmptyState
        title="No items found"
        description="There are no items to display"
      />
    )

    expect(screen.getByText("No items found")).toBeInTheDocument()
    expect(screen.getByText("There are no items to display")).toBeInTheDocument()
  })

  it("renders action button when provided", () => {
    render(
      <EmptyState
        title="Empty"
        description="No data"
        action={<button type="button">Add Item</button>}
      />
    )

    expect(screen.getByRole("button", { name: "Add Item" })).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <EmptyState
        title="Test"
        description="Test description"
        className="custom-class"
      />
    )

    expect(container.querySelector(".custom-class")).toBeInTheDocument()
  })

  it("uses variant-specific defaults when title/description not provided", () => {
    render(<EmptyState variant="search" />)

    expect(screen.getByText("Sonuç bulunamadı")).toBeInTheDocument()
  })
})
