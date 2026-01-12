import UyelerPage from "./page"

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

describe("Members Page", () => {
  it("redirects to members list", () => {
    const { redirect } = require("next/navigation")
    // redirect fonksiyonu void döner, render edilemez - direkt çağırıyoruz
    try {
      UyelerPage()
    } catch {
      // redirect throws NEXT_REDIRECT error, ignore it
    }
    expect(redirect).toHaveBeenCalledWith("/uyeler/liste")
  })
})
