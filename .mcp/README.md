# MCP (Model Context Protocol) Yapılandırması

Bu proje, AI asistanlarının daha etkili çalışabilmesi için MCP server'ları destekler.

## Kurulu MCP Server'lar

### 1. Supabase MCP

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

### 2. Filesystem MCP

Proje dosyalarına erişim sağlar.

**Erişim İzinleri:**

- `src/` - Kaynak kodlar
- `public/` - Statik dosyalar
- `supabase/` - Supabase migrations

### 3. GitHub MCP

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

### 4. Memory MCP

Kalıcı bellek ve context yönetimi.

**Özellikler:**

- Oturum arası bilgi saklama
- Context hatırlama
- Proje bilgisi depolama

## Kullanım

### Claude Desktop

1. `claude_desktop_config.json` dosyasını düzenleyin:
   - `YOUR_SUPABASE_URL` → Gerçek Supabase URL
   - `YOUR_SUPABASE_SERVICE_ROLE_KEY` → Service Role Key
   - `YOUR_GITHUB_TOKEN` → GitHub PAT

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

## Güvenlik Notları

⚠️ **ÖNEMLİ:**

- `SUPABASE_SERVICE_ROLE_KEY` asla client-side'da kullanılmamalı
- `.env` dosyası asla commit edilmemeli
- GitHub token'ı minimum gerekli scope'larla oluşturun

## Sorun Giderme

### MCP Server Başlamıyor

```bash
# npx cache temizle
npx clear-npx-cache

# Bağımlılıkları yeniden yükle
npm install
```

### Supabase Bağlantı Hatası

- URL'in `https://` ile başladığından emin olun
- Service Role Key'in doğru olduğunu kontrol edin
- Supabase projesinin aktif olduğunu doğrulayın

### GitHub Token Hatası

- Token'ın süresinin dolmadığını kontrol edin
- Gerekli scope'ların verildiğini doğrulayın
