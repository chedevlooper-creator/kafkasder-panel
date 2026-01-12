import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase/client"
import { settingsUpdateSchema } from "@/lib/validations/settings"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Geçersiz ayar ID" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Ayar bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Ayar getirilemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Geçersiz ayar ID" },
        { status: 400 }
      )
    }

    const body = await req.json()

    const validatedData = settingsUpdateSchema.parse(body)

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("settings")
      .update({ ...validatedData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Ayar güncellenemedi", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Ayar güncellenemedi", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Geçersiz ayar ID" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from("settings")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json(
        { error: "Ayar silinemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Ayar başarıyla silindi" })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Ayar silinemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
