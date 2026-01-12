"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/lib/validators";
import { useUserStore } from "@/stores/user-store";

export default function LoginPage() {
  const { login, isLoading, error } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormData): Promise<void> {
    if (isLoading) return;

    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Giriş başarılı!");
        router.push("/genel");
      } else if (error) {
        toast.error(error);
      }
    } catch (err) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error("Login error:", err);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in-0 zoom-in-95 duration-500">
      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Giriş Yap</h1>
            <p className="text-sm text-gray-500">Hesabınıza erişin</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ornek@kafkasder.org"
                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        {...field}
                        onBlur={(e) => {
                          field.onChange(e.target.value.trim());
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Şifre
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.trim())
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id="remember"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="remember"
                          className="text-xs font-medium text-gray-600 cursor-pointer"
                        >
                          Beni hatırla
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Şifremi unuttum?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Demo Info */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Demo Hesap
            </p>
            <p className="text-xs text-gray-500">
              Herhangi bir e-posta ve 6+ karakter şifre ile giriş yapabilirsiniz
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 Kafkas Göçmenleri Derneği
      </p>
    </div>
  );
}
