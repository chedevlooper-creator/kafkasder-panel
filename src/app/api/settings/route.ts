import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase/client"
import { settingsSchema } from "@/lib/validations/settings"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("category", { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: "Ayarlar getirilemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Beklenmeyen bir hata oluştu", message: error.message },
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

    const validatedData = settingsSchema.parse(body)

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("settings")
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Ayar oluşturulamadı", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Ayar oluşturulamadı", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
