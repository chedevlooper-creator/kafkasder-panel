import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase/client"
import { refreshTokenSchema } from "@/lib/validations/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedData = refreshTokenSchema.parse(body)

    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: validatedData.refreshToken,
    })

    if (error) {
      return NextResponse.json(
        { error: "Oturum yenileme başarısız", message: error.message },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Oturum yenilenemedi" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })

    response.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Geçersiz istek", message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    )
  }
}
