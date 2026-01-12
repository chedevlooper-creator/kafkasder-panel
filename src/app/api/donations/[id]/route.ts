import { NextRequest, NextResponse } from "next/server"
import { fetchDonation, updateDonation, deleteDonation } from "@/lib/supabase-service"
import { donationUpdateSchema } from "@/lib/validations/donations"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz bağış ID" },
        { status: 400 }
      )
    }

    const result = await fetchDonation(id)

    if (!result) {
      return NextResponse.json(
        { error: "Bağış bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Bağış getirilemedi", message: error.message },
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
        { error: "Geçersiz bağış ID" },
        { status: 400 }
      )
    }

    const body = await req.json()

    const validatedData = donationUpdateSchema.parse(body)

    const result = await updateDonation(id, validatedData)

    if (!result) {
      return NextResponse.json(
        { error: "Bağış bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Bağış güncellenemedi", message: error.message },
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
        { error: "Geçersiz bağış ID" },
        { status: 400 }
      )
    }

    await deleteDonation(id)

    return NextResponse.json({ message: "Bağış başarıyla silindi" })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Bağış silinemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
