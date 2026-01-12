import { z } from 'zod'

// TC Kimlik No checksum validation algorithm
function validateTCKimlik(tcKimlik: string): boolean {
  // Must be 11 digits
  if (tcKimlik.length !== 11) return false

  // Must be all numeric
  if (!/^[0-9]+$/.test(tcKimlik)) return false

  // First digit cannot be 0
  if (tcKimlik[0] === '0') return false

  const digits = tcKimlik.split('').map(Number)

  // Calculate 10th digit checksum
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  let digit10 = ((oddSum * 7) - evenSum) % 10
  if (digit10 < 0) digit10 += 10 // Handle negative modulo

  if (digit10 !== digits[9]) return false

  // Calculate 11th digit checksum
  const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0)
  const digit11 = sumFirst10 % 10

  if (digit11 !== digits[10]) return false

  return true
}

// Common validators
export const phoneSchema = z.string()
    .regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz')
    .or(z.literal(''))
    .optional()

export const tcKimlikSchema = z.string()
    .length(11, 'TC Kimlik numarası 11 haneli olmalıdır')
    .regex(/^[0-9]+$/, 'TC Kimlik numarası sadece rakamlardan oluşmalıdır')
    .refine((val) => validateTCKimlik(val), 'Geçersiz TC Kimlik numarası')

export const emailSchema = z.string()
    .email('Geçerli bir e-posta adresi giriniz')
    .or(z.literal(''))
    .optional()

// Donation form schema
export const donationSchema = z.object({
    bagisci: z.object({
        ad: z.string()
            .min(2, 'Ad en az 2 karakter olmalıdır')
            .max(50, 'Ad en fazla 50 karakter olabilir'),
        soyad: z.string()
            .min(2, 'Soyad en az 2 karakter olmalıdır')
            .max(50, 'Soyad en fazla 50 karakter olabilir'),
        telefon: phoneSchema,
        email: emailSchema,
        adres: z.string().max(200, 'Adres en fazla 200 karakter olabilir').optional()
    }),
    tutar: z.number()
        .positive('Tutar pozitif bir sayı olmalıdır')
        .min(1, 'Minimum bağış tutarı 1 TL'),
    currency: z.enum(['TRY', 'USD', 'EUR']),
    amac: z.enum(['genel', 'egitim', 'saglik', 'insani-yardim', 'kurban', 'fitre-zekat']),
    odemeYontemi: z.enum(['nakit', 'havale', 'kredi-karti', 'mobil-odeme']),
    makbuzNo: z.string().optional(),
    aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir').optional()
})

export type DonationFormData = z.infer<typeof donationSchema>

// Member form schema
export const memberSchema = z.object({
    tcKimlikNo: tcKimlikSchema,
    ad: z.string()
        .min(2, 'Ad en az 2 karakter olmalıdır')
        .max(50, 'Ad en fazla 50 karakter olabilir'),
    soyad: z.string()
        .min(2, 'Soyad en az 2 karakter olmalıdır')
        .max(50, 'Soyad en fazla 50 karakter olabilir'),
    dogumTarihi: z.string()
        .optional()
        .or(z.literal(''))
        .refine((val) => {
            // If empty, it's valid (optional field)
            if (!val || val === '' || val === 'invalid-date') {
                return true
            }
            // Check if it's a valid date string in yyyy-MM-dd format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            if (!dateRegex.test(val)) {
                return false
            }
            // Check if it's a valid date
            const date = new Date(val)
            return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === val
        }, 'Geçerli bir tarih giriniz (yyyy-MM-dd formatında)'),
    cinsiyet: z.enum(['erkek', 'kadin']),
    telefon: z.string()
        .min(1, 'Telefon numarası gereklidir')
        .refine((val) => {
            // Remove spaces, dashes, and parentheses
            const cleaned = val.replace(/[\s\-()]/g, '')
            // Check if it's a valid Turkish phone number
            // Format: 0XXXXXXXXX (11 digits) or +90XXXXXXXXXX (13 digits) or 5XXXXXXXXX (10 digits)
            return /^(\+90)?[0-9]{10,11}$/.test(cleaned)
        }, 'Geçerli bir telefon numarası giriniz (örn: 05551234567)'),
    email: emailSchema,
    adres: z.object({
        il: z.string().min(1, 'İl seçiniz'),
        ilce: z.string().min(1, 'İlçe giriniz'),
        mahalle: z.string().optional().or(z.literal('')),
        acikAdres: z.string().optional().or(z.literal(''))
    }),
    uyeTuru: z.enum(['aktif', 'onursal', 'genc', 'destekci'])
})

export type MemberFormData = z.infer<typeof memberSchema>

// Social aid application schema
export const socialAidApplicationSchema = z.object({
    basvuranKisi: z.object({
        ad: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
        soyad: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
        tcKimlikNo: tcKimlikSchema,
        telefon: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
        adres: z.string().min(10, 'Adres en az 10 karakter olmalıdır')
    }),
    yardimTuru: z.enum(['ayni', 'nakdi', 'egitim', 'saglik', 'kira', 'fatura']),
    talepEdilenTutar: z.number()
        .positive('Tutar pozitif olmalıdır')
        .optional(),
    gerekce: z.string()
        .min(20, 'Gerekçe en az 20 karakter olmalıdır')
        .max(1000, 'Gerekçe en fazla 1000 karakter olabilir')
})

export type SocialAidApplicationFormData = z.infer<typeof socialAidApplicationSchema>

// Login form schema - very flexible for demo purposes
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'E-posta adresi gereklidir')
        .refine((val) => {
            // For demo: accept any non-empty string (even without @)
            const trimmed = (val || '').trim()
            return trimmed.length >= 1
        }, 'E-posta adresi gereklidir'),
    password: z.string()
        .min(1, 'Şifre gereklidir')
        .refine((val) => {
            // For demo: accept any string with at least 6 characters
            const trimmed = (val || '').trim()
            return trimmed.length >= 6
        }, 'Şifre en az 6 karakter olmalıdır'),
    rememberMe: z.boolean().optional()
})

export type LoginFormData = z.infer<typeof loginSchema>

// Kumbara form schema
export const kumbaraSchema = z.object({
    kod: z.string()
        .min(3, 'Kumbara kodu en az 3 karakter olmalıdır'),
    konum: z.string()
        .min(5, 'Konum en az 5 karakter olmalıdır'),
    sorumluId: z.string()
        .min(1, 'Sorumlu seçiniz'),
    notlar: z.string()
        .max(500, 'Notlar en fazla 500 karakter olabilir')
        .optional()
})

export type KumbaraFormData = z.infer<typeof kumbaraSchema>

// Payment approval schema
export const paymentApprovalSchema = z.object({
    tutar: z.number()
        .positive('Tutar pozitif olmalıdır'),
    odemeYontemi: z.enum(['nakit', 'havale', 'kredi-karti', 'mobil-odeme']),
    aciklama: z.string().optional()
})

export type PaymentApprovalFormData = z.infer<typeof paymentApprovalSchema>

// Settings schemas
export const generalSettingsSchema = z.object({
    dernekAdi: z.string().min(3, 'Dernek adı en az 3 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    telefon: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
    adres: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
    aidatTutari: z.number().positive('Aidat tutarı pozitif olmalıdır')
})

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>

// Basic beneficiary schema for quick registration
export const basicBeneficiarySchema = z.object({
    tcKimlikNo: tcKimlikSchema,
    ad: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    soyad: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    telefon: phoneSchema
})

export type BasicBeneficiaryFormData = z.infer<typeof basicBeneficiarySchema>

// Detailed beneficiary schema for full profile management
export const beneficiarySchema = z.object({
    // Temel Bilgiler
    ad: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    soyad: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    uyruk: z.string().min(1, 'Uyruk seçiniz'),
    tcKimlikNo: z.string().optional(),
    yabanciKimlikNo: z.string().optional(),
    kategori: z.enum(['yetiskin', 'cocuk', 'yetim', 'saglik', 'egitim', 'engelli']),
    fonBolgesi: z.string().optional(),
    dosyaBaglantisi: z.string().optional(),
    mernisDogrulama: z.boolean().optional(),

    // İletişim Bilgileri
    cepTelefonu: z.string().optional(),
    cepTelefonuOperator: z.string().optional(),
    sabitTelefon: z.string().optional(),
    yurtdisiTelefon: z.string().optional(),
    email: emailSchema,

    // Adres Bilgileri
    ulke: z.string().min(1, 'Ülke seçiniz'),
    sehir: z.string().min(1, 'Şehir seçiniz'),
    ilce: z.string().optional(),
    mahalle: z.string().optional(),
    adres: z.string().optional(),

    // Kimlik Bilgileri
    kimlikBilgileri: z.object({
        babaAdi: z.string().optional(),
        anneAdi: z.string().optional(),
        belgeTuru: z.string().optional(),
        belgeGecerlilikTarihi: z.date().optional(),
        seriNumarasi: z.string().optional(),
        oncekiUyruk: z.string().optional(),
        oncekiIsim: z.string().optional()
    }).optional(),

    // Pasaport ve Vize Bilgileri
    pasaportVizeBilgileri: z.object({
        pasaportTuru: z.string().optional(),
        pasaportNumarasi: z.string().optional(),
        pasaportGecerlilikTarihi: z.date().optional(),
        vizeGirisTuru: z.string().optional(),
        vizeBitisTarihi: z.date().optional()
    }).optional(),

    // Sağlık Bilgileri
    saglikBilgileri: z.object({
        kanGrubu: z.string().optional(),
        kronikHastalik: z.string().optional(),
        engelDurumu: z.string().optional(),
        engelOrani: z.number().min(0).max(100).optional(),
        surekliIlac: z.string().optional()
    }).optional(),

    // Ekonomik Durum
    ekonomikDurum: z.object({
        egitimDurumu: z.string().optional(),
        meslek: z.string().optional(),
        calismaDurumu: z.string().optional(),
        aylikGelir: z.number().min(0).optional(),
        konutDurumu: z.string().optional(),
        kiraTutari: z.number().min(0).optional()
    }).optional(),

    // Aile ve Hane Bilgileri
    aileHaneBilgileri: z.object({
        medeniHal: z.string().optional(),
        esAdi: z.string().optional(),
        esTelefon: z.string().optional(),
        ailedekiKisiSayisi: z.number().min(1).optional(),
        cocukSayisi: z.number().min(0).optional(),
        yetimSayisi: z.number().min(0).optional(),
        calısanSayisi: z.number().min(0).optional(),
        bakmaklaYukumluSayisi: z.number().min(0).optional()
    }).optional(),

    // Sponsorluk ve Durum
    sponsorlukTipi: z.enum(['bireysel', 'kurumsal', 'yok']).optional(),
    durum: z.enum(['aktif', 'pasif', 'arsiv']).optional().default('aktif'),
    rizaBeyaniDurumu: z.enum(['alinmadi', 'alindi', 'reddetti']).optional(),

    // Notlar
    notlar: z.string().max(2000, 'Notlar en fazla 2000 karakter olabilir').optional()
})

export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>

// Gelir-Gider form schema
export const gelirGiderSchema = z.object({
  islemTuru: z.enum(['gelir', 'gider']),
  kategori: z.string().min(1, 'Kategori seçiniz'),
  tutar: z.number()
    .positive('Tutar pozitif bir sayı olmalıdır')
    .min(0.01, 'Minimum tutar 0.01'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  aciklama: z.string()
    .min(5, 'Açıklama en az 5 karakter olmalıdır')
    .max(500, 'Açıklama en fazla 500 karakter olabilir'),
  tarih: z.string().min(1, 'Tarih gereklidir'),
  odemeYontemi: z.enum(['nakit', 'havale', 'kredi-karti', 'mobil-odeme']),
  makbuzNo: z.string().optional(),
  faturaNo: z.string().optional(),
  ilgiliKisi: z.string().max(100, 'İlgili kişi en fazla 100 karakter olabilir').optional(),
  referansId: z.string().optional(),
})

export type GelirGiderFormData = z.infer<typeof gelirGiderSchema>

// Vezne (Cash Treasury) form schemas
export const vezneSchema = z.object({
  ad: z.string()
    .min(3, 'Vezne adı en az 3 karakter olmalıdır')
    .max(100, 'Vezne adı en fazla 100 karakter olabilir'),
  kod: z.string()
    .min(2, 'Vezne kodu en az 2 karakter olmalıdır')
    .max(20, 'Vezne kodu en fazla 20 karakter olabilir')
    .regex(/^[A-Z0-9-]+$/, 'Kod sadece büyük harf, rakam ve tire içerebilir'),
  sorumluId: z.string()
    .min(1, 'Sorumlu seçiniz'),
  durum: z.enum(['aktif', 'blokeli', 'kapali']).default('aktif'),
  konum: z.string()
    .max(200, 'Konum en fazla 200 karakter olabilir')
    .optional(),
  gunlukLimit: z.number()
    .positive('Limit pozitif olmalıdır')
    .optional(),
  notlar: z.string()
    .max(500, 'Notlar en fazla 500 karakter olabilir')
    .optional(),
})

export type VezneFormData = z.infer<typeof vezneSchema>

export const vezneIslemSchema = z.object({
  vezneId: z.string()
    .min(1, 'Vezne seçiniz'),
  islemTuru: z.enum(['giris', 'cikis', 'transfer']),
  tutar: z.number()
    .positive('Tutar pozitif bir sayı olmalıdır')
    .min(0.01, 'Minimum tutar 0.01'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  aciklama: z.string()
    .min(5, 'Açıklama en az 5 karakter olmalıdır')
    .max(500, 'Açıklama en fazla 500 karakter olabilir'),
  odemeYontemi: z.enum(['nakit', 'havale', 'kredi-karti', 'mobil-odeme']),
  makbuzNo: z.string().optional(),
  referansId: z.string().optional(),
  ilgiliKisi: z.string()
    .max(100, 'İlgili kişi en fazla 100 karakter olabilir')
    .optional(),
  hedefVezneId: z.string().optional(), // Transfer işlemleri için
})

export type VezneIslemFormData = z.infer<typeof vezneIslemSchema>

// Banka Ödeme Emri (Payment Order) schema
export const odemeEmriSchema = z.object({
  gonderici: z.object({
    hesapAdi: z.string().min(1, 'Hesap adı gereklidir'),
    iban: z.string().min(26, 'Geçerli bir IBAN giriniz').max(32, 'Geçerli bir IBAN giriniz'),
    bankaAdi: z.string().min(1, 'Banka adı gereklidir'),
    subeAdi: z.string().optional(),
    hesapNo: z.string().optional(),
  }),
  alici: z.object({
    ad: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    soyad: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    tcKimlikNo: z.string().optional(),
    vergiNo: z.string().optional(),
    iban: z.string().min(26, 'Geçerli bir IBAN giriniz').max(32, 'Geçerli bir IBAN giriniz'),
    bankaAdi: z.string().min(1, 'Banka adı gereklidir'),
    subeAdi: z.string().optional(),
    hesapNo: z.string().optional(),
  }).refine(data => data.tcKimlikNo || data.vergiNo, {
    message: 'TC Kimlik No veya Vergi No girilmelidir',
    path: ['tcKimlikNo']
  }),
  tutar: z.number()
    .positive('Tutar pozitif bir sayı olmalıdır')
    .min(1, 'Minimum tutar 1 TL'),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  odemeEmriTuru: z.enum(['havale', 'eft', 'fast', 'swift']),
  aciklama: z.string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(500, 'Açıklama en fazla 500 karakter olabilir'),
  referansId: z.string().optional(),
  notlar: z.string()
    .max(500, 'Notlar en fazla 500 karakter olabilir')
    .optional(),
})

export type OdemeEmriFormData = z.infer<typeof odemeEmriSchema>
