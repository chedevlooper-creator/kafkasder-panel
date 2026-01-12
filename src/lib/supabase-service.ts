import type {
  AidatDurumu,
  Bagis,
  BasvuruDurumu,
  BeneficiaryDocument,
  Cinsiyet,
  Currency,
  DocumentType,
  DonationPurpose,
  EgitimDurumu,
  IhtiyacDurumu,
  IhtiyacSahibi,
  IhtiyacSahibiKategori,
  IhtiyacSahibiTuru,
  Kumbara,
  KumbaraStatus,
  MedeniHal,
  PaginatedResponse,
  Payment,
  PaymentMethod,
  PaymentStatus,
  SosyalYardimBasvuru,
  Uye,
  UyeTuru,
  User,
  YardimTuru,
  Vezne,
  VezneIslem,
  VezneOzet,
  VezneDurum,
} from "@/types";
import type { Database } from "@/types/supabase";
import crypto from "crypto";
import { getSupabaseClient } from "./supabase/client";

type Tables = Database["public"]["Tables"];

function toPaginatedResponse<T>(
  data: T[],
  count: number | null,
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return {
    data,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

function mapMember(db: Tables["members"]["Row"]): Uye {
  return {
    id: db.id.toString(),
    tcKimlikNo: db.tc_kimlik_no,
    ad: db.ad,
    soyad: db.soyad,
    dogumTarihi: db.dogum_tarihi ? new Date(db.dogum_tarihi) : new Date(),
    cinsiyet: db.cinsiyet as Cinsiyet,
    telefon: db.telefon,
    email: db.email || undefined,
    adres: {
      il: "",
      ilce: "",
      mahalle: "",
      acikAdres: db.adres || "",
    },
    uyeTuru: (db.uye_turu === "standart" ? "aktif" : db.uye_turu) as UyeTuru,
    uyeNo: "",
    kayitTarihi: db.kayit_tarihi ? new Date(db.kayit_tarihi) : new Date(),
    aidatDurumu: (db.aidat_durumu === "odendi"
      ? "guncel"
      : db.aidat_durumu === "gecikti"
        ? "gecmis"
        : "muaf") as AidatDurumu,
    aidat: {
      tutar: 0,
    },
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

function mapDonation(db: Tables["donations"]["Row"]): Bagis {
  return {
    id: db.id.toString(),
    bagisci: {
      id: db.member_id?.toString() || db.id.toString(),
      ad: db.bagisci_adi || "",
      soyad: "",
    },
    tutar: db.tutar,
    currency: db.currency as Currency,
    amac: db.amac as DonationPurpose,
    odemeYontemi: (db.odeme_yontemi === "kredi_karti"
      ? "kredi-karti"
      : db.odeme_yontemi) as PaymentMethod,
    durum: "tamamlandi" as PaymentStatus,
    createdAt: new Date(db.tarih || db.created_at),
    updatedAt: new Date(db.created_at),
  };
}

function mapApplication(db: ApplicationRow): SosyalYardimBasvuru {
  return {
    id: db.id.toString(),
    basvuranKisi: {
      ad: db.beneficiaries?.ad || "",
      soyad: db.beneficiaries?.soyad || "",
      tcKimlikNo: db.beneficiaries?.tc_kimlik_no || "",
      telefon: db.beneficiaries?.telefon || "",
      adres: db.beneficiaries?.adres || "",
    },
    yardimTuru: db.yardim_turu as YardimTuru,
    talepEdilenTutar: db.talep_edilen_tutar || undefined,
    gerekce: db.gerekce || "",
    belgeler: [],
    durum: (db.durum || "beklemede") as BasvuruDurumu,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

function mapKumbara(db: KumbaraRow): Kumbara {
  const defaultUser: User = {
    id: db.sorumlu_id?.toString() || "0",
    name: "Sorumlu",
    email: "",
    role: "uye",
    isActive: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    id: db.id.toString(),
    kod: db.kod,
    ad: db.kod, // Use kod as ad if not exists in DB
    konum: db.konum || "",
    koordinat: undefined,
    qrKod: {
      kod: db.kod,
      tapilanTarih: db.created_at ? new Date(db.created_at) : undefined,
    },
    sorumlu: db.sorumlu ? { ...defaultUser, ...db.sorumlu } : defaultUser,
    toplamTutar: db.toplam_toplanan || 0,
    toplamaBaşarina: db.toplam_toplanan || 0,
    toplamaGecmisi: [],
    durum: (db.durum === "toplandi" ? "pasif" : db.durum) as KumbaraStatus,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

// Row type aliases for type safety
// BeneficiaryRow extends database row with additional fields that may exist
type BeneficiaryRow = Tables["beneficiaries"]["Row"] & {
  relationship_type?: string | null;
};

// KumbaraRow with sorumlu information
type KumbaraRow = Tables["kumbaras"]["Row"] & {
  sorumlu?: Partial<User>;
};

// ApplicationRow with beneficiary information
type ApplicationRow = Tables["social_aid_applications"]["Row"] & {
  beneficiaries?: Tables["beneficiaries"]["Row"];
};

// Helper to map DB beneficiary to IhtiyacSahibi type
function mapBeneficiary(db: BeneficiaryRow): IhtiyacSahibi {
  return {
    id: db.id.toString(),
    ad: db.ad || "",
    soyad: db.soyad || "",
    tcKimlikNo: db.tc_kimlik_no || "",
    yabanciKimlikNo: "",
    tur: (db.relationship_type === "İhtiyaç Sahibi Kişi"
      ? "ihtiyac-sahibi-kisi"
      : "bakmakla-yukumlu") as IhtiyacSahibiTuru,
    kategori: (db.kategori || "ihtiyac-sahibi-aile") as IhtiyacSahibiKategori,
    dogumTarihi: db.dogum_tarihi ? new Date(db.dogum_tarihi) : new Date(),
    cinsiyet: (db.cinsiyet || "belirtilmemis") as Cinsiyet,
    uyruk: "Türkiye",
    cepTelefonu: db.telefon || "",
    cepTelefonuOperator: "",
    email: db.email || "",
    ulke: "Türkiye",
    sehir: db.il || "",
    ilce: db.ilce || "",
    mahalle: "",
    adres: db.adres || "",
    dosyaNo: db.tc_kimlik_no || "",
    kayitTarihi: new Date(db.created_at),
    durum: (db.durum || "aktif") as IhtiyacDurumu,
    ihtiyacDurumu: (db.ihtiyac_durumu || "orta") as string,
    basvuruSayisi: 0,
    yardimSayisi: 0,
    rizaBeyaniDurumu: "alindi",
    toplamYardimTutari: 0,
    aileHaneBilgileri: {
      medeniHal: (db.medeni_hal || "belirtilmemis") as MedeniHal,
      ailedekiKisiSayisi: db.hane_buyuklugu || 1,
      cocukSayisi: 0,
      yetimSayisi: 0,
      calısanSayisi: 0,
      bakmaklaYukumluSayisi: 0,
    },
    ekonomikSosyalDurum: {
      meslek: db.meslek || "",
      aylikGelir: Number(db.aylik_gelir) || 0,
      egitimDurumu: (db.egitim_durumu || "belirtilmemis") as EgitimDurumu,
    },
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  } as IhtiyacSahibi;
}

// ============================================
// MEMBERS
// ============================================
export async function fetchMembers(options?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<import("@/types").Uye>> {
  const supabase = getSupabaseClient();
  const { page = 1, limit = 10, search } = options || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("members")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `ad.ilike.%${search}%,soyad.ilike.%${search}%,tc_kimlik_no.ilike.%${search}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return toPaginatedResponse((data || []).map(mapMember), count, page, limit);
}

export async function fetchMember(id: number) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createMember(member: Tables["members"]["Insert"]) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember(
  id: number,
  member: Tables["members"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("members")
    .update({ ...member, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMember(id: number) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) throw error;
}

// ============================================
// DONATIONS
// ============================================
export async function fetchDonations(options?: {
  page?: number;
  limit?: number;
  search?: string;
  amac?: string;
}): Promise<PaginatedResponse<import("@/types").Bagis>> {
  const supabase = getSupabaseClient();
  const { page = 1, limit = 10, search, amac } = options || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("donations")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("tarih", { ascending: false });

  if (search) {
    query = query.ilike("bagisci_adi", `%${search}%`);
  }

  if (amac) {
    query = query.eq("amac", amac);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return toPaginatedResponse((data || []).map(mapDonation), count, page, limit);
}

export async function fetchDonation(id: number) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapDonation(data);
}

export async function createDonation(donation: Tables["donations"]["Insert"]) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("donations")
    .insert(donation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDonation(
  id: number,
  donation: Tables["donations"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("donations")
    .update({ ...donation, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDonation(id: number) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("donations").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// ============================================
// BENEFICIARIES
// ============================================
export async function fetchBeneficiaries(options?: {
  page?: number;
  limit?: number;
  search?: string;
  durum?: string;
  ihtiyacDurumu?: string;
}): Promise<PaginatedResponse<IhtiyacSahibi>> {
  const supabase = getSupabaseClient();
  const { page = 1, limit = 10, search, durum, ihtiyacDurumu } = options || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("beneficiaries")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `ad.ilike.%${search}%,soyad.ilike.%${search}%,tc_kimlik_no.ilike.%${search}%`,
    );
  }

  if (durum && durum !== "all") {
    query = query.eq("durum", durum);
  }

  if (ihtiyacDurumu && ihtiyacDurumu !== "all") {
    query = query.eq("ihtiyac_durumu", ihtiyacDurumu);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return toPaginatedResponse(
    (data || []).map(mapBeneficiary),
    count,
    page,
    limit,
  );
}

export async function fetchBeneficiaryById(id: number): Promise<IhtiyacSahibi> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapBeneficiary(data);
}

export async function createBeneficiary(
  beneficiary: Tables["beneficiaries"]["Insert"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("beneficiaries")
    .insert(beneficiary)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBeneficiary(
  id: number,
  beneficiary: Tables["beneficiaries"]["Update"],
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("beneficiaries")
    .update({ ...beneficiary, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBeneficiary(id: number) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("beneficiaries").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function fetchDependentPersons(
  parentId: number,
): Promise<IhtiyacSahibi[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .eq("parent_id", parentId)
    .eq("relationship_type", "Bakmakla Yükümlü Olunan Kişi")
    .order("ad", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapBeneficiary);
}
// ============================================
// KUMBARAS
// ============================================
export async function fetchKumbaras(options?: {
  page?: number;
  limit?: number;
  durum?: string;
}): Promise<PaginatedResponse<Kumbara>> {
  const supabase = getSupabaseClient();
  const { page = 1, limit = 10, durum } = options || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("kumbaras")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (durum) {
    query = query.eq("durum", durum);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return toPaginatedResponse((data || []).map(mapKumbara), count, page, limit);
}
export async function fetchKumbaraByCode(kod: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("kumbaras")
    .select("*")
    .eq("kod", kod)
    .single();

  if (error) throw error;
  return data;
}

export async function createKumbara(kumbara: Tables["kumbaras"]["Insert"]) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("kumbaras")
    .insert(kumbara)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function collectKumbara(data: { id: number; tutar: number }) {
  const supabase = getSupabaseClient();
  const { id, tutar } = data;

  // Get current kumbara
  const { data: current } = await supabase
    .from("kumbaras")
    .select("toplam_toplanan")
    .eq("id", id)
    .single();

  const { data: updated, error } = await supabase
    .from("kumbaras")
    .update({
      durum: "toplandi",
      son_toplama_tarihi: new Date().toISOString(),
      toplam_toplanan: (current?.toplam_toplanan || 0) + tutar,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

// ============================================
// SOCIAL AID APPLICATIONS
// ============================================
export async function fetchApplications(options?: {
  page?: number;
  limit?: number;
  durum?: string;
}): Promise<PaginatedResponse<SosyalYardimBasvuru>> {
  const supabase = getSupabaseClient();
  const { page = 1, limit = 10, durum } = options || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("social_aid_applications")
    .select(
      `
      *,
      beneficiaries (ad, soyad, telefon)
    `,
      { count: "exact" },
    )
    .range(from, to)
    .order("basvuru_tarihi", { ascending: false });

  if (durum) {
    query = query.eq("durum", durum);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return toPaginatedResponse(
    (data || []).map(mapApplication),
    count,
    page,
    limit,
  );
}

// Fetch single application by ID
export async function fetchApplicationById(
  id: number,
): Promise<SosyalYardimBasvuru | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("social_aid_applications")
    .select(
      `
      *,
      beneficiaries (ad, soyad, telefon, tc_kimlik_no, adres)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  if (!data) return null;

  // Map to SosyalYardimBasvuru type
  return mapApplication(data as ApplicationRow);
}

export async function updateApplicationStatus(
  id: number,
  durum: BasvuruDurumu,
  onaylananTutar?: number,
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("social_aid_applications")
    .update({
      durum: durum as string,
      onaylanan_tutar: onaylananTutar,
      degerlendirme_tarihi: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// PAYMENTS
// ============================================
export async function fetchPayments(options?: {
  page?: number;
  limit?: number;
  durum?: string;
}): Promise<PaginatedResponse<Payment>> {
  const supabase = getSupabaseClient();
  const { page = 1, limit = 10, durum } = options || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("payments")
    .select(
      `
        *,
        beneficiaries (ad, soyad)
      `,
      { count: "exact" },
    )
    .range(from, to)
    .order("odeme_tarihi", { ascending: false });

  if (durum) {
    query = query.eq("durum", durum);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return toPaginatedResponse(data || [], count, page, limit);
}

// ============================================
// DASHBOARD STATS
// ============================================
export async function fetchDashboardStats() {
  const supabase = getSupabaseClient();

  // Supabase client yoksa mock data döndür
  if (!supabase) {
    const { fetchDashboardStats: mockFetchDashboardStats } = await import(
      "./mock-service"
    );
    return mockFetchDashboardStats();
  }

  // Bu ayın başlangıcını hesapla
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  try {
    const [
      { count: totalMembers, error: membersError },
      { count: totalBeneficiaries, error: beneficiariesError },
      { data: donations, error: donationsError },
      { count: activeKumbaras, error: kumbarasError },
      { count: pendingApplications, error: applicationsError },
      { data: applications, error: applicationsDataError },
      { data: monthlyPayments, error: monthlyError },
    ] = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }),
      supabase.from("beneficiaries").select("*", { count: "exact", head: true }),
      supabase.from("donations").select("id, member_id, bagisci_adi, tutar, currency, amac, odeme_yontemi, tarih, created_at").order("created_at", { ascending: false }).limit(10),
      supabase
        .from("kumbaras")
        .select("*", { count: "exact", head: true })
        .eq("durum", "aktif"),
      supabase
        .from("social_aid_applications")
        .select("*", { count: "exact", head: true })
        .eq("durum", "beklemede"),
      supabase
        .from("social_aid_applications")
        .select("yardim_turu, onaylanan_tutar"),
      // Bu ay onaylanan yardımlar
      supabase
        .from("social_aid_applications")
        .select("onaylanan_tutar")
        .eq("durum", "onaylandi")
        .gte("degerlendirme_tarihi", startOfMonth.toISOString()),
    ]);

    // Hata varsa konsola yaz
    const errors = [membersError, beneficiariesError, donationsError, kumbarasError, applicationsError, applicationsDataError, monthlyError].filter(Boolean);
    if (errors.length > 0) {
      console.error("[Dashboard] Supabase errors:", errors);
    }

    // Donations null/empty kontrolü
    const safeRecentDonations = donations && donations.length > 0
      ? donations.slice(0, 5).map((d: Tables["donations"]["Row"]) => mapDonation(d))
      : [];

  const totalDonations =
    donations?.reduce(
      (sum: number, d: { tutar: number | null }) => sum + (d.tutar || 0),
      0,
    ) || 0;

  // Yardım dağılımı hesapla
  const aidDistributionMap = new Map<string, number>();
  applications?.forEach(
    (app: { yardim_turu: string | null; onaylanan_tutar: number | null }) => {
      if (app.onaylanan_tutar && app.yardim_turu) {
        const current = aidDistributionMap.get(app.yardim_turu) || 0;
        aidDistributionMap.set(app.yardim_turu, current + app.onaylanan_tutar);
      }
    },
  );

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];
  const aidDistribution = Array.from(aidDistributionMap.entries()).map(
    ([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }),
  );

  // Bu ayki yardım tutarını hesapla
  const monthlyAid =
    monthlyPayments?.reduce(
      (sum: number, p: { onaylanan_tutar: number | null }) =>
        sum + (p.onaylanan_tutar || 0),
      0,
    ) || 0;

  return {
    activeMembers: totalMembers || 0,
    totalBeneficiaries: totalBeneficiaries || 0,
    totalDonations,
    activeKumbaras: activeKumbaras || 0,
    pendingApplications: pendingApplications || 0,
    monthlyAid,
    donationsTrend: 12.5,
    monthlyDonations: [
      { month: "Oca", amount: 45000 },
      { month: "Şub", amount: 52000 },
      { month: "Mar", amount: 48000 },
      { month: "Nis", amount: 61000 },
      { month: "May", amount: 55000 },
      { month: "Haz", amount: 67000 },
    ],
    recentDonations: safeRecentDonations,
    aidDistribution:
      aidDistribution.length > 0
        ? aidDistribution
        : [
            { name: "Gıda", value: 400, color: "#3b82f6" },
            { name: "Eğitim", value: 300, color: "#10b981" },
            { name: "Sağlık", value: 200, color: "#f59e0b" },
            { name: "Barınma", value: 100, color: "#ef4444" },
          ],
  };
  } catch (error) {
    console.error("[Dashboard] Error fetching data:", error);
    // Hata durumunda mock service'e fallback yap
    const { fetchDashboardStats: mockFetchDashboardStats } = await import(
      "./mock-service"
    );
    return mockFetchDashboardStats();
  }
}

// ============================================
// STORAGE & DOCUMENTS
// ============================================

/**
 * Upload file to Supabase Storage
 */
export async function uploadDocument(
  file: File,
  beneficiaryId: string,
  documentType: DocumentType,
  onProgress?: (progress: number) => void,
): Promise<BeneficiaryDocument> {
  const supabase = getSupabaseClient();

  // Generate unique file path
  const fileExt = file.name.split(".").pop();
  // Use crypto for secure random string
  const randomStr = crypto.randomBytes(8).toString("hex");
  const fileName = `${Date.now()}-${randomStr}.${fileExt}`;
  const filePath = `${beneficiaryId}/${fileName}`;

  // Simulate progress since Supabase doesn't provide native progress
  if (onProgress) {
    onProgress(10);
  }

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  if (onProgress) {
    onProgress(70);
  }

  // Save metadata to database
  const { data: docData, error: docError } = await supabase
    .from("documents")
    .insert({
      beneficiary_id: beneficiaryId,
      file_name: file.name,
      file_path: uploadData.path,
      file_type: file.type,
      file_size: file.size,
      document_type: documentType,
    })
    .select()
    .single();

  if (docError) throw docError;

  if (onProgress) {
    onProgress(100);
  }

  return {
    id: docData.id,
    beneficiaryId: docData.beneficiary_id,
    fileName: docData.file_name,
    filePath: docData.file_path,
    fileType: docData.file_type,
    fileSize: docData.file_size,
    documentType: docData.document_type as DocumentType,
    createdAt: new Date(docData.created_at),
  };
}

/**
 * Fetch documents for a beneficiary
 */
export async function fetchDocuments(
  beneficiaryId: string,
): Promise<BeneficiaryDocument[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("beneficiary_id", beneficiaryId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(
    (doc: {
      id: string;
      beneficiary_id: string;
      file_name: string;
      file_path: string;
      file_type: string;
      file_size: number;
      document_type: string;
      created_at: string;
    }) => ({
      id: doc.id,
      beneficiaryId: doc.beneficiary_id,
      fileName: doc.file_name,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      documentType: doc.document_type as DocumentType,
      createdAt: new Date(doc.created_at),
    }),
  );
}

/**
 * Get signed URL for file download
 */
export async function getDocumentUrl(filePath: string): Promise<string> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

/**
 * Delete document
 */
export async function deleteDocument(
  id: string,
  filePath: string,
): Promise<void> {
  const supabase = getSupabaseClient();

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([filePath]);

  if (storageError) throw storageError;

  // Delete metadata
  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (dbError) throw dbError;
}

/**
 * Download document
 */
export async function downloadDocument(
  filePath: string,
  fileName: string,
): Promise<void> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from("documents")
    .download(filePath);

  if (error) throw error;

  // Create download link
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// VEZNE (Cash Treasury) - Stub implementations
// ============================================

export async function fetchVezneler(_params?: {
  page?: number;
  limit?: number;
  durum?: VezneDurum;
}): Promise<PaginatedResponse<Vezne>> {
  // TODO: Implement with actual Supabase table
  return {
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  };
}

export async function fetchVezne(_id: string): Promise<Vezne | null> {
  // TODO: Implement with actual Supabase table
  return null;
}

export async function fetchVezneOzet(): Promise<VezneOzet> {
  // TODO: Implement with actual Supabase table
  return {
    toplamVezne: 0,
    aktifVezne: 0,
    blokeliVezne: 0,
    toplamBakiye: 0,
    toplamBakiyeTRY: 0,
    toplamBakiyeUSD: 0,
    toplamBakiyeEUR: 0,
    bugununIslemleri: [],
    bugununGiris: 0,
    bugununCikis: 0,
  };
}

export async function fetchVezneIslemleri(_params?: {
  page?: number;
  limit?: number;
  vezneId?: string;
}): Promise<PaginatedResponse<VezneIslem>> {
  // TODO: Implement with actual Supabase table
  return {
    data: [],
    total: 0,
    page: 1,
    pageSize: 50,
    totalPages: 0,
  };
}

export async function createVezne(_data: Partial<Vezne>): Promise<Vezne> {
  // TODO: Implement with actual Supabase table
  throw new Error("Not implemented");
}

export async function updateVezne(
  _id: string,
  _data: Partial<Vezne>,
): Promise<Vezne | null> {
  // TODO: Implement with actual Supabase table
  return null;
}

export async function deleteVezne(_id: string): Promise<boolean> {
  // TODO: Implement with actual Supabase table
  return false;
}

export async function createVezneIslem(
  _data: Partial<VezneIslem>,
): Promise<VezneIslem> {
  // TODO: Implement with actual Supabase table
  throw new Error("Not implemented");
}

export async function deleteVezneIslem(_id: string): Promise<boolean> {
  // TODO: Implement with actual Supabase table
  return false;
}

// ============================================
// GELIR-GIDER - Stub implementations
// ============================================

export async function fetchGelirGider(_options: {
  page?: number;
  pageSize?: number;
  islemTuru?: import("@/types").IslemTuru;
  kategori?: import("@/types").Kategori;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedResponse<import("@/types").GelirGider>> {
  // TODO: Implement with actual Supabase table
  return {
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  };
}

export async function fetchGelirGiderOzet(
  _startDate?: string,
  _endDate?: string,
): Promise<import("@/types").GelirGiderOzet> {
  // TODO: Implement with actual Supabase table
  return {
    toplamGelir: 0,
    toplamGider: 0,
    netBakiye: 0,
    aylikGelir: 0,
    aylikGider: 0,
    gelirKategorileri: {},
    giderKategorileri: {},
  };
}

export async function createGelirGider(
  _data: Partial<import("@/types").GelirGider>,
): Promise<import("@/types").GelirGider> {
  // TODO: Implement with actual Supabase table
  throw new Error("Not implemented");
}

export async function updateGelirGider(
  _id: string,
  _data: Partial<import("@/types").GelirGider>,
): Promise<import("@/types").GelirGider | null> {
  // TODO: Implement with actual Supabase table
  return null;
}

export async function deleteGelirGider(_id: string): Promise<boolean> {
  // TODO: Implement with actual Supabase table
  return false;
}
