/**
 * 🎨 SHADCN/UI DASHBOARD TASARIM STANDARDI
 * 
 * Bu dosya shadcn/ui resmi dashboard örneklerine göre
 * tutarlı tasarım sağlamak için sabit değerler tanımlar.
 * 
 * Referans: https://ui.shadcn.com/examples/dashboard
 * 
 * Her sayfa bu standartı kullanmalı:
 * - Card component'leri
 * - CardHeader + CardContent yapısı
 * - Tutalı rounded, border, shadow değerleri
 */

/**
 * 🔲 BORDER RADIUS (Köşe Yuvarlaklığı)
 * Shadcn/ui standardı:
 * - Card'lar: rounded-xl
 * - DataTable/Table: rounded-md
 * - Butonlar: rounded-md
 * - Avatar/Badge: rounded-full
 */
export const RADIUS = {
  card: "rounded-xl",        // Ana kartlar (shadcn default)
  table: "rounded-md",       // DataTable, Table (shadcn default)
  button: "rounded-md",      // Butonlar (shadcn default)
  input: "rounded-md",       // Inputlar (shadcn default)
  avatar: "rounded-full",    // Avatarlar, badge'ler
} as const;

/**
 * 🎨 BORDER (Çerçeve)
 * Shadcn/ui standardı:
 * - Standart: border (subtle)
 * - Table: border (shadcn default)
 */
export const BORDER = {
  default: "border",                  // Standart border (shadcn default)
  subtle: "border-border/50",         // Hafif border
  none: "border-0",                   // Border yok
} as const;

/**
 * 🌈 BACKGROUND (Arkaplan)
 * Shadcn/ui standardı:
 * - Card: bg-card
 * - Muted: bg-muted
 */
export const BG = {
  card: "bg-card",                    // Ana kart (shadcn default)
  muted: "bg-muted",                  // Muted background
  accent: "bg-accent",                // Accent background
} as const;

/**
 * 🎯 SHADOW (Gölge)
 * Shadcn/ui standardı:
 * - Card: shadow-sm (default)
 * - Hover: shadow-md
 * - Modal: shadow-lg
 */
export const SHADOW = {
  none: "shadow-none",
  sm: "shadow-sm",                    // Card default (shadcn)
  md: "shadow-md",                    // Hover state
  lg: "shadow-lg",                    // Modal/dropdown
} as const;

/**
 * 📏 CARD STYLES (Shadcn Card Component Wrapper)
 * Shadcn/ui Card zaten bu değerlere sahip, bu sadece referans için
 * 
 * Kullanım: <Card> (component zaten doğru değerlere sahip)
 */
export const CARD_STYLES = {
  /**
   * Shadcn Card component default değerleri
   * Component zaten bunlara sahip, manuel eklemeye gerek yok
   */
  base: "bg-card text-card-foreground rounded-xl border shadow-sm",
} as const;

/**
 * 🎨 PADDING (İç Boşluk)
 */
export const PADDING = {
  card: "p-6",
  compact: "p-4",
  dense: "p-3",
} as const;

/**
 * 📊 HEADER STYLES (Sayfa başlıkları)
 */
export const HEADER_STYLES = {
  base: "border-b border-border/50 bg-muted/30 pb-4",
  icon: "h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80",
} as const;

/**
 * 🔲 GRADIENT STYLES (Gradient kullanımı - SADECE özel durumlar)
 * ⚠️ DİKKAT: Gradient sadece hero section ve special cards için!
 * Normal kartlarda KULLANMAYIN!
 */
export const GRADIENT = {
  primary: "bg-gradient-to-br from-primary to-primary/80",
  warning: "bg-gradient-to-br from-warning to-destructive",
  success: "bg-gradient-to-br from-success to-primary",
  hero: "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
  accent: "bg-gradient-to-br from-accent/10 to-background",
} as const;

/**
 * 🎯 UTILITY CLASSES (Yardımcı sınıflar)
 */
export const UTILS = {
  // Fade in animasyonu
  fadeIn: "animate-in fade-in duration-300",

  // Glass effect
  glass: "backdrop-blur-sm bg-card/50",

  // Glow effect
  glow: "hover-glow",

  // Truncate text
  truncate: "truncate",
} as const;

/**
 * 📋 KART BİLEŞENİ ŞABLONLARI
 * 
 * Tüm sayfalar bu şablonları kullanmalı:
 * 
 * 1. Standart Kart:
 *    <Card className={CARD_STYLES.base}>
 *      <CardHeader className={HEADER_STYLES.base}>
 *        ...
 *      </CardHeader>
 *      <CardContent className={PADDING.card}>
 *        ...
 *      </CardContent>
 *    </Card>
 * 
 * 2. Liste Item (tablo satırları, list items):
 *    <div className={CARD_STYLES.listItem}>
 *      ...
 *    </div>
 * 
 * 3. Interactive Kart (hover efektli):
 *    <div className={CARD_STYLES.interactive}>
 *      ...
 *    </div>
 */

/**
 * ⚠️ YASAKLAR:
 * 
 * ❌ rounded-2xl (sadece hero/dialog için)
 * ❌ rounded-sm (çok keskin)
 * ❌ bg-gradient-* (sadece özel durumlar)
 * ❌ border-border/30 (subtle kullan)
 * ❌ scale-[1.02] manuel (HOVER.interactive kullan)
 * ❌ manuel shadow değerleri (SHADOW.* kullan)
 * 
 * ✅ HER ZAMAN KULLAN:
 * ✅ CARD_STYLES.base / interactive / listItem
 * ✅ RADIUS.card / button / avatar
 * ✅ BORDER.default / hover
 * ✅ HEADER_STYLES.base
 */
