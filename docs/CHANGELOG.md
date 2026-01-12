# Changelog

Tüm önemli değişiklikler bu dosyada dokümante edilir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardına dayanır ve proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanır.

## [Unreleased]

### Planlanan
- Toplu SMS bildirimi
- Mobil uygulama entegrasyonu
- Gelişmiş raporlama modülü

## [0.1.0] - 2026-01-10

### Eklenen ✨
- **Üye Yönetimi**: Aktif, onursal ve genç üyeler için CRUD operasyonları
- **Bağış Yönetimi**: Nakit, havale ve kart ödemeleri takibi
- **Sosyal Yardım**: Başvuru, değerlendirme ve ödeme sistemi
- **QR Kod Sistemi**: Kumbara takibi için QR kod okuyucu
- **Dashboard**: İstatistikler ve grafiklerle genel durum görüntüleme
- **Excel İçe/Dışa Aktarma**: Veri yönetimi için Excel entegrasyonu
- **Arama ve Filtreleme**: TanStack Table ile gelişmiş veri filtreleme
- **Komut Paleti**: Hızlı navigasyon için (Ctrl/Cmd + K)
- **Dark Mode**: Otomatik tema değiştirme desteği
- **Form Validasyonu**: React Hook Form + Zod entegrasyonu
- **Real-time Bildirimler**: Sonner toast bildirimleri

### Teknik İyileştirmeler 🔧
- Next.js 16 App Router mimarisi
- TypeScript strict mode aktif
- TanStack Query v5 ile server state yönetimi
- Zustand ile client state yönetimi
- Playwright E2E testleri
- Jest unit testleri (50%+ coverage)
- ESLint + Prettier entegrasyonu
- Husky pre-commit hooks
- Bundle size optimizasyonu (lazy loading)
- Turbopack ile hızlı development build

### Güvenlik 🔒
- CodeQL güvenlik taraması
- Supabase Row Level Security (RLS)
- Rol tabanlı yetkilendirme
- Input sanitization
- XSS koruması

### Dokümantasyon 📚
- README.md güncellemesi
- CONTRIBUTING.md katkı rehberi
- SUPABASE_SETUP.md kurulum rehberi
- DEPLOYMENT.md deployment rehberi
- Component API dokümantasyonu
- Style guide oluşturma

## [0.0.1] - 2025-12-01

### İlk Sürüm
- Proje başlatıldı
- Temel sayfa yapıları oluşturuldu
- Supabase entegrasyonu
- Temel UI bileşenleri

---

## Format Açıklaması

- **Added** (Eklenen): Yeni özellikler
- **Changed** (Değiştirilen): Mevcut işlevsellikte değişiklikler
- **Deprecated** (Kullanımdan Kaldırılacak): Yakında kaldırılacak özellikler
- **Removed** (Kaldırılan): Kaldırılan özellikler
- **Fixed** (Düzeltilen): Hata düzeltmeleri
- **Security** (Güvenlik): Güvenlik güncellemeleri
