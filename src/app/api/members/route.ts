import { NextRequest, NextResponse } from "next/server"
import { fetchMembers, createMember } from "@/lib/supabase-service"
import { memberSchema, memberQuerySchema } from "@/lib/validations/members"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const query = memberQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
    })

    const result = await fetchMembers({
      page: Number(query.page),
      limit: Number(query.limit),
      search: query.search,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Üyeler getirilemedi", message: error.message },
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

    const validatedData = memberSchema.parse(body)

    const result = await createMember(validatedData)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Üye oluşturulamadı", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
