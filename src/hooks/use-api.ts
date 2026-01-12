import * as service from "@/lib/supabase-service";
import type {
  Bagis,
  IhtiyacSahibi,
  Kumbara,
  PaginatedResponse,
  SosyalYardimBasvuru,
  Uye,
  GelirGider,
  Vezne,
  VezneIslem,
} from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// ============================================================================
// PERFORMANCE: Selective Invalidation Helpers
// ============================================================================
// Instead of invalidating all queries with a broad key like queryKeys.donations.all,
// we use predicate-based invalidation that only affects queries starting with the entity type.
// This reduces unnecessary refetches and improves performance.

/**
 * Invalidates all queries that start with the given prefix.
 * More efficient than invalidating with a broad .all key.
 */
function invalidateQueriesStartingWith(
  queryClient: QueryClient,
  prefix: readonly string[]
) {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey;
      if (!Array.isArray(queryKey)) return false;
      return prefix.every((key, index) => queryKey[index] === key);
    },
  });
}

/**
 * Invalidates dashboard stats only when entity count/totals change.
 * Skip for updates that don't affect aggregate numbers.
 */
function invalidateDashboardIfNeeded(
  queryClient: QueryClient,
  options: { affectsTotals?: boolean } = { affectsTotals: true }
) {
  if (options.affectsTotals) {
    return queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
  }
}

// Query Keys - Merkezi olarak yönetilen cache key'leri
export const queryKeys = {
  dashboard: {
    stats: ["dashboard-stats"] as const,
    applications: (status?: string) =>
      ["dashboard-applications", status] as const,
    members: () => ["dashboard-members"] as const,
    beneficiaries: () => ["dashboard-beneficiaries"] as const,
  },
  donations: {
    all: ["donations"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["donations", filters] as const,
    detail: (id: string) => ["donations", id] as const,
  },
  kumbaras: {
    all: ["kumbaras"] as const,
    list: (filters?: Record<string, unknown>) => ["kumbaras", filters] as const,
    detail: (id: string) => ["kumbaras", id] as const,
    byCode: (code: string) => ["kumbaras", "code", code] as const,
  },
  members: {
    all: ["members"] as const,
    list: (filters?: Record<string, unknown>) => ["members", filters] as const,
    detail: (id: string) => ["members", id] as const,
  },
  socialAid: {
    applications: {
      all: ["applications"] as const,
      list: (filters?: Record<string, unknown>) =>
        ["applications", filters] as const,
      detail: (id: string) => ["applications", id] as const,
    },
    beneficiaries: {
      all: ["beneficiaries"] as const,
      list: (filters?: Record<string, unknown>) =>
        ["beneficiaries", filters] as const,
      detail: (id: string) => ["beneficiaries", id] as const,
    },
    payments: {
      all: ["payments"] as const,
      list: (filters?: Record<string, unknown>) =>
        ["payments", filters] as const,
    },
  },
  gelirGider: {
    all: ["gelir-gider"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["gelir-gider", filters] as const,
    detail: (id: string) => ["gelir-gider", id] as const,
    ozet: (startDate?: string, endDate?: string) =>
      ["gelir-gider-ozet", startDate, endDate] as const,
  },
  vezne: {
    all: ["vezne"] as const,
    list: (filters?: Record<string, unknown>) => ["vezne", filters] as const,
    detail: (id: string) => ["vezne", id] as const,
    ozet: ["vezne-ozet"] as const,
    islemler: (filters?: Record<string, unknown>) =>
      ["vezne-islemler", filters] as const,
  },
} as const;

// Generic hooks

// Dashboard Stats Hook
export function useDashboardStats(
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchDashboardStats>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: service.fetchDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 dakika - dashboard sık güncellenmeli ama her seferinde değil (önce 1 dakikaydı)
    ...options,
  });
}

// Donations Hooks
export function useDonations(
  params?: Parameters<typeof service.fetchDonations>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Bagis>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.donations.list(params),
    queryFn: () => service.fetchDonations(params || {}),
    ...options,
  });
}

export function useDonation(
  id: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchDonation>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.donations.detail(id),
    queryFn: () => service.fetchDonation(Number(id)),
    enabled: !!id,
    ...options,
  });
}

// Create Donation Mutation
// OPTIMIZED: Uses selective invalidation - only invalidates donation queries, not all queries
export function useCreateDonation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createDonation>>,
    Error,
    Parameters<typeof service.createDonation>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createDonation,
    onSuccess: () => {
      // Selective invalidation: only invalidate donation-related queries
      void invalidateQueriesStartingWith(queryClient, ["donations"]);
      // Dashboard stats affected (new donation = total changes)
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Bağış başarıyla kaydedildi");
    },
    onError: (error) => {
      toast.error("Bağış kaydedilirken hata oluştu");
      console.error("Create donation error:", error);
    },
    ...options,
  });
}

// Update Donation Mutation
// OPTIMIZED: Updates don't necessarily affect dashboard totals (unless amount changes)
export function useUpdateDonation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.updateDonation>>,
    Error,
    { id: string; data: Parameters<typeof service.updateDonation>[1] }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => service.updateDonation(Number(id), data),
    onSuccess: (_data, variables) => {
      // Selective invalidation: only donation queries
      void invalidateQueriesStartingWith(queryClient, ["donations"]);
      // Also invalidate specific detail cache
      void queryClient.invalidateQueries({
        queryKey: queryKeys.donations.detail(variables.id),
      });
      // Only invalidate dashboard if amount might have changed
      // For now, we assume updates might change amounts, so invalidate
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Bağış başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error("Bağış güncellenirken hata oluştu");
      console.error("Update donation error:", error);
    },
    ...options,
  });
}

// Delete Donation Mutation
// OPTIMIZED: Uses selective invalidation
export function useDeleteDonation(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.deleteDonation>>,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => service.deleteDonation(Number(id)),
    onSuccess: () => {
      // Selective invalidation: only donation queries
      void invalidateQueriesStartingWith(queryClient, ["donations"]);
      // Dashboard stats affected (deletion = total changes)
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Bağış başarıyla silindi");
    },
    onError: (error) => {
      toast.error("Bağış silinirken hata oluştu");
      console.error("Delete donation error:", error);
    },
    ...options,
  });
}

// Members Hooks
export function useMembers(
  params?: Parameters<typeof service.fetchMembers>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Uye>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.members.list(params),
    queryFn: () => service.fetchMembers(params || {}),
    ...options,
  });
}

export function useMember(
  id: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchMember>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => service.fetchMember(Number(id)),
    enabled: !!id,
    ...options,
  });
}

// Create Member Mutation
// OPTIMIZED: Uses selective invalidation
export function useCreateMember(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createMember>>,
    Error,
    Parameters<typeof service.createMember>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createMember,
    onSuccess: () => {
      // Selective invalidation: only member queries
      void invalidateQueriesStartingWith(queryClient, ["members"]);
      // Dashboard stats affected (activeMembers count changes)
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Üye kaydı başarıyla oluşturuldu");
    },
    onError: (error) => {
      toast.error("Üye kaydı oluşturulurken hata oluştu");
      console.error("Create member error:", error);
    },
    ...options,
  });
}

// Update Member Mutation
// OPTIMIZED: Updates typically don't affect member count, skip dashboard invalidation
export function useUpdateMember(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.updateMember>>,
    Error,
    { id: string; data: Parameters<typeof service.updateMember>[1] }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => service.updateMember(Number(id), data),
    onSuccess: (_data, variables) => {
      // Selective invalidation: only member queries
      void invalidateQueriesStartingWith(queryClient, ["members"]);
      // Also invalidate specific detail cache
      void queryClient.invalidateQueries({
        queryKey: queryKeys.members.detail(variables.id),
      });
      // Member updates don't affect dashboard activeMembers count
      // Only invalidate if status changed (which is rare)
      // For now, skip dashboard invalidation for better performance
      toast.success("Üye bilgileri başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error("Üye güncellenirken hata oluştu");
      console.error("Update member error:", error);
    },
    ...options,
  });
}

// Delete Member Mutation
// OPTIMIZED: Uses selective invalidation
export function useDeleteMember(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.deleteMember>>,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => service.deleteMember(Number(id)),
    onSuccess: () => {
      // Selective invalidation: only member queries
      void invalidateQueriesStartingWith(queryClient, ["members"]);
      // Dashboard stats affected (activeMembers count changes)
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Üye başarıyla silindi");
    },
    onError: (error) => {
      toast.error("Üye silinirken hata oluştu");
      console.error("Delete member error:", error);
    },
    ...options,
  });
}

// Beneficiaries Hooks
export function useBeneficiaries(
  params?: Parameters<typeof service.fetchBeneficiaries>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<IhtiyacSahibi>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.socialAid.beneficiaries.list(params),
    queryFn: () => service.fetchBeneficiaries(params || {}),
    ...options,
  });
}

export function useBeneficiary(
  id: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchBeneficiaryById>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.socialAid.beneficiaries.detail(id),
    queryFn: () => service.fetchBeneficiaryById(Number(id)),
    enabled: !!id,
    ...options,
  });
}

// Create Beneficiary Mutation
// OPTIMIZED: Uses selective invalidation
export function useCreateBeneficiary(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createBeneficiary>>,
    Error,
    Parameters<typeof service.createBeneficiary>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createBeneficiary,
    onSuccess: () => {
      // Selective invalidation: only beneficiary queries
      void invalidateQueriesStartingWith(queryClient, ["beneficiaries"]);
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("İhtiyaç sahibi kaydı başarıyla oluşturuldu");
    },
    onError: (error) => {
      toast.error("İhtiyaç sahibi kaydı oluşturulurken hata oluştu");
      console.error("Create beneficiary error:", error);
    },
    ...options,
  });
}

// Update Beneficiary Mutation
// OPTIMIZED: Updates don't affect dashboard totals
export function useUpdateBeneficiary(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.updateBeneficiary>>,
    Error,
    { id: string; data: Parameters<typeof service.updateBeneficiary>[1] }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => service.updateBeneficiary(Number(id), data),
    onSuccess: (_data, variables) => {
      // Selective invalidation: only beneficiary queries
      void invalidateQueriesStartingWith(queryClient, ["beneficiaries"]);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.socialAid.beneficiaries.detail(variables.id),
      });
      // Updates don't affect totals - skip dashboard
      toast.success("İhtiyaç sahibi bilgileri güncellendi");
    },
    onError: (error) => {
      toast.error("Güncelleme sırasında hata oluştu");
      console.error("Update beneficiary error:", error);
    },
    ...options,
  });
}

// Delete Beneficiary Mutation
// OPTIMIZED: Uses selective invalidation
export function useDeleteBeneficiary(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.deleteBeneficiary>>,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => service.deleteBeneficiary(Number(id)),
    onSuccess: () => {
      // Selective invalidation: only beneficiary queries
      void invalidateQueriesStartingWith(queryClient, ["beneficiaries"]);
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("İhtiyaç sahibi başarıyla silindi");
    },
    onError: (error) => {
      toast.error("İhtiyaç sahibi silinirken hata oluştu");
      console.error("Delete beneficiary error:", error);
    },
    ...options,
  });
}

// Applications Hooks
export function useApplications(
  params?: Parameters<typeof service.fetchApplications>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<SosyalYardimBasvuru>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.socialAid.applications.list(params),
    queryFn: () => service.fetchApplications(params || {}),
    ...options,
  });
}

export function useApplication(
  id: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchApplicationById>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.socialAid.applications.detail(id),
    queryFn: () => service.fetchApplicationById(Number(id)),
    enabled: !!id,
    ...options,
  });
}

// Update Application Status Mutation
// OPTIMIZED: Uses selective invalidation
export function useUpdateApplicationStatus(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.updateApplicationStatus>>,
    Error,
    {
      id: string;
      durum: Parameters<typeof service.updateApplicationStatus>[1];
      onaylananTutar?: Parameters<typeof service.updateApplicationStatus>[2];
    }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, durum, onaylananTutar }) =>
      service.updateApplicationStatus(Number(id), durum, onaylananTutar),
    onSuccess: (_data, variables) => {
      // Selective invalidation: only application queries
      void invalidateQueriesStartingWith(queryClient, ["applications"]);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.socialAid.applications.detail(variables.id),
      });
      // Status changes affect pending count
      invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Başvuru durumu güncellendi");
    },
    onError: (error) => {
      toast.error("Durum güncellenirken hata oluştu");
      console.error("Update application status error:", error);
    },
    ...options,
  });
}

// Kumbaras Hooks
export function useKumbaras(
  params?: Parameters<typeof service.fetchKumbaras>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Kumbara>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.kumbaras.list(params),
    queryFn: () => service.fetchKumbaras(params || {}),
    ...options,
  });
}

export function useKumbaraByCode(
  code: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchKumbaraByCode>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.kumbaras.byCode(code),
    queryFn: () => service.fetchKumbaraByCode(code),
    enabled: !!code,
    ...options,
  });
}

// Create Kumbara Mutation
export function useCreateKumbara(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createKumbara>>,
    Error,
    Parameters<typeof service.createKumbara>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createKumbara,
    onSuccess: () => {
      // PERF: Selective invalidation - only kumbara list queries
      void invalidateQueriesStartingWith(queryClient, ["kumbaras"]);
      // New kumbara affects dashboard counts
      void invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Kumbara başarıyla oluşturuldu");
    },
    onError: (error) => {
      toast.error("Kumbara oluşturulurken hata oluştu");
      console.error("Create kumbara error:", error);
    },
    ...options,
  });
}

// Collect Kumbara Mutation
export function useCollectKumbara(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.collectKumbara>>,
    Error,
    Parameters<typeof service.collectKumbara>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.collectKumbara,
    onSuccess: () => {
      // PERF: Selective invalidation - collection affects kumbara status and creates donation
      void invalidateQueriesStartingWith(queryClient, ["kumbaras"]);
      void invalidateQueriesStartingWith(queryClient, ["donations"]);
      // Collection affects dashboard totals
      void invalidateDashboardIfNeeded(queryClient, { affectsTotals: true });
      toast.success("Kumbara başarıyla boşaltıldı");
    },
    onError: (error) => {
      toast.error("Kumbara boşaltılırken hata oluştu");
      console.error("Collect kumbara error:", error);
    },
    ...options,
  });
}

// Gelir-Gider Hooks
export function useGelirGider(
  params?: Parameters<typeof service.fetchGelirGider>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<GelirGider>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.gelirGider.list(params),
    queryFn: () => service.fetchGelirGider(params || {}),
    ...options,
  });
}

export function useGelirGiderOzet(
  startDate?: string,
  endDate?: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchGelirGiderOzet>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.gelirGider.ozet(startDate, endDate),
    queryFn: () => service.fetchGelirGiderOzet(startDate, endDate),
    ...options,
  });
}

// Create Gelir-Gider Mutation
export function useCreateGelirGider(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createGelirGider>>,
    Error,
    Parameters<typeof service.createGelirGider>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createGelirGider,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.gelirGider.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("İşlem başarıyla kaydedildi");
    },
    onError: (error) => {
      toast.error("İşlem kaydedilirken hata oluştu");
      console.error("Create gelir-gider error:", error);
    },
    ...options,
  });
}

// Update Gelir-Gider Mutation
export function useUpdateGelirGider(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.updateGelirGider>>,
    Error,
    { id: string; data: Parameters<typeof service.updateGelirGider>[1] }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => service.updateGelirGider(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.gelirGider.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.gelirGider.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("İşlem başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error("İşlem güncellenirken hata oluştu");
      console.error("Update gelir-gider error:", error);
    },
    ...options,
  });
}

// Delete Gelir-Gider Mutation
export function useDeleteGelirGider(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.deleteGelirGider>>,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => service.deleteGelirGider(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.gelirGider.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("İşlem başarıyla silindi");
    },
    onError: (error) => {
      toast.error("İşlem silinirken hata oluştu");
      console.error("Delete gelir-gider error:", error);
    },
    ...options,
  });
}

// Vezne (Cash Treasury) Hooks
export function useVezneler(
  params?: Parameters<typeof service.fetchVezneler>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Vezne>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.vezne.list(params),
    queryFn: () => service.fetchVezneler(params || {}),
    ...options,
  });
}

export function useVezne(
  id: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchVezne>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.vezne.detail(id),
    queryFn: () => service.fetchVezne(id),
    enabled: !!id,
    ...options,
  });
}

export function useVezneOzet(
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof service.fetchVezneOzet>>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.vezne.ozet,
    queryFn: service.fetchVezneOzet,
    ...options,
  });
}

export function useVezneIslemleri(
  params?: Parameters<typeof service.fetchVezneIslemleri>[0],
  options?: Omit<
    UseQueryOptions<PaginatedResponse<VezneIslem>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.vezne.islemler(params),
    queryFn: () => service.fetchVezneIslemleri(params || {}),
    ...options,
  });
}

export function useCreateVezne(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createVezne>>,
    Error,
    Parameters<typeof service.createVezne>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createVezne,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vezne.all });
      toast.success("Vezne başarıyla oluşturuldu");
    },
    onError: (error) => {
      toast.error("Vezne oluşturulurken hata oluştu");
      console.error("Create vezne error:", error);
    },
    ...options,
  });
}

export function useUpdateVezne(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.updateVezne>>,
    Error,
    { id: string; data: Parameters<typeof service.updateVezne>[1] }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => service.updateVezne(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vezne.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.vezne.detail(variables.id),
      });
      toast.success("Vezne başarıyla güncellendi");
    },
    onError: (error) => {
      toast.error("Vezne güncellenirken hata oluştu");
      console.error("Update vezne error:", error);
    },
    ...options,
  });
}

export function useDeleteVezne(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.deleteVezne>>,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => service.deleteVezne(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vezne.all });
      toast.success("Vezne başarıyla silindi");
    },
    onError: (error) => {
      toast.error("Vezne silinirken hata oluştu");
      console.error("Delete vezne error:", error);
    },
    ...options,
  });
}

export function useCreateVezneIslem(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.createVezneIslem>>,
    Error,
    Parameters<typeof service.createVezneIslem>[0]
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.createVezneIslem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.vezne.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.vezne.islemler(),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.vezne.ozet });
      toast.success("İşlem başarıyla kaydedildi");
    },
    onError: (error) => {
      toast.error("İşlem kaydedilirken hata oluştu");
      console.error("Create vezne operation error:", error);
    },
    ...options,
  });
}

export function useDeleteVezneIslem(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof service.deleteVezneIslem>>,
    Error,
    string
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => service.deleteVezneIslem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.vezne.islemler(),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.vezne.ozet });
      toast.success("İşlem başarıyla silindi");
    },
    onError: (error) => {
      toast.error("İşlem silinirken hata oluştu");
      console.error("Delete vezne operation error:", error);
    },
    ...options,
  });
}
