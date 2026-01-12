import { NextRequest, NextResponse } from "next/server"
import { fetchMember, updateMember, deleteMember } from "@/lib/supabase-service"
import { memberUpdateSchema } from "@/lib/validations/members"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz üye ID" },
        { status: 400 }
      )
    }

    const result = await fetchMember(id)

    if (!result) {
      return NextResponse.json(
        { error: "Üye bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Üye getirilemedi", message: error.message },
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
    const { id: idParam } = await params
    const id = Number(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz üye ID" },
        { status: 400 }
      )
    }

    const body = await req.json()

    const validatedData = memberUpdateSchema.parse(body)

    const result = await updateMember(id, validatedData)

    if (!result) {
      return NextResponse.json(
        { error: "Üye bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Üye güncellenemedi", message: error.message },
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
    const { id: idParam } = await params
    const id = Number(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz üye ID" },
        { status: 400 }
      )
    }

    await deleteMember(id)

    return NextResponse.json({ message: "Üye başarıyla silindi" })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Üye silinemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
