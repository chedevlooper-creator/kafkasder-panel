import { render, screen } from "@testing-library/react"
import ListePage from "./page"
import { createQueryClientWrapper } from "@/test-utils"

jest.mock("@/hooks/use-api", () => ({
  useMembers: () => ({
    data: { data: [], total: 0 },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/uyeler/liste",
  useSearchParams: () => new URLSearchParams(),
}))

describe("Members List Page", () => {
  it("renders the page header", () => {
    render(<ListePage />, { wrapper: createQueryClientWrapper() })
    // Use getAllByText and check first occurrence or be more specific
    const elements = screen.getAllByText(/üye/i)
    expect(elements.length).toBeGreaterThan(0)
  })
})
