import { render, screen } from "@testing-library/react";
import DonationsListPage from "./page";
import { createQueryClientWrapper } from "@/test-utils";

// Mock the entire module with proper jest.fn() for each hook
jest.mock("@/hooks/use-api", () => ({
  useDonations: jest.fn(() => ({
    data: {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

// Import after mocking
import { useDonations } from "@/hooks/use-api";
const mockUseDonations = useDonations as jest.Mock;

describe("Donations List Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDonations.mockReturnValue({
      data: {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders correctly", () => {
    render(<DonationsListPage />, { wrapper: createQueryClientWrapper() });
    // Use getAllByText since "bağış" appears multiple times
    const elements = screen.getAllByText(/bağış/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("displays empty state when no donations", () => {
    render(<DonationsListPage />, { wrapper: createQueryClientWrapper() });
    // EmptyState with variant="search" shows "Sonuç bulunamadı" - use getAllByText
    const emptyStateElements = screen.getAllByText(/sonuç bulunamadı/i);
    expect(emptyStateElements.length).toBeGreaterThan(0);
  });

  it("shows loading state", () => {
    mockUseDonations.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<DonationsListPage />, { wrapper: createQueryClientWrapper() });
    // Loading skeleton is rendered
    expect(document.querySelector(".bg-accent")).toBeInTheDocument();
  });

  it("displays page header", () => {
    render(<DonationsListPage />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
