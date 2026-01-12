import { render, screen } from "@testing-library/react";
import { DataTable } from "./index";
import { ColumnDef } from "@tanstack/react-table";

interface TestData {
  id: number;
  name: string;
  email: string;
}

describe("DataTable", () => {
  const mockColumns: ColumnDef<TestData>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
  ];

  const mockData: TestData[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  it("renders correctly with data", () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    render(<DataTable columns={mockColumns} data={[]} />);

    // EmptyState with variant="search" shows "Sonuç bulunamadı" - use getAllByText
    const emptyStateElements = screen.getAllByText(/sonuç bulunamadı/i);
    expect(emptyStateElements.length).toBeGreaterThan(0);
  });

  it("renders column headers", () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<DataTable columns={mockColumns} data={[]} isLoading={true} />);

    // Loading skeleton renders bg-accent elements
    expect(document.querySelector(".bg-accent")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        searchPlaceholder="Search..."
      />,
    );

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });
});
