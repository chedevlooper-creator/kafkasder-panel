import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase/client"

export async function POST() {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: "Çıkış başarısız", message: error.message },
        { status: 500 }
      )
    }

    const response = NextResponse.json({ message: "Çıkış başarılı" })

    response.cookies.delete("sb-access-token")
    response.cookies.delete("sb-refresh-token")

    return response
  } catch {
    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
