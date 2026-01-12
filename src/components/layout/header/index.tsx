"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { CURRENT_USER } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useUserStore } from "@/stores/user-store";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useEffect, useId, useState, memo, useCallback } from "react";

const CommandPalette = lazy(() =>
  import("@/components/shared/command-palette").then((mod) => ({
    default: mod.CommandPalette,
  })),
);

export const Header = memo(function Header() {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { logout } = useUserStore();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownId = useId();

  // Hydration fix: wait for client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  const handleLogout = useCallback(() => {
    setLogoutDialogOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
    router.push("/giris");
  }, [logout, router]);

  const handleToggleSidebar = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed, setCollapsed]);

  const handleCommandPaletteOpen = useCallback(() => {
    setCommandOpen(true);
  }, []);

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  return (
    <header className="border-border bg-card/80 flex h-16 items-center justify-between border-b px-4 shadow-sm backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Menüyü daralt/genişlet"
          className="hover:bg-accent min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
          onClick={handleToggleSidebar}
          title="Menüyü daralt/genişlet"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          className="hidden lg:flex text-muted-foreground bg-background border-border hover:bg-accent/50 hover:text-foreground w-48 sm:w-64 items-center justify-start gap-2 transition-all"
          onClick={handleCommandPaletteOpen}
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Ara...</span>
          <kbd className="bg-muted text-muted-foreground text-2.5 pointer-events-none hidden lg:inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono font-medium select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Arama yap"
          className="hover:bg-accent lg:hidden min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
          onClick={handleSearchOpen}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Ara</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Bildirimler (3 yeni)"
          className="hover:bg-accent relative min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
        >
          <Bell className="h-5 w-5" />
          <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shadow-sm">
            3
          </span>
          <span className="sr-only">Bildirimler (3 yeni)</span>
        </Button>

        {isMounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id={dropdownId}
                variant="ghost"
                className="hover:bg-accent flex items-center gap-3 px-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                <Avatar className="ring-primary/20 h-8 w-8 shadow-sm ring-2">
                  <AvatarFallback className="from-primary to-accent text-primary-foreground bg-gradient-to-br text-xs font-semibold">
                    {getInitials(CURRENT_USER.name)}
                  </AvatarFallback>
                </Avatar>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="max-w-20 sm:max-w-25 truncate text-sm font-medium">
                        {CURRENT_USER.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{CURRENT_USER.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {CURRENT_USER.email}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border/50 w-56 shadow-lg"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{CURRENT_USER.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {CURRENT_USER.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        )}
      </div>

      {commandOpen && (
        <Suspense fallback={null}>
          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </Suspense>
      )}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ara</DialogTitle>
          </DialogHeader>
          <Input placeholder="Ara..." autoFocus className="h-12 text-lg" />
        </DialogContent>
      </Dialog>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Çıkış yapmak istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Oturumunuz sonlandırılacak ve giriş sayfasına
              yönlendirileceksiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Çıkış Yap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
});
