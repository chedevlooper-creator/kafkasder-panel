"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Building2,
  Database,
  Globe,
  Save,
  Shield,
  User,
  Palette,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  MapPin,
  Link,
  Calendar,
  CheckCircle2,
  DollarSign,
  Settings,
  Monitor,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    newMember: true,
    donation: true,
    socialAid: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const [display, setDisplay] = useState({
    theme: "system",
    language: "tr",
    dateFormat: "DD/MM/YYYY",
    currency: "TRY",
    itemsPerPage: 25,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const [organization, setOrganization] = useState({
    name: "KafkasDer - Kafkas Muhacirler Derneği",
    shortName: "KafkasDer",
    phone: "+90 212 XXX XX XX",
    email: "info@kafkasder.org",
    website: "https://kafkasder.org",
    address: "İstanbul, Türkiye",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = (section: string) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(`${section} ayarları kaydedildi`);
      setIsLoading(false);
    }, 500);
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Şifre başarıyla değiştirildi");
      setPasswords({ current: "", new: "", confirm: "" });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportSettings = () => {
    const data = { notifications, display, organization };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kafkasder-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    toast.success("Ayarlar dışa aktarıldı");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Sistem ve uygulama ayarlarını yapılandırın"
      />

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2">
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Kurum</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Bildirimler</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Görünüm</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Güvenlik</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sistem</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Kurum Bilgileri
              </CardTitle>
              <CardDescription>
                Dernek ve kurum bilgilerini düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    KD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label>Kurum Logosu</Label>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Logo Yükle
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG veya JPG, max 2MB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Kurum Adı</Label>
                  <Input
                    id="org-name"
                    value={organization.name}
                    onChange={(e) =>
                      setOrganization({ ...organization, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-short">Kısa Ad</Label>
                  <Input
                    id="org-short"
                    value={organization.shortName}
                    onChange={(e) =>
                      setOrganization({
                        ...organization,
                        shortName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-phone">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telefon
                  </Label>
                  <Input
                    id="org-phone"
                    value={organization.phone}
                    onChange={(e) =>
                      setOrganization({
                        ...organization,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    E-posta
                  </Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={organization.email}
                    onChange={(e) =>
                      setOrganization({
                        ...organization,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="org-website">
                    <Link className="inline h-4 w-4 mr-1" />
                    Website
                  </Label>
                  <Input
                    id="org-website"
                    value={organization.website}
                    onChange={(e) =>
                      setOrganization({
                        ...organization,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="org-address">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Adres
                  </Label>
                  <Textarea
                    id="org-address"
                    value={organization.address}
                    onChange={(e) =>
                      setOrganization({
                        ...organization,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Kurum")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Bildirim Kanalları
              </CardTitle>
              <CardDescription>
                Hangi kanallardan bildirim almak istediğinizi seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">E-posta Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Önemli güncellemeler için e-posta alın
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Tarayıcı push bildirimleri alın
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Acil durumlar için SMS alın
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <Label>Yeni Üye Kaydı</Label>
                <Switch
                  checked={notifications.newMember}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newMember: checked })
                    }
                  />
                </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <Label>Bağış Bildirimleri</Label>
                <Switch
                  checked={notifications.donation}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, donation: checked })
                    }
                  />
                </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <Label>Sosyal Yardım</Label>
                <Switch
                  checked={notifications.socialAid}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, socialAid: checked })
                    }
                  />
                </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <Label>Aylık Rapor</Label>
                <Switch
                  checked={notifications.monthlyReport}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        monthlyReport: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Bildirim")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Görünüm Ayarları
              </CardTitle>
              <CardDescription>Arayüz görünümünü özelleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Tema</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setDisplay({ ...display, theme: "light" })}
                    className={`p-4 rounded-lg border-2 transition-all ${display.theme === "light" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
                  >
                    <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <span className="text-sm font-medium">Açık</span>
                  </button>
                  <button
                    onClick={() => setDisplay({ ...display, theme: "dark" })}
                    className={`p-4 rounded-lg border-2 transition-all ${display.theme === "dark" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
                  >
                    <Moon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <span className="text-sm font-medium">Koyu</span>
                  </button>
                  <button
                    onClick={() => setDisplay({ ...display, theme: "system" })}
                    className={`p-4 rounded-lg border-2 transition-all ${display.theme === "system" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
                  >
                    <Monitor className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Sistem</span>
                  </button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Dil
                  </Label>
                  <Select
                    value={display.language}
                    onValueChange={(value) =>
                      setDisplay({ ...display, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Tarih Formatı
                  </Label>
                  <Select
                    value={display.dateFormat}
                    onValueChange={(value) =>
                      setDisplay({ ...display, dateFormat: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">09/01/2026</SelectItem>
                      <SelectItem value="MM/DD/YYYY">01/09/2026</SelectItem>
                      <SelectItem value="YYYY-MM-DD">2026-01-09</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Para Birimi
                  </Label>
                  <Select
                    value={display.currency}
                    onValueChange={(value) =>
                      setDisplay({ ...display, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">₺ Türk Lirası</SelectItem>
                      <SelectItem value="USD">$ Dolar</SelectItem>
                      <SelectItem value="EUR">€ Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">Sayfa Başına Öğe</Label>
                  <Select
                    value={String(display.itemsPerPage)}
                    onValueChange={(value) =>
                      setDisplay({ ...display, itemsPerPage: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 öğe</SelectItem>
                      <SelectItem value="25">25 öğe</SelectItem>
                      <SelectItem value="50">50 öğe</SelectItem>
                      <SelectItem value="100">100 öğe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Görünüm")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Şifre Değiştir
              </CardTitle>
              <CardDescription>Hesap şifrenizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mevcut Şifre</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yeni Şifre</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={isLoading || !passwords.current || !passwords.new}
              >
                <Lock className="mr-2 h-4 w-4" />
                Şifreyi Güncelle
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Güvenlik Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-base">İki Faktörlü Doğrulama</Label>
                    <Badge
                      variant={security.twoFactor ? "default" : "secondary"}
                    >
                      {security.twoFactor ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Giriş yaparken ek güvenlik katmanı
                  </p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, twoFactor: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Giriş Uyarıları</Label>
                  <p className="text-sm text-muted-foreground">
                    Yeni cihazdan giriş yapıldığında bildirim al
                  </p>
                </div>
                <Switch
                  checked={security.loginAlerts}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, loginAlerts: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Oturum Zaman Aşımı</Label>
                <Select
                  value={String(security.sessionTimeout)}
                  onValueChange={(value) =>
                    setSecurity({ ...security, sessionTimeout: Number(value) })
                  }
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 dakika</SelectItem>
                    <SelectItem value="30">30 dakika</SelectItem>
                    <SelectItem value="60">1 saat</SelectItem>
                    <SelectItem value="120">2 saat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Güvenlik")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Sistem Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Veritabanı</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bağlı</p>
                </div>
                <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">API Servisi</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Aktif</p>
                </div>
                <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Depolama</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    %23 kullanımda
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Veri Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportSettings}>
                  <Download className="mr-2 h-4 w-4" />
                  Ayarları Dışa Aktar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    AK
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label>Profil Fotoğrafı</Label>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Fotoğraf Yükle
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Ad Soyad</Label>
                  <Input id="user-name" defaultValue="Admin Kullanıcı" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">E-posta</Label>
                  <Input
                    id="user-email"
                    type="email"
                    defaultValue="admin@kafkasder.org"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-phone">Telefon</Label>
                  <Input
                    id="user-phone"
                    type="tel"
                    defaultValue="+90 555 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Rol</Label>
                  <Input id="user-role" defaultValue="Yönetici" disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Profil")}>
                  <Save className="mr-2 h-4 w-4" />
                  Profili Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
