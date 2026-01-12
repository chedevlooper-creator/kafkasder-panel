import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  openMenus: string[];
  setCollapsed: (collapsed: boolean) => void;
  toggleMenu: (label: string) => void;
  closeAllMenus: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      openMenus: [],

      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),

      toggleMenu: (label) =>
        set((state) => ({
          openMenus: state.openMenus.includes(label)
            ? state.openMenus.filter((m) => m !== label)
            : [...state.openMenus, label],
        })),

      closeAllMenus: () => set({ openMenus: [] }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        openMenus: state.openMenus,
      }),
    },
  ),
);
