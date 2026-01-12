import { NextRequest, NextResponse } from "next/server"
import { fetchApplications } from "@/lib/supabase-service"
import { getSupabaseClient } from "@/lib/supabase/client"
import { socialAidApplicationSchema, socialAidApplicationQuerySchema } from "@/lib/validations/social-aid"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const query = socialAidApplicationQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      durum: searchParams.get("durum"),
    })

    const result = await fetchApplications({
      page: Number(query.page),
      limit: Number(query.limit),
      durum: query.durum,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Başvurular getirilemedi", message: error.message },
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

    const validatedData = socialAidApplicationSchema.parse(body)

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("social_aid_applications")
      .insert({
        beneficiary_id: validatedData.beneficiary_id,
        yardim_turu: validatedData.yardim_turu,
        talep_edilen_tutar: validatedData.talep_edilen_tutar,
        gerekce: validatedData.gerekce,
        durum: validatedData.durum || "beklemede",
        basvuru_tarihi: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Başvuru oluşturulamadı", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Başvuru oluşturulamadı", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
