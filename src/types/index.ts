// Common Types
export type Currency = 'TRY' | 'USD' | 'EUR'
export type PaymentMethod = 'nakit' | 'havale' | 'kredi-karti' | 'mobil-odeme'
export type PaymentStatus = 'beklemede' | 'tamamlandi' | 'iptal' | 'iade'

export interface Timestamps {
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Document Types
export type DocumentType = 'kimlik' | 'ikamet' | 'saglik' | 'gelir' | 'diger'

export interface BeneficiaryDocument {
  id: string
  beneficiaryId: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  documentType: DocumentType
  uploadedBy?: string
  createdAt: Date
}

export interface FileUploadOptions {
  maxSize?: number // bytes
  acceptedTypes?: string[]
  onProgress?: (progress: number) => void
}

// User Types
export type UserRole = 'admin' | 'muhasebe' | 'gorevli' | 'uye'

export type Permission =
  | 'donations.view'
  | 'donations.create'
  | 'donations.edit'
  | 'donations.delete'
  | 'members.view'
  | 'members.create'
  | 'members.edit'
  | 'social-aid.view'
  | 'social-aid.approve'
  | 'reports.export'
  | 'settings.manage'

export interface User extends Timestamps {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  permissions: Permission[]
}

// Donation (Bağış) Types
export type DonationPurpose =
  | 'genel'
  | 'egitim'
  | 'saglik'
  | 'insani-yardim'
  | 'kurban'
  | 'fitre-zekat'

export interface Bagisci {
  id: string
  ad: string
  soyad: string
  telefon?: string
  email?: string
  adres?: string
}

export interface Bagis extends Timestamps {
  id: string
  bagisci: Bagisci
  tutar: number
  currency: Currency
  amac: DonationPurpose
  odemeYontemi: PaymentMethod
  durum: PaymentStatus
  makbuzNo?: string
  aciklama?: string
  fatura?: {
    url: string
    uploadedAt: Date
  }
}

export interface BagisStats {
  toplamBagis: number
  toplamBagisci: number
  aylikOrtalama: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

// Gelir-Gider (Income-Expense) Types
export type IslemTuru = 'gelir' | 'gider'
export type GelirKategorisi =
  | 'bagis'
  | 'bagis-kumbara'
  | 'yardim-destek'
  | 'gelir-dukkan'
  | 'faiz'
  | 'diger'
export type GiderKategorisi =
  | 'personel'
  | 'kira'
  | 'fatura'
  | 'malzeme'
  | 'sosyal-yardim'
  | 'nakdi-yardim'
  | 'ayni-yardim'
  | 'hizmet-alim'
  | 'admin-gider'
  | 'diger'

export type Kategori = GelirKategorisi | GiderKategorisi

export interface GelirGider extends Timestamps {
  id: string
  islemTuru: IslemTuru
  kategori: Kategori
  tutar: number
  currency: Currency
  aciklama: string
  tarih: Date
  odemeYontemi: PaymentMethod
  makbuzNo?: string
  faturaNo?: string
  belge?: {
    url: string
    uploadedAt: Date
  }
  islemYapan?: User
  ilgiliKisi?: string // İlgili kişi/kurum
  referansId?: string // İlgili kayıt ID (bagis_id, uye_id, vb.)
}

export interface GelirGiderOzet {
  toplamGelir: number
  toplamGider: number
  netBakiye: number
  aylikGelir: number
  aylikGider: number
  gelirKategorileri: Partial<Record<GelirKategorisi, number>>
  giderKategorileri: Partial<Record<GiderKategorisi, number>>
}

// Kumbara (Collection Box) Types
export type KumbaraStatus = 'aktif' | 'pasif' | 'bakim'

// GPS koordinatları için
export interface GpsKoordinat {
  lat: number
  lng: number
}

// Kumbara toplama (boşaltma) kaydı
export interface KumbaraToplama {
  id: string
  kumbaraId: string
  tarih: Date
  tutar: number
  toplayanKisi: User
  notlar?: string
}

// Kumbara QR kod bilgisi
export interface KumbaraQR {
  kod: string // QR kodun içeriği (unique identifier)
  tapilanTarih?: Date // QR kodun sisteme tanıtıldığı tarih
}

export interface Kumbara extends Timestamps {
  id: string
  kod: string
  ad: string // Kumbaranın adı (örn: "Merkez Cami Kumbarası")
  konum: string // Metin açıklaması (örn: "Merkez Cami Girişi")
  koordinat?: GpsKoordinat // GPS koordinatları (rota için)
  qrKod?: KumbaraQR // QR kod bilgisi
  sorumlu: User
  sonBosaltma?: Date
  toplamTutar: number
  toplamaBaşarina: number // Toplam toplanan miktar (geçmişten bugüne)
  toplamaGecmisi: KumbaraToplama[] // Toplama geçmişi
  durum: KumbaraStatus
  notlar?: string
  fotoğraf?: string // Kumbaranın fotoğrafı URL
}

// Member (Üye) Types
export type UyeTuru = 'aktif' | 'onursal' | 'genc' | 'destekci'
export type AidatDurumu = 'guncel' | 'gecmis' | 'muaf'
export type Cinsiyet = 'erkek' | 'kadin'

export interface UyeAdres {
  il: string
  ilce: string
  mahalle?: string
  acikAdres?: string
}

export interface Uye extends Timestamps {
  id: string
  tcKimlikNo: string
  ad: string
  soyad: string
  dogumTarihi: Date
  cinsiyet: Cinsiyet
  telefon: string
  email?: string
  adres: UyeAdres
  uyeTuru: UyeTuru
  uyeNo: string
  kayitTarihi: Date
  aidatDurumu: AidatDurumu
  aidat: {
    tutar: number
    sonOdemeTarihi?: Date
  }
}

// Social Aid (Sosyal Yardım) Types
export type YardimTuru =
  | 'ayni'
  | 'nakdi'
  | 'egitim'
  | 'saglik'
  | 'kira'
  | 'fatura'
export type BasvuruDurumu =
  | 'beklemede'
  | 'inceleniyor'
  | 'onaylandi'
  | 'reddedildi'
  | 'odendi'

export interface BasvuranKisi {
  ad: string
  soyad: string
  tcKimlikNo: string
  telefon: string
  adres: string
}

export interface BasvuruBelge {
  url: string
  tur: string
  uploadedAt: Date
}

export interface OdemeBilgileri {
  tutar: number
  odemeTarihi: Date
  makbuzNo: string
  odemeYontemi: PaymentMethod
  iban?: string
  bankaAdi?: string
  durum?: string
}

export interface Payment extends Timestamps {
  id: number
  beneficiary_id?: number
  tutar: number
  odeme_tarihi: Date
  makbuz_no?: string
  odeme_yontemi: PaymentMethod
  durum: PaymentStatus
  aciklama?: string
  beneficiaries?: {
    ad: string
    soyad: string
  }
}

export interface SosyalYardimBasvuru extends Timestamps {
  id: string
  basvuranKisi: BasvuranKisi
  yardimTuru: YardimTuru
  talepEdilenTutar?: number
  gerekce: string
  belgeler: BasvuruBelge[]
  durum: BasvuruDurumu
  degerlendiren?: User
  degerlendirmeTarihi?: Date
  degerlendirmeNotu?: string
  odemeBilgileri?: OdemeBilgileri
}

// İhtiyaç Sahibi (Beneficiary) Types - Kapsamlı Sistem
export type IhtiyacDurumu = 'taslak' | 'aktif' | 'pasif' | 'tamamlandi'

export type IhtiyacSahibiKategori =
  | 'yetim-ailesi'
  | 'multeci-aile'
  | 'ihtiyac-sahibi-aile'
  | 'ogrenci-yabanci'
  | 'ogrenci-tc'
  | 'vakif-dernek'
  | 'devlet-okulu'
  | 'kamu-kurumu'
  | 'ozel-egitim-kurumu'

export type IhtiyacSahibiTuru = 'ihtiyac-sahibi-kisi' | 'bakmakla-yukumlu'

export type FonBolgesi = 'avrupa' | 'serbest'

export type DosyaBaglantisi = 'partner-kurum' | 'calisma-sahasi'

export type KimlikBelgesiTuru =
  | 'yok'
  | 'nufus-cuzdani'
  | 'tc-kimlik-belgesi'
  | 'gecici-ikamet-belgesi'
  | 'yabanci-kimlik-belgesi'

export type PasaportTuru =
  | 'yok'
  | 'diplomatik'
  | 'gecici'
  | 'hizmet'
  | 'hususi'
  | 'umuma-mahsus'

export type VizeGirisTuru =
  | 'yok'
  | 'calisma-izni'
  | 'egitim-ogrenci'
  | 'gecici-ikamet'
  | 'ikinci-vatandaslik'
  | 'multeci'
  | 'siginmaci'
  | 'turist-seyahat'

export type MedeniHal = 'bekar' | 'evli' | 'dul' | 'bosanmis'

export type EgitimDurumu =
  | 'okur-yazar-degil'
  | 'ilkokul'
  | 'ortaokul'
  | 'lise'
  | 'universite'
  | 'yuksek-lisans'
  | 'doktora'

export type SaglikDurumu = 'iyi' | 'kronik-hasta' | 'engelli' | 'yasli-bakim'

export type RizaBeyaniDurumu = 'alinmadi' | 'alindi' | 'reddetti'

// Kimlik Bilgileri
export interface KimlikBilgileri {
  babaAdi?: string
  anneAdi?: string
  belgeTuru: KimlikBelgesiTuru
  belgeGecerlilikTarihi?: Date
  seriNumarasi?: string
  oncekiUyruk?: string
  oncekiIsim?: string
}

// Pasaport ve Vize Bilgileri
export interface PasaportVizeBilgileri {
  pasaportTuru: PasaportTuru
  pasaportNumarasi?: string
  pasaportGecerlilikTarihi?: Date
  vizeGirisTuru: VizeGirisTuru
  vizeBitisTarihi?: Date
  girisTarihi?: Date
  girisKapisi?: string
}

// Göç ve İkamet Bilgileri
export interface GocIkametBilgileri {
  geciciKorumaTarihi?: Date
  geciciKorumaIl?: string
  oturmaIzniTuru?: string
  oturmaIzniGecerlilikTarihi?: Date
  oturmaIzniAlinmaTarihi?: Date
  oturmaIzniYenilenmeTarihi?: Date
  yukumluOlduguKurum?: string
  sonGeldigiAdres?: string
}

// Sağlık Bilgileri
export interface SaglikBilgileri {
  kanGrubu?: string
  kronikHastalik?: string
  engelDurumu?: string
  engelOrani?: number
  surekliIlac?: string
  saglikGuvenceleri?: string
}

// Ekonomik ve Sosyal Durum
export interface EkonomikSosyalDurum {
  egitimDurumu?: EgitimDurumu
  meslek?: string
  calismaDurumu?: string
  aylikGelir?: number
  gelirKaynagi?: string
  konutDurumu?: 'kira' | 'ev-sahibi' | 'misafir' | 'barinma-merkezi'
  kiraTutari?: number
  borcDurumu?: string
  borcTutari?: number
}

// Aile ve Hane Bilgileri
export interface AileHaneBilgileri {
  medeniHal: MedeniHal
  esAdi?: string
  esTelefon?: string
  ailedekiKisiSayisi: number
  cocukSayisi: number
  yetimSayisi: number
  calısanSayisi: number
  bakmaklaYukumluSayisi: number
}

// Bağlantılı Kayıt Sayıları
export interface BaglantiliKayitlar {
  bankaHesaplari: number
  dokumanlar: number
  fotograflar: number
  baktigiYetimler: number
  baktigiKisiler: number
  sponsorlar: number
  referanslar: number
  gorusmeKayitlari: number
  gorusmeSeansTakibi: number
  yardimTalepleri: number
  yapilanYardimlar: number
  rizaBeyannamesi: number
  sosyalKartlar: number
}

// Ana İhtiyaç Sahibi Interface (Genişletilmiş)
export interface IhtiyacSahibi extends Timestamps {
  id: string

  // Temel Bilgiler
  tur: IhtiyacSahibiTuru
  kategori: IhtiyacSahibiKategori
  parentId?: string // İlişkili ana ihtiyaç sahibi (bakmakla yükümlü kişiler için)
  ad: string
  soyad: string
  uyruk: string
  dogumTarihi?: Date
  cinsiyet?: Cinsiyet
  tcKimlikNo?: string
  yabanciKimlikNo?: string

  // Dosya Bilgileri
  dosyaNo: string
  fonBolgesi?: FonBolgesi
  dosyaBaglantisi?: DosyaBaglantisi
  dosyaBaglantisiDetay?: string

  // İletişim
  cepTelefonu?: string
  cepTelefonuOperator?: string
  sabitTelefon?: string
  yurtdisiTelefon?: string
  email?: string

  // Adres Bilgileri
  ulke: string
  sehir: string
  ilce?: string
  mahalle?: string
  adres?: string

  // Alt Bilgiler
  kimlikBilgileri?: KimlikBilgileri
  pasaportVizeBilgileri?: PasaportVizeBilgileri
  gocIkametBilgileri?: GocIkametBilgileri
  saglikBilgileri?: SaglikBilgileri
  ekonomikDurum?: EkonomikSosyalDurum
  aileHaneBilgileri?: AileHaneBilgileri

  // Sponsorluk
  sponsorlukTipi?: 'bireysel' | 'kurumsal' | 'yok'

  // Durum ve İstatistikler
  durum: IhtiyacDurumu
  rizaBeyaniDurumu: RizaBeyaniDurumu
  kayitTarihi: Date
  sonAtamaTarihi?: Date

  // Yardım İstatistikleri
  basvuruSayisi: number
  yardimSayisi: number
  toplamYardimTutari: number
  sonYardimTarihi?: Date

  // Bağlantılı Kayıtlar
  baglantiliKayitlar?: BaglantiliKayitlar

  // Ek Bilgiler
  fotografUrl?: string
  notlar?: string
  mernisDogrulama?: boolean
}

// Liste görünümü için kısa versiyon
export interface IhtiyacSahibiListItem {
  id: string
  tur: IhtiyacSahibiTuru
  ad: string
  soyad: string
  kategori: IhtiyacSahibiKategori
  yas?: number
  uyruk: string
  tcKimlikNo?: string
  yabanciKimlikNo?: string
  cepTelefonu?: string
  ulke: string
  sehir: string
  ilce?: string
  adres?: string
  ailedekiKisiSayisi?: number
  yetimSayisi?: number
  basvuruSayisi: number
  yardimSayisi: number
  dosyaNo: string
  sonAtamaTarihi?: Date
  durum: IhtiyacDurumu
}

// Table State Types (for nuqs URL state)
export interface TableState {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, string | string[]>
}

// Dashboard Stats Types
export interface DashboardStats {
  totalDonations: number
  donationsTrend: number
  activeMembers: number
  pendingApplications: number
  monthlyAid: number
  monthlyDonations: MonthlyData[]
  aidDistribution: AidDistributionData[]
  recentDonations: Bagis[]
}

export interface MonthlyData {
  month: string
  amount: number
}

export interface AidDistributionData {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

// Nakdi Yardım Veznesi (Cash Treasury) Types
export type VezneIslemTuru = 'giris' | 'cikis' | 'transfer'
export type VezneDurum = 'aktif' | 'blokeli' | 'kapali'

export interface VezneIslem extends Timestamps {
  id: string
  vezneId: string
  islemTuru: VezneIslemTuru
  tutar: number
  currency: Currency
  aciklama: string
  odemeYontemi: PaymentMethod
  makbuzNo?: string
  referansId?: string // Bağlantılı kayıt (basvuru_id, beneficiary_id, vb.)
  ilgiliKisi?: string
  islemYapan?: User
  islemZamani: Date
}

export interface VezneHareket {
  id: string
  islem: VezneIslem
  bakiyeOncesi: number
  bakiyeSonrasi: number
  zaman: Date
}

export interface Vezne extends Timestamps {
  id: string
  ad: string // Vezne adı (örn: "Merkez Vezne", "Şube Veznesi")
  kod: string // Vezne kodu
  sorumlu: User
  durum: VezneDurum
  bakiye: number // Mevcut nakit bakiyesi
  bakiyeTRY: number
  bakiyeUSD: number
  bakiyeEUR: number
  sonHareketler: VezneHareket[]
  acilisTarihi: Date
  kapanisTarihi?: Date
  konum?: string // Fiziksel konum
  notlar?: string
  gunlukLimit?: number // Günlük nakit işlem limiti
  guvenlikSorusu?: string
  guvenlikCevabi?: string
}

export interface VezneOzet {
  toplamVezne: number
  aktifVezne: number
  blokeliVezne: number
  toplamBakiye: number
  toplamBakiyeTRY: number
  toplamBakiyeUSD: number
  toplamBakiyeEUR: number
  bugununIslemleri: VezneIslem[]
  bugununGiris: number
  bugununCikis: number
}

// Banka Ödeme Emirleri (Bank Payment Orders) Types
export type OdemeEmriDurumu = 'hazirlaniyor' | 'beklemede' | 'onaylandi' | 'bankaya-iletildi' | 'tamamlandi' | 'iptal' | 'reddedildi'
export type OdemeEmriTuru = 'havale' | 'eft' | 'fast' | 'swift'

export interface OdemeEmri extends Timestamps {
  id: string
  emirNo: string // Sıra no (otomatik artan)
  gonderici: {
    hesapAdi: string
    iban: string
    bankaAdi: string
    subeAdi?: string
    hesapNo?: string
  }
  alici: {
    ad: string
    soyad: string
    tcKimlikNo?: string
    vergiNo?: string
    iban: string
    bankaAdi: string
    subeAdi?: string
    hesapNo?: string
  }
  tutar: number
  currency: Currency
  odemeEmriTuru: OdemeEmriTuru
  durum: OdemeEmriDurumu
  aciklama: string
  referansId?: string // Bağlantılı kayıt (basvuru_id, beneficiary_id, vb.)
  makbuzNo?: string
  islemTarihi: Date
  onayTarihi?: Date
  bankayaIletilmeTarihi?: Date
  tamamlanmaTarihi?: Date
  iptalNedeni?: string
  hazirlayan: User
  onaylayan?: User
  dosyaEkleri?: Array<{
    dosyaAdi: string
    dosyaUrl: string
    yuklenmeTarihi: Date
  }>
  notlar?: string
}

export interface OdemeEmriOzet {
  toplamEmir: number
  bekleyenEmir: number
  bugunEmir: number
  toplamTutar: number
  bugunTutar: number
  durumlaraGore: Record<OdemeEmriDurumu, number>
}

// Navigation Types
export interface NavItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
  badge?: number
}
