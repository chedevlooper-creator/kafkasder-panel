import { NextRequest, NextResponse } from "next/server"
import { fetchDonations, createDonation } from "@/lib/supabase-service"
import { donationSchema, donationQuerySchema } from "@/lib/validations/donations"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const query = donationQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      amac: searchParams.get("amac"),
    })

    const result = await fetchDonations({
      page: Number(query.page),
      limit: Number(query.limit),
      search: query.search,
      amac: query.amac,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Bağışlar getirilemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedData = donationSchema.parse(body)

    const result = await createDonation(validatedData)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Bağış oluşturulamadı", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
