import { getSupabaseClient } from "@/lib/supabase/client";
import type { User } from "@/types";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _isInitialized: boolean; // Internal flag to prevent multiple initializations
  _unsubscribe: (() => void) | null; // Store unsubscribe function
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Demo user for testing
const DEMO_USER: User = {
  id: "demo-user-id",
  name: "Demo Kullanıcı",
  email: "demo@kafkasder.org",
  phone: "0532 123 45 67",
  role: "admin",
  avatar: undefined,
  isActive: true,
  lastLogin: new Date(),
  permissions: [
    "donations.view",
    "donations.create",
    "donations.edit",
    "donations.delete",
    "members.view",
    "members.create",
    "members.edit",
    "social-aid.view",
    "social-aid.approve",
    "reports.export",
    "settings.manage",
  ],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date(),
};

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _isInitialized: false,
  _unsubscribe: null,

  initializeAuth: () => {
    // Prevent multiple initializations
    set((state) => {
      if (state._isInitialized) {
        return state;
      }
      return { _isInitialized: true };
    });

    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    // Initial session check - only run once
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || "",
              ad: session.user.user_metadata?.ad || "",
              soyad: session.user.user_metadata?.soyad || "",
              role: session.user.user_metadata?.role || "user",
            } as unknown as User,
            isAuthenticated: true,
          });
        }
      });

    // Listen for auth changes - only attach once
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || "",
              ad: session.user.user_metadata?.ad || "",
              soyad: session.user.user_metadata?.soyad || "",
              role: session.user.user_metadata?.role || "user",
            } as unknown as User,
            isAuthenticated: true,
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
    );

    // Store unsubscribe function
    set({ _unsubscribe: authListener.subscription.unsubscribe });
  },

  login: async (email: string, password: string) => {
    // Prevent multiple concurrent login attempts
    const state = useUserStore.getState();
    if (state.isLoading) {
      console.log("⏳ Login already in progress, skipping...");
      return false;
    }

    console.log("🔥 Login function called", {
      email,
      passwordLength: password.length,
    });
    set({ isLoading: true, error: null });

    // Demo mode: always allow login
    console.log("✅ Demo mode activated");
    const demoUser = { ...DEMO_USER, email: email || "demo@kafkasder.org" };
    console.log("👤 Demo user:", demoUser);

    // Set demo session cookie for middleware
    document.cookie = "demo-session=true; path=/; max-age=86400";

    // Simulate network delay for realistic feel and to prevent double submission
    await new Promise((resolve) => setTimeout(resolve, 800));

    set({
      user: demoUser,
      isAuthenticated: true,
      isLoading: false,
    });
    console.log("🎉 Demo login successful");
    return true;
  },

  logout: async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    // Clear demo session cookie
    document.cookie = "demo-session=; path=/; max-age=0";
    set({ user: null, isAuthenticated: false, error: null });

    // Cleanup auth listener
    set((state) => {
      if (state._unsubscribe) {
        state._unsubscribe();
        return { _unsubscribe: null };
      }
      return state;
    });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
