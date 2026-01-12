import type {
  Bagis,
  BasvuruDurumu,
  Currency,
  DashboardStats,
  DonationPurpose,
  GpsKoordinat,
  IhtiyacDurumu,
  IhtiyacSahibi,
  IhtiyacSahibiKategori,
  Kumbara,
  KumbaraToplama,
  PaginatedResponse,
  PaymentMethod,
  PaymentStatus,
  SosyalYardimBasvuru,
  Uye,
  YardimTuru,
  GelirGider,
  GelirGiderOzet,
  GelirKategorisi,
  GiderKategorisi,
  IslemTuru,
  Kategori,
  Vezne,
  VezneIslem,
  VezneOzet,
  VezneHareket,
  VezneIslemTuru,
  VezneDurum,
} from '@/types'
import {
  generateDashboardStats,
  generateMockBasvurular,
  generateMockDonations,
  generateMockIhtiyacSahipleri,
  generateMockKumbaras,
  generateMockUyeler,
} from './mock-data'

// Simulated network delay - minimal for smooth UX
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.min(ms, 50)))

// Cache for consistent data during session
let donationsCache: Bagis[] | null = null
let kumbarasCache: Kumbara[] | null = null
let membersCache: Uye[] | null = null
let applicationsCache: SosyalYardimBasvuru[] | null = null
let beneficiariesCache: IhtiyacSahibi[] | null = null
let gelirGiderCache: GelirGider[] | null = null
let veznelerCache: Vezne[] | null = null
let vezneIslemlerCache: VezneIslem[] | null = null

// Initialize caches
function getDonations(): Bagis[] {
  if (!donationsCache) {
    donationsCache = generateMockDonations(100)
  }
  return donationsCache
}

function getKumbaras(): Kumbara[] {
  if (!kumbarasCache) {
    kumbarasCache = generateMockKumbaras(25)
  }
  return kumbarasCache
}

function getMembers(): Uye[] {
  if (!membersCache) {
    membersCache = generateMockUyeler(150)
  }
  return membersCache
}

function getApplications(): SosyalYardimBasvuru[] {
  if (!applicationsCache) {
    applicationsCache = generateMockBasvurular(50)
  }
  return applicationsCache
}

function getBeneficiaries(): IhtiyacSahibi[] {
  if (!beneficiariesCache) {
    beneficiariesCache = generateMockIhtiyacSahipleri(80)

    // Establish parent-child relationships for dependent persons
    const mainPersons = beneficiariesCache.filter(b => b.tur === 'ihtiyac-sahibi-kisi')
    const dependents = beneficiariesCache.filter(b => b.tur === 'bakmakla-yukumlu')

    // Assign some dependents to main persons (1-3 dependents per main person)
    let dependentIndex = 0
    for (const mainPerson of mainPersons) {
      const numDependents = Math.min(
        Math.floor(Math.random() * 3) + 1, // 1-3 dependents
        dependents.length - dependentIndex
      )

      for (let i = 0; i < numDependents && dependentIndex < dependents.length; i++) {
        dependents[dependentIndex].parentId = mainPerson.id
        dependentIndex++
      }

      if (dependentIndex >= dependents.length) break
    }
  }
  return beneficiariesCache
}

function getGelirGider(): GelirGider[] {
  if (!gelirGiderCache) {
    // Generate some mock income-expense data
    gelirGiderCache = []
    const now = new Date()

    // Generate 50 mock transactions (30 gelir, 20 gider)
    for (let i = 0; i < 50; i++) {
      const islemTuru: IslemTuru = i < 30 ? 'gelir' : 'gider'
      const gelirkategoriler: Kategori[] = ['bagis', 'bagis-kumbara', 'yardim-destek', 'gelir-dukkan', 'faiz', 'diger']
      const giderkategoriler: Kategori[] = ['personel', 'kira', 'fatura', 'malzeme', 'sosyal-yardim', 'nakdi-yardim', 'ayni-yardim', 'hizmet-alim', 'admin-gider', 'diger']

      const kategori = islemTuru === 'gelir'
        ? gelirkategoriler[Math.floor(Math.random() * gelirkategoriler.length)]
        : giderkategoriler[Math.floor(Math.random() * giderkategoriler.length)]

      const tarih = new Date(now)
      tarih.setDate(tarih.getDate() - Math.floor(Math.random() * 90))

      gelirGiderCache.push({
        id: crypto.randomUUID(),
        islemTuru,
        kategori,
        tutar: Math.floor(Math.random() * 10000) + 100,
        currency: 'TRY',
        aciklama: `${islemTuru === 'gelir' ? 'Gelir' : 'Gider'} kaydı ${i + 1}`,
        tarih,
        odemeYontemi: ['nakit', 'havale', 'kredi-karti'][Math.floor(Math.random() * 3)] as PaymentMethod,
        makbuzNo: `MK-${i + 1}`,
        faturaNo: islemTuru === 'gider' ? `FT-${i + 1}` : undefined,
        ilgiliKisi: `Kişi/Kurum ${i + 1}`,
        createdAt: tarih,
        updatedAt: new Date(),
      })
    }
  }
  return gelirGiderCache
}

// Fetch dashboard stats
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(500)
  return generateDashboardStats()
}

// Fetch donations with pagination, sorting, and filtering
export async function fetchDonations(options: {
  page?: number
  pageSize?: number
  search?: string
  status?: PaymentStatus
  purpose?: DonationPurpose
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<PaginatedResponse<Bagis>> {
  await delay(300)

  const {
    page = 1,
    pageSize = 10,
    search = '',
    status,
    purpose,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options

  let data = [...getDonations()]

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    data = data.filter(
      (d) =>
        d.bagisci.ad.toLowerCase().includes(searchLower) ||
        d.bagisci.soyad.toLowerCase().includes(searchLower) ||
        d.makbuzNo?.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (status) {
    data = data.filter((d) => d.durum === status)
  }

  // Filter by purpose
  if (purpose) {
    data = data.filter((d) => d.amac === purpose)
  }

  // Sort
  data.sort((a, b) => {
    const aValue = a[sortBy as keyof Bagis]
    const bValue = b[sortBy as keyof Bagis]

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  // Paginate
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Fetch single donation
export async function fetchDonation(id: string): Promise<Bagis | null> {
  await delay(200)
  const donations = getDonations()
  return donations.find((d) => d.id === id) || null
}

// Fetch kumbaras
export async function fetchKumbaras(options: {
  page?: number
  pageSize?: number
  status?: 'aktif' | 'pasif' | 'bakim'
}): Promise<PaginatedResponse<Kumbara>> {
  await delay(300)

  const { page = 1, pageSize = 10, status } = options
  let data = [...getKumbaras()]

  if (status) {
    data = data.filter((k) => k.durum === status)
  }

  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Fetch kumbara by code (for QR scan)
export async function fetchKumbaraByCode(kod: string): Promise<Kumbara | null> {
  await delay(200)
  const kumbaras = getKumbaras()
  return kumbaras.find((k) => k.kod === kod || k.qrKod?.kod === kod) || null
}

// Create new kumbara
export async function createKumbara(data: {
  qrKod: string
  ad: string
  konum: string
  koordinat?: GpsKoordinat
  sorumluId: string
  notlar?: string
}): Promise<Kumbara> {
  await delay(300)

  const newKumbara: Kumbara = {
    id: crypto.randomUUID(),
    kod: data.qrKod,
    ad: data.ad,
    konum: data.konum,
    koordinat: data.koordinat,
    qrKod: {
      kod: data.qrKod,
      tapilanTarih: new Date(),
    },
    sorumlu: {
      id: data.sorumluId,
      name: 'Sorumlu Kişi',
      email: 'sorumlu@example.com',
      role: 'gorevli',
      isActive: true,
      permissions: ['donations.view'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    sonBosaltma: undefined,
    toplamTutar: 0,
    toplamaBaşarina: 0,
    toplamaGecmisi: [],
    durum: 'aktif',
    notlar: data.notlar,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Cache'e ekle
  if (kumbarasCache) {
    kumbarasCache.unshift(newKumbara)
  }

  return newKumbara
}

// Collect (empty) kumbara
export async function collectKumbara(data: {
  kumbaraId: string
  tutar: number
  notlar?: string
}): Promise<KumbaraToplama> {
  await delay(300)

  const kumbaras = getKumbaras()
  const kumbara = kumbaras.find((k) => k.id === data.kumbaraId)

  if (!kumbara) {
    throw new Error('Kumbara bulunamadı')
  }

  const toplama: KumbaraToplama = {
    id: crypto.randomUUID(),
    kumbaraId: data.kumbaraId,
    tarih: new Date(),
    tutar: data.tutar,
    toplayanKisi: {
      id: 'current-user',
      name: 'Mevcut Kullanıcı',
      email: 'user@example.com',
      role: 'gorevli',
      isActive: true,
      permissions: ['donations.view'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    notlar: data.notlar,
  }

  // Kumbara bilgilerini güncelle
  kumbara.toplamTutar = 0 // Boşaltıldı
  kumbara.toplamaBaşarina = (kumbara.toplamaBaşarina || 0) + data.tutar
  kumbara.sonBosaltma = new Date()
  kumbara.toplamaGecmisi = kumbara.toplamaGecmisi || []
  kumbara.toplamaGecmisi.unshift(toplama)
  kumbara.updatedAt = new Date()

  return toplama
}

// Fetch members
export async function fetchMembers(options: {
  page?: number
  pageSize?: number
  search?: string
  type?: string
}): Promise<PaginatedResponse<Uye>> {
  await delay(300)

  const { page = 1, pageSize = 10, search = '', type } = options
  let data = [...getMembers()]

  if (search) {
    const searchLower = search.toLowerCase()
    data = data.filter(
      (m) =>
        m.ad.toLowerCase().includes(searchLower) ||
        m.soyad.toLowerCase().includes(searchLower) ||
        m.uyeNo.toLowerCase().includes(searchLower) ||
        m.telefon.includes(search)
    )
  }

  if (type) {
    data = data.filter((m) => m.uyeTuru === type)
  }

  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Fetch single member
export async function fetchMember(id: string): Promise<Uye | null> {
  await delay(200)
  const members = getMembers()
  return members.find((m) => m.id === id) || null
}

// Fetch social aid applications
export async function fetchApplications(options: {
  page?: number
  pageSize?: number
  status?: BasvuruDurumu
  search?: string
  yardimTuru?: YardimTuru
}): Promise<PaginatedResponse<SosyalYardimBasvuru>> {
  await delay(300)

  const { page = 1, pageSize = 10, status, search = '', yardimTuru } = options
  let data = [...getApplications()]

  if (status) {
    data = data.filter((a) => a.durum === status)
  }

  if (yardimTuru) {
    data = data.filter((a) => a.yardimTuru === yardimTuru)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    data = data.filter(
      (a) =>
        a.basvuranKisi.ad.toLowerCase().includes(searchLower) ||
        a.basvuranKisi.soyad.toLowerCase().includes(searchLower) ||
        a.basvuranKisi.tcKimlikNo.includes(search)
    )
  }

  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Fetch single application by ID
export async function fetchApplicationById(
  id: string
): Promise<SosyalYardimBasvuru | null> {
  await delay(200)
  const applications = getApplications()
  return applications.find((a) => a.id === id) || null
}

// Update application status
export async function updateApplicationStatus(
  id: string,
  durum: BasvuruDurumu,
  degerlendirmeNotu?: string
): Promise<SosyalYardimBasvuru> {
  await delay(300)

  const applications = getApplications()
  const application = applications.find((a) => a.id === id)

  if (!application) {
    throw new Error('Başvuru bulunamadı')
  }

  // Update application status
  application.durum = durum
  application.degerlendiren = {
    id: 'current-user',
    name: 'Mevcut Kullanıcı',
    email: 'user@example.com',
    role: 'admin',
    isActive: true,
    permissions: ['social-aid.approve'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (degerlendirmeNotu) {
    application.degerlendirmeNotu = degerlendirmeNotu
  }

  application.updatedAt = new Date()

  return application
}

// Fetch payments (approved applications)
export async function fetchPayments(options: {
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<SosyalYardimBasvuru>> {
  await delay(300)

  const { page = 1, pageSize = 10 } = options
  const data = getApplications().filter((a) => a.durum === 'odendi')

  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Fetch beneficiaries (ihtiyaç sahipleri) - Genişletilmiş
export async function fetchBeneficiaries(options: {
  page?: number
  pageSize?: number
  status?: IhtiyacDurumu
  kategori?: IhtiyacSahibiKategori
  search?: string
  city?: string
  dosyaNo?: string
  kimlikNo?: string
}): Promise<PaginatedResponse<IhtiyacSahibi>> {
  await delay(300)

  const {
    page = 1,
    pageSize = 20,
    status,
    kategori,
    search = '',
    city,
    dosyaNo,
    kimlikNo,
  } = options
  let data = [...getBeneficiaries()]

  if (status) {
    data = data.filter((b) => b.durum === status)
  }

  if (kategori) {
    data = data.filter((b) => b.kategori === kategori)
  }

  if (city) {
    data = data.filter((b) => b.sehir === city)
  }

  if (dosyaNo) {
    data = data.filter((b) =>
      b.dosyaNo.toLowerCase().includes(dosyaNo.toLowerCase())
    )
  }

  if (kimlikNo) {
    data = data.filter(
      (b) =>
        (b.tcKimlikNo && b.tcKimlikNo.includes(kimlikNo)) ||
        (b.yabanciKimlikNo && b.yabanciKimlikNo.includes(kimlikNo))
    )
  }

  if (search) {
    const searchLower = search.toLowerCase()
    data = data.filter(
      (b) =>
        b.ad.toLowerCase().includes(searchLower) ||
        b.soyad.toLowerCase().includes(searchLower) ||
        (b.tcKimlikNo && b.tcKimlikNo.includes(search)) ||
        (b.yabanciKimlikNo &&
          b.yabanciKimlikNo.toLowerCase().includes(searchLower)) ||
        (b.cepTelefonu && b.cepTelefonu.includes(search)) ||
        b.dosyaNo.toLowerCase().includes(searchLower)
    )
  }

  // Sort by most recent
  data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Fetch single beneficiary by ID
export async function fetchBeneficiaryById(
  id: string
): Promise<IhtiyacSahibi | null> {
  await delay(200)
  const beneficiaries = getBeneficiaries()
  return beneficiaries.find((b) => b.id === id) || null
}

// Create new beneficiary
export async function createBeneficiary(
  data: Partial<IhtiyacSahibi>
): Promise<IhtiyacSahibi> {
  await delay(500)

  const newBeneficiary: IhtiyacSahibi = {
    id: crypto.randomUUID(),
    tur: data.tur || 'ihtiyac-sahibi-kisi',
    kategori: data.kategori || 'ihtiyac-sahibi-aile',
    ad: data.ad || '',
    soyad: data.soyad || '',
    uyruk: data.uyruk || 'Türkiye',
    dosyaNo: data.dosyaNo || `DSY-${Math.random().toString().slice(2, 8)}`,
    ulke: data.ulke || 'Türkiye',
    sehir: data.sehir || '',
    durum: 'taslak',
    rizaBeyaniDurumu: 'alinmadi',
    kayitTarihi: new Date(),
    basvuruSayisi: 0,
    yardimSayisi: 0,
    toplamYardimTutari: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  } as IhtiyacSahibi

  getBeneficiaries().unshift(newBeneficiary)
  return newBeneficiary
}

// Update beneficiary
export async function updateBeneficiary(
  id: string,
  data: Partial<IhtiyacSahibi>
): Promise<IhtiyacSahibi | null> {
  await delay(400)

  const beneficiaries = getBeneficiaries()
  const index = beneficiaries.findIndex((b) => b.id === id)

  if (index === -1) return null

  beneficiaries[index] = {
    ...beneficiaries[index],
    ...data,
    updatedAt: new Date(),
  }

  return beneficiaries[index]
}

// Delete beneficiary
export async function deleteBeneficiary(id: string): Promise<boolean> {
  await delay(300)

  const beneficiaries = getBeneficiaries()
  const index = beneficiaries.findIndex((b) => b.id === id)

  if (index === -1) return false

  beneficiaries.splice(index, 1)
  return true
}

// Mock create donation
export async function createDonation(data: Partial<Bagis>): Promise<Bagis> {
  await delay(500)

  const newDonation: Bagis = {
    id: crypto.randomUUID(),
    bagisci: data.bagisci || {
      id: crypto.randomUUID(),
      ad: '',
      soyad: '',
    },
    tutar: data.tutar || 0,
    currency: data.currency || 'TRY',
    amac: data.amac || 'genel',
    odemeYontemi: data.odemeYontemi || 'nakit',
    durum: 'tamamlandi',
    makbuzNo: `MKB-2024-${Math.random().toString().slice(2, 6)}`,
    aciklama: data.aciklama,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  getDonations().unshift(newDonation)
  return newDonation
}

// Update donation
export async function updateDonation(
  id: string,
  data: Partial<Bagis>
): Promise<Bagis | null> {
  await delay(400)

  const donations = getDonations()
  const index = donations.findIndex((d) => d.id === id)

  if (index === -1) return null

  donations[index] = {
    ...donations[index],
    ...data,
    updatedAt: new Date(),
  }

  return donations[index]
}

// Delete donation
export async function deleteDonation(id: string): Promise<boolean> {
  await delay(300)

  const donations = getDonations()
  const index = donations.findIndex((d) => d.id === id)

  if (index === -1) return false

  donations.splice(index, 1)
  return true
}

// Mock create member
export async function createMember(data: Partial<Uye>): Promise<Uye> {
  await delay(500)

  const newMember: Uye = {
    id: crypto.randomUUID(),
    tcKimlikNo: data.tcKimlikNo || '',
    ad: data.ad || '',
    soyad: data.soyad || '',
    dogumTarihi: data.dogumTarihi || new Date(),
    cinsiyet: data.cinsiyet || 'erkek',
    telefon: data.telefon || '',
    email: data.email,
    adres: data.adres || {
      il: '',
      ilce: '',
      mahalle: '',
      acikAdres: '',
    },
    uyeTuru: data.uyeTuru || 'aktif',
    uyeNo: `UY-${Math.random().toString().slice(2, 8)}`,
    kayitTarihi: new Date(),
    aidatDurumu: 'guncel',
    aidat: {
      tutar: 100,
      sonOdemeTarihi: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  getMembers().unshift(newMember)
  return newMember
}

// Update member
export async function updateMember(
  id: string,
  data: Partial<Uye>
): Promise<Uye | null> {
  await delay(400)

  const members = getMembers()
  const index = members.findIndex((m) => m.id === id)

  if (index === -1) return null

  members[index] = {
    ...members[index],
    ...data,
    updatedAt: new Date(),
  }

  return members[index]
}

// Delete member
export async function deleteMember(id: string): Promise<boolean> {
  await delay(300)

  const members = getMembers()
  const index = members.findIndex((m) => m.id === id)

  if (index === -1) return false

  members.splice(index, 1)
  return true
}

export async function fetchDependentPersons(
  parentId: string
): Promise<IhtiyacSahibi[]> {
  await delay(100)
  return getBeneficiaries().filter(
    (b) => b.tur === 'bakmakla-yukumlu' && b.parentId === parentId
  )
}

// Gelir-Gider Functions
export async function fetchGelirGider(options: {
  page?: number
  pageSize?: number
  islemTuru?: IslemTuru
  kategori?: Kategori
  startDate?: string
  endDate?: string
}): Promise<PaginatedResponse<GelirGider>> {
  await delay(300)

  const { page = 1, pageSize = 10, islemTuru, kategori, startDate, endDate } = options
  let data = [...getGelirGider()]

  // Filter by islem turu
  if (islemTuru) {
    data = data.filter((gg) => gg.islemTuru === islemTuru)
  }

  // Filter by kategori
  if (kategori) {
    data = data.filter((gg) => gg.kategori === kategori)
  }

  // Filter by date range
  if (startDate) {
    const start = new Date(startDate)
    data = data.filter((gg) => gg.tarih >= start)
  }

  if (endDate) {
    const end = new Date(endDate)
    data = data.filter((gg) => gg.tarih <= end)
  }

  // Sort by date descending
  data.sort((a, b) => b.tarih.getTime() - a.tarih.getTime())

  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginatedData = data.slice(start, start + pageSize)

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages,
  }
}

export async function fetchGelirGiderOzet(
  startDate?: string,
  endDate?: string
): Promise<GelirGiderOzet> {
  await delay(200)

  let data = [...getGelirGider()]

  // Filter by date range if provided
  if (startDate) {
    const start = new Date(startDate)
    data = data.filter((gg) => gg.tarih >= start)
  }

  if (endDate) {
    const end = new Date(endDate)
    data = data.filter((gg) => gg.tarih <= end)
  }

  const gelir = data.filter((gg) => gg.islemTuru === 'gelir')
  const gider = data.filter((gg) => gg.islemTuru === 'gider')

  const toplamGelir = gelir.reduce((sum, gg) => sum + gg.tutar, 0)
  const toplamGider = gider.reduce((sum, gg) => sum + gg.tutar, 0)

  // Calculate category totals
  const gelirKategorileri: Partial<Record<GelirKategorisi, number>> = {}
  const giderKategorileri: Partial<Record<GiderKategorisi, number>> = {}

  gelir.forEach((gg) => {
    const kategori = gg.kategori as GelirKategorisi
    gelirKategorileri[kategori] = (gelirKategorileri[kategori] || 0) + gg.tutar
  })

  gider.forEach((gg) => {
    const kategori = gg.kategori as GiderKategorisi
    giderKategorileri[kategori] = (giderKategorileri[kategori] || 0) + gg.tutar
  })

  // Calculate monthly totals
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const aylikGelir = gelir
    .filter((gg) => {
      const d = gg.tarih
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, gg) => sum + gg.tutar, 0)

  const aylikGider = gider
    .filter((gg) => {
      const d = gg.tarih
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, gg) => sum + gg.tutar, 0)

  return {
    toplamGelir,
    toplamGider,
    netBakiye: toplamGelir - toplamGider,
    aylikGelir,
    aylikGider,
    gelirKategorileri,
    giderKategorileri,
  }
}

export async function createGelirGider(data: Partial<GelirGider>): Promise<GelirGider> {
  await delay(400)

  const newGelirGider: GelirGider = {
    id: crypto.randomUUID(),
    islemTuru: data.islemTuru || 'gelir',
    kategori: data.kategori || 'diger',
    tutar: data.tutar || 0,
    currency: data.currency || 'TRY',
    aciklama: data.aciklama || '',
    tarih: data.tarih || new Date(),
    odemeYontemi: data.odemeYontemi || 'nakit',
    makbuzNo: data.makbuzNo,
    faturaNo: data.faturaNo,
    ilgiliKisi: data.ilgiliKisi,
    referansId: data.referansId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  getGelirGider().unshift(newGelirGider)
  return newGelirGider
}

export async function updateGelirGider(
  id: string,
  data: Partial<GelirGider>
): Promise<GelirGider | null> {
  await delay(300)

  const gelirGider = getGelirGider()
  const index = gelirGider.findIndex((gg) => gg.id === id)

  if (index === -1) return null

  gelirGider[index] = {
    ...gelirGider[index],
    ...data,
    updatedAt: new Date(),
  }

  return gelirGider[index]
}

export async function deleteGelirGider(id: string): Promise<boolean> {
  await delay(200)

  const gelirGider = getGelirGider()
  const index = gelirGider.findIndex((gg) => gg.id === id)

  if (index === -1) return false

  gelirGider.splice(index, 1)
  return true
}

// Vezne (Cash Treasury) Functions
function getVezneler(): Vezne[] {
  if (!veznelerCache) {
    veznelerCache = []
    const now = new Date()

    // Generate 3 mock cash registers
    const vezneAdlari = ['Merkez Vezne', 'Şube Veznesi', 'Mobil Vezne']
    const durumlar: VezneDurum[] = ['aktif', 'aktif', 'blokeli']

    for (let i = 0; i < 3; i++) {
      const bakiyeTRY = Math.floor(Math.random() * 500000) + 50000 // 50K-550K TRY
      const bakiyeUSD = Math.floor(Math.random() * 10000) + 1000 // 1K-11K USD
      const bakiyeEUR = Math.floor(Math.random() * 8000) + 500 // 500-8.5K EUR

      // Generate some mock movements
      const sonHareketler: VezneHareket[] = []
      const islemTurleri: VezneIslemTuru[] = ['giris', 'cikis', 'transfer']
      let currentBalance = bakiyeTRY

      for (let j = 0; j < 5; j++) {
        const islemTuru = islemTurleri[Math.floor(Math.random() * islemTurleri.length)]
        const tutar = Math.floor(Math.random() * 5000) + 500
        const bakiyeOncesi = currentBalance

        if (islemTuru === 'giris') {
          currentBalance += tutar
        } else if (islemTuru === 'cikis' || islemTuru === 'transfer') {
          currentBalance -= tutar
        }

        const hareketTarih = new Date(now)
        hareketTarih.setHours(hareketTarih.getHours() - j * 2)

        sonHareketler.push({
          id: crypto.randomUUID(),
          islem: {
            id: crypto.randomUUID(),
            vezneId: `vezne-${i + 1}`,
            islemTuru,
            tutar,
            currency: 'TRY',
            aciklama: `Test işlemi ${j + 1}`,
            odemeYontemi: 'nakit',
            islemZamani: hareketTarih,
            createdAt: hareketTarih,
            updatedAt: hareketTarih,
          },
          bakiyeOncesi,
          bakiyeSonrasi: currentBalance,
          zaman: hareketTarih,
        })
      }

      const acilisTarih = new Date(now)
      acilisTarih.setFullYear(acilisTarih.getFullYear() - 2)

      veznelerCache.push({
        id: `vezne-${i + 1}`,
        ad: vezneAdlari[i],
        kod: `VZ${String(i + 1).padStart(3, '0')}`,
        sorumlu: {
          id: `user-${i + 1}`,
          name: `Vezne Sorumlu ${i + 1}`,
          email: `vezne${i + 1}@kafkasder.org`,
          role: 'muhasebe',
          isActive: true,
          permissions: [],
          createdAt: acilisTarih,
          updatedAt: now,
        },
        durum: durumlar[i],
        bakiye: bakiyeTRY + bakiyeUSD * 35 + bakiyeEUR * 38, // Approximate total
        bakiyeTRY,
        bakiyeUSD,
        bakiyeEUR,
        sonHareketler,
        acilisTarihi: acilisTarih,
        konum: i === 0 ? 'Merkez Ofis' : i === 1 ? 'Şube Binası' : 'Mobil Araç',
        notlar: i === 2 ? 'Bakım gerekli' : undefined,
        gunlukLimit: 100000,
        createdAt: acilisTarih,
        updatedAt: now,
      })
    }
  }
  return veznelerCache
}

function getVezneIslemleri(): VezneIslem[] {
  if (!vezneIslemlerCache) {
    vezneIslemlerCache = []
    const now = new Date()
    const vezneler = getVezneler()

    // Generate 30 mock transactions
    for (let i = 0; i < 30; i++) {
      const islemTurleri: VezneIslemTuru[] = ['giris', 'cikis', 'transfer']
      const islemTuru = islemTurleri[Math.floor(Math.random() * islemTurleri.length)]
      const vezne = vezneler[Math.floor(Math.random() * vezneler.length)]

      const islemTarih = new Date(now)
      islemTarih.setHours(islemTarih.getHours() - Math.floor(Math.random() * 72))

      vezneIslemlerCache.push({
        id: crypto.randomUUID(),
        vezneId: vezne.id,
        islemTuru,
        tutar: Math.floor(Math.random() * 10000) + 500,
        currency: ['TRY', 'USD', 'EUR'][Math.floor(Math.random() * 3)] as Currency,
        aciklama: `Vezne işlemi #${i + 1}`,
        odemeYontemi: 'nakit',
        makbuzNo: `VZ-${String(i + 1).padStart(4, '0')}`,
        referansId: Math.random() > 0.5 ? `ref-${i + 1}` : undefined,
        ilgiliKisi: Math.random() > 0.5 ? `Müşteri ${i + 1}` : undefined,
        islemZamani: islemTarih,
        islemYapan: vezne.sorumlu,
        createdAt: islemTarih,
        updatedAt: islemTarih,
      })
    }
  }
  return vezneIslemlerCache
}

export async function fetchVezneler(
  params?: { page?: number; limit?: number; durum?: VezneDurum }
): Promise<PaginatedResponse<Vezne>> {
  await delay(300)

  let vezneler = getVezneler()

  if (params?.durum) {
    vezneler = vezneler.filter((v) => v.durum === params.durum)
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: vezneler.slice(start, end),
    total: vezneler.length,
    page,
    pageSize: limit,
    totalPages: Math.ceil(vezneler.length / limit),
  }
}

export async function fetchVezne(id: string): Promise<Vezne | null> {
  await delay(200)

  const vezne = getVezneler().find((v) => v.id === id)
  return vezne || null
}

export async function fetchVezneOzet(): Promise<VezneOzet> {
  await delay(300)

  const vezneler = getVezneler()
  const aktifVezne = vezneler.filter((v) => v.durum === 'aktif')
  const blokeliVezne = vezneler.filter((v) => v.durum === 'blokeli')

  const toplamBakiyeTRY = vezneler.reduce((sum, v) => sum + v.bakiyeTRY, 0)
  const toplamBakiyeUSD = vezneler.reduce((sum, v) => sum + v.bakiyeUSD, 0)
  const toplamBakiyeEUR = vezneler.reduce((sum, v) => sum + v.bakiyeEUR, 0)

  const bugununIslemleri = getVezneIslemleri().filter((vi) => {
    const today = new Date()
    return (
      vi.islemZamani.toDateString() === today.toDateString()
    )
  })

  const bugununGiris = bugununIslemleri
    .filter((vi) => vi.islemTuru === 'giris')
    .reduce((sum, vi) => sum + vi.tutar, 0)

  const bugununCikis = bugununIslemleri
    .filter((vi) => vi.islemTuru === 'cikis')
    .reduce((sum, vi) => sum + vi.tutar, 0)

  return {
    toplamVezne: vezneler.length,
    aktifVezne: aktifVezne.length,
    blokeliVezne: blokeliVezne.length,
    toplamBakiye: toplamBakiyeTRY + toplamBakiyeUSD * 35 + toplamBakiyeEUR * 38,
    toplamBakiyeTRY,
    toplamBakiyeUSD,
    toplamBakiyeEUR,
    bugununIslemleri,
    bugununGiris,
    bugununCikis,
  }
}

export async function fetchVezneIslemleri(
  params?: { page?: number; limit?: number; vezneId?: string }
): Promise<PaginatedResponse<VezneIslem>> {
  await delay(300)

  let islemler = getVezneIslemleri()

  if (params?.vezneId) {
    islemler = islemler.filter((vi) => vi.vezneId === params.vezneId)
  }

  const page = params?.page || 1
  const limit = params?.limit || 50
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: islemler.slice(start, end),
    total: islemler.length,
    page,
    pageSize: limit,
    totalPages: Math.ceil(islemler.length / limit),
  }
}

export async function createVezne(data: Partial<Vezne>): Promise<Vezne> {
  await delay(400)

  const newVezne: Vezne = {
    id: crypto.randomUUID(),
    ad: data.ad || 'Yeni Vezne',
    kod: data.kod || 'VZ999',
    sorumlu: data.sorumlu || {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@kafkasder.org',
      role: 'admin',
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    durum: data.durum || 'aktif',
    bakiye: 0,
    bakiyeTRY: 0,
    bakiyeUSD: 0,
    bakiyeEUR: 0,
    sonHareketler: [],
    acilisTarihi: data.acilisTarihi || new Date(),
    konum: data.konum,
    notlar: data.notlar,
    gunlukLimit: data.gunlukLimit,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  getVezneler().push(newVezne)
  return newVezne
}

export async function updateVezne(
  id: string,
  data: Partial<Vezne>
): Promise<Vezne | null> {
  await delay(300)

  const vezneler = getVezneler()
  const index = vezneler.findIndex((v) => v.id === id)

  if (index === -1) return null

  vezneler[index] = {
    ...vezneler[index],
    ...data,
    updatedAt: new Date(),
  }

  return vezneler[index]
}

export async function deleteVezne(id: string): Promise<boolean> {
  await delay(200)

  const vezneler = getVezneler()
  const index = vezneler.findIndex((v) => v.id === id)

  if (index === -1) return false

  vezneler.splice(index, 1)
  return true
}

export async function createVezneIslem(data: Partial<VezneIslem>): Promise<VezneIslem> {
  await delay(400)

  const newIslem: VezneIslem = {
    id: crypto.randomUUID(),
    vezneId: data.vezneId || '',
    islemTuru: data.islemTuru || 'giris',
    tutar: data.tutar || 0,
    currency: data.currency || 'TRY',
    aciklama: data.aciklama || '',
    odemeYontemi: data.odemeYontemi || 'nakit',
    makbuzNo: data.makbuzNo,
    referansId: data.referansId,
    ilgiliKisi: data.ilgiliKisi,
    islemZamani: data.islemZamani || new Date(),
    islemYapan: data.islemYapan,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  getVezneIslemleri().unshift(newIslem)

  // Update vezne balance
  const vezneler = getVezneler()
  const vezne = vezneler.find((v) => v.id === newIslem.vezneId)
  if (vezne) {
    if (newIslem.islemTuru === 'giris') {
      if (newIslem.currency === 'TRY') vezne.bakiyeTRY += newIslem.tutar
      if (newIslem.currency === 'USD') vezne.bakiyeUSD += newIslem.tutar
      if (newIslem.currency === 'EUR') vezne.bakiyeEUR += newIslem.tutar
    } else if (newIslem.islemTuru === 'cikis') {
      if (newIslem.currency === 'TRY') vezne.bakiyeTRY -= newIslem.tutar
      if (newIslem.currency === 'USD') vezne.bakiyeUSD -= newIslem.tutar
      if (newIslem.currency === 'EUR') vezne.bakiyeEUR -= newIslem.tutar
    }
    vezne.bakiye = vezne.bakiyeTRY + vezne.bakiyeUSD * 35 + vezne.bakiyeEUR * 38
  }

  return newIslem
}

export async function deleteVezneIslem(id: string): Promise<boolean> {
  await delay(200)

  const islemler = getVezneIslemleri()
  const index = islemler.findIndex((vi) => vi.id === id)

  if (index === -1) return false

  islemler.splice(index, 1)
  return true
}
