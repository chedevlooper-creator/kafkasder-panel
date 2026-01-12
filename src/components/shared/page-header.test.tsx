import { render, screen } from "@testing-library/react"
import { PageHeader } from "./page-header"

describe("PageHeader", () => {
  it("renders correctly with title", () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("renders description when provided", () => {
    render(
      <PageHeader
        title="Dashboard"
        description="Welcome to your dashboard"
      />
    )
    expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument()
  })

  it("renders action button when provided", () => {
    render(
      <PageHeader
        title="Users"
        action={<button type="button">Add User</button>}
      />
    )
    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <PageHeader title="Test" className="custom-class" />
    )
    expect(container.querySelector(".custom-class")).toBeInTheDocument()
  })
})
