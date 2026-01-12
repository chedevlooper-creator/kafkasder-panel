import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";
import { Users, DollarSign, TrendingUp } from "lucide-react";

describe("StatCard", () => {
  it("renders correctly", () => {
    render(<StatCard label="Total Users" value="1,234" icon={Users} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("displays trend when provided", () => {
    render(
      <StatCard
        label="Revenue"
        value="$10,000"
        icon={DollarSign}
        trend={12.5}
      />,
    );

    expect(screen.getByText("+12.5%")).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    const { container, rerender } = render(
      <StatCard label="Test" value="100" icon={TrendingUp} variant="default" />,
    );
    // Card component gets the variant class, not the inner div
    const card = container.querySelector("[class*='hover-glow']");
    expect(card).toBeInTheDocument();

    rerender(
      <StatCard label="Test" value="100" icon={TrendingUp} variant="success" />,
    );
    const successCard = container.querySelector("[class*='bg-success']");
    expect(successCard).toBeInTheDocument();
  });

  it("displays negative trend correctly", () => {
    render(
      <StatCard label="Decline" value="500" icon={TrendingUp} trend={-5.5} />,
    );

    expect(screen.getByText("-5.5%")).toBeInTheDocument();
  });

  it("displays trend label when provided", () => {
    render(
      <StatCard
        label="Users"
        value="100"
        icon={Users}
        trend={10}
        trendLabel="bu ay"
      />,
    );

    expect(screen.getByText(/bu ay/i)).toBeInTheDocument();
  });
});
