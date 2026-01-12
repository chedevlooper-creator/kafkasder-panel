"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();
  async function onSubmit(data: LoginFormData): Promise<void> {
    const success = await login(data.email, data.password);

    if (success) {
      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
      router.push("/genel");
    } else {
      toast.error(
        error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
      );
    }
  }

  return (
    <div className="w-full max-w-[480px] animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      {/* Main Card */}
      <Card className="relative border-0 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/20 via-transparent to-cyan-500/20 p-[1px]">
          <div className="h-full w-full rounded-xl bg-white/60 backdrop-blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative">
          <CardHeader className="space-y-6 text-center pb-6 pt-12 px-8">
            {/* Logo with glow */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <Image
                  src="/logo.png"
                  alt="Kafkas Göçmenleri Derneği"
                  width={260}
                  height={208}
                  priority
                  quality={100}
                  className="relative h-auto w-[260px] drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Hoş Geldiniz
              </CardTitle>
              <CardDescription className="text-base text-gray-600 font-medium">
                Dernek yönetim panelinize giriş yapın
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10 space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-900">
                        E-posta Adresi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="ornek@kafkasder.org"
                          autoComplete="email"
                          className="h-12 border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 placeholder:text-gray-400 transition-all rounded-xl font-medium"
                          {...field}
                          onBlur={(e) => {
                            const trimmed = e.target.value.trim();
                            field.onChange(trimmed);
                            field.onBlur();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-900">
                        Şifre
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="h-12 pr-12 border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 placeholder:text-gray-400 transition-all rounded-xl font-medium"
                            {...field}
                            onChange={(e) => {
                              const trimmed = e.target.value.trim();
                              field.onChange(trimmed);
                            }}
                            onBlur={field.onBlur}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 -translate-y-1/2 right-1 h-10 w-10 hover:bg-teal-50 rounded-lg transition-colors"
                            aria-label={
                              showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                            }
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me & Forgot Password */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              id="remember-me"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-2 border-gray-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="remember-me"
                            className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
                          >
                            Beni hatırla
                          </FormLabel>
                        </div>
                        <Button
                          variant="link"
                          type="button"
                          className="text-sm font-semibold text-teal-600 hover:text-teal-700 p-0 h-auto"
                        >
                          Şifremi unuttum
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-13 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-base shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-semibold">
                  Demo Hesap
                </span>
              </div>
            </div>

            {/* Demo Info */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative rounded-2xl border-2 border-teal-100 bg-gradient-to-br from-teal-50/80 to-cyan-50/60 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Sparkles className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-sm font-bold text-teal-900 tracking-wide">
                    DEMO MODUNDA GİRİŞ
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  Herhangi bir e-posta ve{" "}
                  <span className="font-bold text-teal-700">
                    6+ karakterli şifre
                  </span>{" "}
                  ile sisteme giriş yapabilirsiniz.
                </p>
                <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-teal-100">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Örnek Giriş:
                    </p>
                    <p className="text-sm font-mono font-bold text-gray-900">
                      demo@test.com
                    </p>
                  </div>
                  <div className="h-8 w-px bg-teal-200" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Şifre:
                    </p>
                    <p className="text-sm font-mono font-bold text-gray-900">
                      123456
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 font-medium">
          © 2026 Kafkas Göçmenleri Derneği
        </p>
        <p className="text-xs text-gray-400 mt-1">Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
}
