import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserStore } from "./user-store";

describe("User Store", () => {
  beforeEach(() => {
    useUserStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logs in user correctly", async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe("test@example.com");
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("logs out user correctly", async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("updates user correctly", async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    act(() => {
      result.current.updateUser({ name: "Updated Name" });
    });

    expect(result.current.user?.name).toBe("Updated Name");
  });

  it("completes login flow successfully", async () => {
    const { result } = renderHook(() => useUserStore());

    // Before login
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);

    // Perform login
    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    // After login completes
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();
    });
  });

  it("user has permissions after login", async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    // Demo user has admin permissions
    expect(result.current.user?.permissions).toBeDefined();
    expect(result.current.user?.permissions?.length).toBeGreaterThan(0);
  });
});
