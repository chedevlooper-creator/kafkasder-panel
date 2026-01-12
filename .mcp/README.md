# MCP (Model Context Protocol) Yapılandırması

Bu proje, AI asistanlarının daha etkili çalışabilmesi için MCP server'ları destekler.

## Kurulu MCP Server'lar

### 1. Shadcn MCP 🎨

Shadcn/UI component registry ve tema entegrasyonu.

**Özellikler:**

- Component yükleme ve güncelleme
- Tema değişiklikleri (tweakcn.com)
- Custom registry desteği
- Component preview

**Kurulum:**

```bash
# Registry URL (tweakcn themes için)
REGISTRY_URL=https://tweakcn.com/r/themes/registry.json
```

**Kullanım:**

- "Install shadcn button component"
- "Apply tweakcn theme to project"
- "Update all shadcn components"

### 2. Supabase MCP

Veritabanı işlemleri için Supabase entegrasyonu.

**Özellikler:**

- Tablo oluşturma/düzenleme
- RLS politikaları yönetimi
- SQL sorguları çalıştırma
- Migrations yönetimi

**Kurulum:**

```bash
# Service Role Key gerekli (anon key değil!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Vercel MCP

Vercel deployment ve proje yönetimi.

**Özellikler:**

- Deploy işlemleri
- Environment variables yönetimi
- Domain ayarları
- Build logs

**Kurulum:**

```bash
# Vercel API Token
VERCEL_TOKEN=your_vercel_token
```

### 4. Filesystem MCP

Proje dosyalarına erişim sağlar.

**Erişim İzinleri:**

- `src/` - Kaynak kodlar
- `public/` - Statik dosyalar
- `supabase/` - Supabase migrations

### 5. GitHub MCP

GitHub entegrasyonu için.

**Özellikler:**

- Issue oluşturma/düzenleme
- PR yönetimi
- Repository bilgileri
- Commit geçmişi

**Kurulum:**

```bash
# Personal Access Token gerekli
# Scopes: repo, read:org, read:user
GITHUB_TOKEN=your_github_token
```

### 6. Memory MCP

Kalıcı bellek ve context yönetimi.

**Özellikler:**

- Oturum arası bilgi saklama
- Context hatırlama
- Proje bilgisi depolama

## Kullanım

### Claude Desktop

1. `claude_desktop_config.json` dosyasını düzenleyin:
   - Tokenları gerçek değerlerle değiştirin

2. Dosyayı Claude Desktop config klasörüne kopyalayın:

   ```bash
   # macOS
   cp .mcp/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Windows
   copy .mcp\claude_desktop_config.json %APPDATA%\Claude\claude_desktop_config.json
   ```

3. Claude Desktop'ı yeniden başlatın.

### VS Code / Cursor

`.mcp/config.json` dosyası otomatik olarak kullanılır. Environment variable'ları `.env` dosyasında tanımlayın.

### OpenCode CLI

```bash
# MCP server'ları başlat
opencode --mcp-config .mcp/config.json
```

## Örnek Kullanımlar

### Shadcn Tema Uygulama

```
Claude: "Apply the nbbbbbbbbb theme from tweakcn to the project"
```

### Component Yükleme

```
Claude: "Install shadcn card and dialog components"
```

### Vercel Deploy

```
Claude: "Deploy to production on Vercel"
```

### Supabase Tablo Oluşturma

```
Claude: "Create a new members table in Supabase with RLS"
```

## Güvenlik Notları

⚠️ **ÖNEMLİ:**

- `SUPABASE_SERVICE_ROLE_KEY` asla client-side'da kullanılmamalı
- `.env` dosyası asla commit edilmemeli
- Token'ları minimum gerekli scope'larla oluşturun

## Sorun Giderme

### MCP Server Başlamıyor

```bash
# npx cache temizle
npx clear-npx-cache

# Bağımlılıkları yeniden yükle
npm install
```

### Shadcn MCP Bağlantı Hatası

- Registry URL'in doğru olduğunu kontrol edin
- `shadcn@canary` versiyonunu kullandığınızdan emin olun

### Supabase Bağlantı Hatası

- URL'in `https://` ile başladığından emin olun
- Service Role Key'in doğru olduğunu kontrol edin
- Supabase projesinin aktif olduğunu doğrulayın

### GitHub Token Hatası

- Token'ın süresinin dolmadığını kontrol edin
- Gerekli scope'ların verildiğini doğrulayın
