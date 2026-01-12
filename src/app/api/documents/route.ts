import { NextRequest, NextResponse } from "next/server"
import { fetchDocuments, uploadDocument } from "@/lib/supabase-service"
import { documentQuerySchema } from "@/lib/validations/documents"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const query = documentQuerySchema.parse({
      beneficiary_id: searchParams.get("beneficiary_id"),
    })

    if (!query.beneficiary_id) {
      return NextResponse.json(
        { error: "Beneficiary ID gerekli" },
        { status: 400 }
      )
    }

    const result = await fetchDocuments(query.beneficiary_id)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Dokümanlar getirilemedi", message: error.message },
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
    const formData = await req.formData()

    const file = formData.get("file") as File
    const beneficiaryId = formData.get("beneficiary_id") as string
    const documentType = formData.get("document_type") as string

    if (!file || !beneficiaryId || !documentType) {
      return NextResponse.json(
        { error: "Dosya, beneficiary ID ve document type gerekli" },
        { status: 400 }
      )
    }

    const result = await uploadDocument(
      file,
      beneficiaryId,
      documentType as any
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Doküman yüklenemedi", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
