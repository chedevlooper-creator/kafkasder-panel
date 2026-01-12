import { renderHook, waitFor } from "@testing-library/react"
import { useMembers } from "./use-api"
import { createQueryClientWrapper } from "@/test-utils"

jest.mock("@/lib/supabase-service", () => ({
  fetchMembers: jest.fn(),
}))

describe("useMembers hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("fetches members successfully", async () => {
    const mockData = {
      data: [
        { id: 1, ad: "John", soyad: "Doe" },
        { id: 2, ad: "Jane", soyad: "Smith" },
      ],
      total: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    }

    const { fetchMembers } = require("@/lib/supabase-service")
    fetchMembers.mockResolvedValue(mockData)

    const { result } = renderHook(() => useMembers({ page: 1, limit: 10 }), {
      wrapper: createQueryClientWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
    expect(fetchMembers).toHaveBeenCalledWith({ page: 1, limit: 10 })
  })

  it("handles loading state", () => {
    const { fetchMembers } = require("@/lib/supabase-service")
    fetchMembers.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useMembers(), {
      wrapper: createQueryClientWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it("handles error state", async () => {
    const mockError = new Error("Failed to fetch")
    const { fetchMembers } = require("@/lib/supabase-service")
    fetchMembers.mockRejectedValue(mockError)

    const { result } = renderHook(() => useMembers(), {
      wrapper: createQueryClientWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(mockError)
  })

  it("refetches data", async () => {
    const mockData = {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    }

    const { fetchMembers } = require("@/lib/supabase-service")
    fetchMembers.mockResolvedValue(mockData)

    const { result } = renderHook(() => useMembers(), {
      wrapper: createQueryClientWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    await result.current.refetch()

    expect(fetchMembers).toHaveBeenCalledTimes(2)
  })
})
