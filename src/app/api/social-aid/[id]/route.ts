import { NextRequest, NextResponse } from "next/server"
import { fetchApplicationById, updateApplicationStatus } from "@/lib/supabase-service"
import { socialAidApplicationUpdateSchema } from "@/lib/validations/social-aid"

type ApplicationStatus = "beklemede" | "inceleniyor" | "onaylandi" | "reddedildi"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz başvuru ID" },
        { status: 400 }
      )
    }

    const result = await fetchApplicationById(id)

    if (!result) {
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Başvuru getirilemedi", message: error.message },
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
        { error: "Geçersiz başvuru ID" },
        { status: 400 }
      )
    }

    const body = await req.json()

    const validatedData = socialAidApplicationUpdateSchema.parse(body)

    const result = await updateApplicationStatus(
      id,
      validatedData.durum as ApplicationStatus,
      validatedData.talep_edilen_tutar
    )

    if (!result) {
      return NextResponse.json(
        { error: "Başvuru bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Başvuru güncellenemedi", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
