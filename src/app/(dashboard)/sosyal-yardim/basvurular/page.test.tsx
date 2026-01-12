import { render, screen } from "@testing-library/react";
import ApplicationsPage from "./page";
import { createQueryClientWrapper } from "@/test-utils";

// Mock the entire module with proper jest.fn() for each hook
jest.mock("@/hooks/use-api", () => ({
  useApplications: jest.fn(() => ({
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
import { useApplications } from "@/hooks/use-api";
const mockUseApplications = useApplications as jest.Mock;

describe("Social Aid Applications Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApplications.mockReturnValue({
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
    render(<ApplicationsPage />, { wrapper: createQueryClientWrapper() });
    // Use getAllByText since "başvurular" appears multiple times
    const elements = screen.getAllByText(/başvurular/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("displays page title", () => {
    render(<ApplicationsPage />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseApplications.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<ApplicationsPage />, { wrapper: createQueryClientWrapper() });
    // Loading skeleton is rendered - check for skeleton elements
    expect(
      document.querySelector(".bg-accent, .animate-pulse"),
    ).toBeInTheDocument();
  });

  it("displays pagination controls", () => {
    render(<ApplicationsPage />, { wrapper: createQueryClientWrapper() });
    // Pagination buttons should exist
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
