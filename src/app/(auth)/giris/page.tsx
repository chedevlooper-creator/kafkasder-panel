"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
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
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <Card
        className="border-0 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-teal-500/10 overflow-hidden"
        role="main"
        aria-labelledby="login-title"
      >
        <CardHeader className="space-y-6 text-center pb-6 pt-10 px-8">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 blur-2xl opacity-20 animate-pulse" />
              <Image
                src="/logo.png"
                alt="Kafkas Göçmenleri Derneği"
                width={280}
                height={224}
                priority
                quality={100}
                className="relative h-auto w-[280px] drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle
              id="login-title"
              className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent tracking-tight"
            >
              Hoş Geldiniz
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Dernek yönetim sisteminize giriş yapın
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-teal-500" />
                        <Input
                          type="text"
                          placeholder="ornek@kafkasder.org"
                          autoComplete="email"
                          className="h-12 pl-12 border-2 border-gray-200 bg-white/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 placeholder:text-gray-400 transition-all rounded-xl"
                          {...field}
                          onBlur={(e) => {
                            const trimmed = e.target.value.trim();
                            field.onChange(trimmed);
                            field.onBlur();
                          }}
                        />
                      </div>
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
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Şifre
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-teal-500" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="h-12 pl-12 pr-12 border-2 border-gray-200 bg-white/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 placeholder:text-gray-400 transition-all rounded-xl"
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
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me */}
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
                          className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                          Beni hatırla
                        </FormLabel>
                      </div>
                      <Button
                        variant="link"
                        type="button"
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 p-0 h-auto"
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
                className="w-full h-12 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold text-base shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
                loading={isLoading}
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </Form>

          {/* Demo Info */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-cyan-400/10 to-teal-400/10 blur-xl" />
            <div className="relative rounded-2xl border-2 border-teal-200/50 bg-gradient-to-br from-teal-50/80 via-cyan-50/60 to-teal-50/80 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="relative">
                  <Sparkles className="h-5 w-5 text-teal-600 animate-pulse" />
                  <div className="absolute inset-0 bg-teal-400 blur-md opacity-50" />
                </div>
                <span className="text-sm font-bold text-teal-700 tracking-wide">
                  DEMO MODU
                </span>
              </div>
              <p className="text-center text-sm text-gray-600 leading-relaxed">
                Herhangi bir e-posta ve{" "}
                <span className="font-semibold text-teal-700">
                  6+ karakterli
                </span>{" "}
                şifre ile giriş yapabilirsiniz
              </p>
              <div className="mt-3 pt-3 border-t border-teal-200/50">
                <p className="text-xs text-center text-gray-500">
                  Örnek: demo@test.com • 123456
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        © 2026 Kafkas Göçmenleri Derneği. Tüm hakları saklıdır.
      </div>
    </div>
  );
}
