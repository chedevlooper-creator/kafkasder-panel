import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";
import { createQueryClientWrapper } from "@/test-utils";

// Mock the entire module with proper jest.fn() for each hook
jest.mock("@/hooks/use-api", () => ({
  useDashboardStats: jest.fn(() => ({
    data: {
      activeMembers: 150,
      totalBeneficiaries: 75,
      totalDonations: 50000,
      activeKumbaras: 10,
      pendingApplications: 5,
      monthlyAid: 15000,
      donationsTrend: 12.5,
      monthlyDonations: [
        { month: "Oca", amount: 45000 },
        { month: "Şub", amount: 52000 },
      ],
      recentDonations: [],
      aidDistribution: [],
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useApplications: jest.fn(() => ({
    data: { data: [], total: 0 },
    isLoading: false,
    refetch: jest.fn(),
  })),
  useMembers: jest.fn(() => ({
    data: { data: [], total: 0 },
    isLoading: false,
    refetch: jest.fn(),
  })),
  useBeneficiaries: jest.fn(() => ({
    data: { data: [] },
    isLoading: false,
    refetch: jest.fn(),
  })),
}));

// Import after mocking
import { useDashboardStats, useBeneficiaries } from "@/hooks/use-api";
const mockUseDashboardStats = useDashboardStats as jest.Mock;
const mockUseBeneficiaries = useBeneficiaries as jest.Mock;

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDashboardStats.mockReturnValue({
      data: {
        activeMembers: 150,
        totalBeneficiaries: 75,
        totalDonations: 50000,
        activeKumbaras: 10,
        pendingApplications: 5,
        monthlyAid: 15000,
        donationsTrend: 12.5,
        monthlyDonations: [
          { month: "Oca", amount: 45000 },
          { month: "Şub", amount: 52000 },
        ],
        recentDonations: [],
        aidDistribution: [],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockUseBeneficiaries.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  it("renders correctly", () => {
    render(<DashboardPage />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByText(/genel/i)).toBeInTheDocument();
  });

  it("displays stat cards with values", () => {
    render(<DashboardPage />, { wrapper: createQueryClientWrapper() });
    // Check for stat card values
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseDashboardStats.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<DashboardPage />, { wrapper: createQueryClientWrapper() });
    // Loading skeleton renders animate-pulse or bg-accent elements
    expect(
      document.querySelector(".animate-pulse, .bg-accent, [class*='skeleton']"),
    ).toBeInTheDocument();
  });

  it("displays page structure", () => {
    render(<DashboardPage />, { wrapper: createQueryClientWrapper() });
    // Check that main dashboard sections exist
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
