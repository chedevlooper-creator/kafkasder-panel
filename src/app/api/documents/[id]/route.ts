import { NextRequest, NextResponse } from "next/server"
import { getDocumentUrl, deleteDocument } from "@/lib/supabase-service"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Geçersiz doküman ID" },
        { status: 400 }
      )
    }

    const url = await getDocumentUrl(id)

    return NextResponse.json({ url })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Doküman URL'si alınamadı", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const filePath = body.file_path

    if (!id || !filePath) {
      return NextResponse.json(
        { error: "Doküman ID ve file path gerekli" },
        { status: 400 }
      )
    }

    await deleteDocument(id, filePath)

    return NextResponse.json({ message: "Doküman başarıyla silindi" })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Doküman silinemedi", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
