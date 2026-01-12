"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
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

// LoginPage components

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
  async function onSubmit(data: LoginFormData) {
    const success = await login(data.email, data.password);

    if (success) {
      toast.success("Giriş başarılı");
      router.push("/genel");
    } else {
      toast.error(error || "Giriş başarısız");
    }
  }

  return (
    <Card
      className="w-full max-w-md overflow-hidden border border-teal-100 bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.5)] animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
      role="main"
      aria-labelledby="login-title"
    >
      <CardHeader className="space-y-4 text-center pb-4 pt-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Kafkas Göçmenleri Derneği Logosu"
            width={350}
            height={280}
            priority
            quality={100}
            className="h-auto w-[320px] drop-shadow-lg"
          />
        </div>

        <div className="space-y-2 pt-2">
          <CardTitle
            id="login-title"
            className="text-3xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 bg-clip-text text-transparent"
          >
            Hoş Geldiniz
          </CardTitle>
          <CardDescription className="text-gray-600">
            Dernek yönetim panelinize giriş yapın
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-700">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    E-posta
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="ornek@kafkasder.org veya demo"
                      autoComplete="email"
                      className="h-12 border-2 border-gray-300 bg-white focus:border-teal-500 focus:ring-teal-500/20 placeholder:text-gray-400 transition-all rounded-lg"
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Şifre
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-12 border-2 border-gray-300 bg-white focus:border-teal-500 focus:ring-teal-500/20 placeholder:text-gray-400 pr-12 transition-all rounded-lg"
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
                        className="absolute top-1/2 -translate-y-1/2 right-1 h-10 w-10 hover:bg-gray-100 rounded-lg"
                        aria-label={
                          showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                        }
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="text-gray-500 h-5 w-5" />
                        ) : (
                          <Eye className="text-gray-500 h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
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
                      className="cursor-pointer text-sm font-normal text-gray-600"
                    >
                      Beni hatırla
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold text-base shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 hover:-translate-y-0.5"
              loading={isLoading}
            >
              {isLoading ? (
                "Giriş yapılıyor..."
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-5 text-center">
          <Button
            variant="link"
            className="text-teal-600 hover:text-teal-700 text-sm font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-md"
            aria-label="Şifre sıfırlama sayfasına git"
          >
            Şifrenizi mi unuttunuz?
          </Button>
        </div>

        {/* Demo credentials hint - daha görünür */}
        <div className="mt-6 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700">
              Demo Modu
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Herhangi bir e-posta ve 6+ karakterli şifre ile giriş yapabilirsiniz
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
