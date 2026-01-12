"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_ITEMS } from "@/lib/constants";
import { CURRENT_USER } from "@/lib/mock-data";
import { cn, getInitials } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import type { NavItem } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, memo, useCallback } from "react";

const NavItemComponent = memo(function NavItemComponent({
  item,
  depth = 0,
  onClick,
}: {
  item: NavItem;
  depth?: number;
  onClick?: (label: string) => void;
}) {
  const pathname = usePathname();
  const { openMenus, isCollapsed } = useSidebarStore();

  const isOpen = openMenus.includes(item.label);
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;

  const Icon = item.icon;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
        (nextElement?.querySelector("a, button") as HTMLElement)?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevElement = e.currentTarget
          .previousElementSibling as HTMLElement;
        (prevElement?.querySelector("a, button") as HTMLElement)?.focus();
        break;
      case "ArrowRight":
        if (hasChildren && !isOpen) {
          e.preventDefault();
          onClick?.(item.label);
          setTimeout(() => {
            const childContainer = e.currentTarget
              .nextElementSibling as HTMLElement;
            (
              childContainer?.querySelector("a, button") as HTMLElement
            )?.focus();
          }, 0);
        }
        break;
      case "ArrowLeft":
        if (isOpen && hasChildren) {
          e.preventDefault();
          onClick?.(item.label);
        }
        break;
      case "Enter":
      case " ":
        if (hasChildren) {
          e.preventDefault();
          onClick?.(item.label);
        }
        break;
      case "Home":
        e.preventDefault();
        const nav = e.currentTarget.closest("nav");
        (nav?.querySelector("a, button") as HTMLElement)?.focus();
        break;
      case "End":
        e.preventDefault();
        const navItems = e.currentTarget
          .closest("nav")
          ?.querySelectorAll("a, button");
        const lastItem = navItems?.[navItems.length - 1] as HTMLElement;
        lastItem?.focus();
        break;
    }
  }, [hasChildren, isOpen, onClick, item.label]);

  if (hasChildren) {
    const buttonElement = (
      <button
        onClick={() => onClick?.(item.label)}
        onKeyDown={handleKeyDown}
        aria-label={
          isOpen ? `${item.label} menüsünü kapat` : `${item.label} menüsünü aç`
        }
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[44px]",
          "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset",
          isOpen && "bg-sidebar-accent text-sidebar-foreground",
        )}
      >
        {Icon && <Icon className="h-5 w-5 shrink-0" />}
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                !isOpen && "-rotate-90",
              )}
            />
          </>
        )}
      </button>
    );

    return (
      <div className="w-full">
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ) : (
          buttonElement
        )}

        {isOpen && !isCollapsed && (
          <div
            role="menu"
            className="border-sidebar-primary/30 animate-in slide-in-from-top-2 mt-1 ml-4 space-y-1 border-l-2 pl-4 duration-200"
          >
            {item.children?.map((child) => (
              <NavItemComponent
                key={child.label}
                item={child}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const linkElement = (
    <Link
      href={item.href || "#"}
      prefetch={true}
      onKeyDown={handleKeyDown}
      role="menuitem"
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[44px]",
        "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
        "active:bg-sidebar-accent/80 transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset",
        isActive &&
          "bg-sidebar-accent text-sidebar-primary border-sidebar-primary border-l-2",
      )}
    >
      {Icon && (
        <Icon
          className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")}
        />
      )}
      {!isCollapsed && <span>{item.label}</span>}
      {item.badge && !isCollapsed && (
        <span className="bg-sidebar-primary/20 text-sidebar-primary ml-auto rounded-full px-2 py-0.5 text-xs font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
  );

  return isCollapsed ? (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {item.label}
      </TooltipContent>
    </Tooltip>
  ) : (
    linkElement
  );
});

const UserSection = memo(function UserSection() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div
      className={cn(
        "border-sidebar-border/50 bg-sidebar-accent/30 flex items-center gap-3 border-t p-4",
        isCollapsed && "justify-center",
      )}
    >
      <Avatar className="ring-sidebar-primary/40 h-10 w-10 shadow-md ring-2">
        <AvatarFallback className="from-sidebar-primary to-warning text-sidebar-primary-foreground bg-linear-to-br text-sm font-semibold">
          {getInitials(CURRENT_USER.name)}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="min-w-0 flex-1">
          <p className="text-sidebar-foreground truncate text-sm font-semibold">
            {CURRENT_USER.name}
          </p>
          <p className="text-sidebar-foreground/50 truncate text-xs">
            {CURRENT_USER.email}
          </p>
        </div>
      )}
    </div>
  );
});

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setCollapsed, openMenus, toggleMenu } =
    useSidebarStore();

  const handleToggleMenu = useCallback(
    (label: string) => {
      toggleMenu(label);
    },
    [toggleMenu],
  );

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed, setCollapsed]);

  useEffect(() => {
    const activeParent = NAV_ITEMS.find((item) =>
      item.children?.some((child) => child.href === pathname),
    );
    if (activeParent && !openMenus.includes(activeParent.label)) {
      handleToggleMenu(activeParent.label);
    }
  }, [pathname, openMenus, handleToggleMenu]);

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "bg-sidebar border-sidebar-border flex h-screen flex-col border-r",
          "transition-[width] duration-400 ease-in-out",
          isCollapsed ? "w-18" : "w-64",
        )}
      >
        <div
          className={cn(
            "border-sidebar-border flex h-16 items-center border-b px-4",
            "transition-opacity duration-300",
            isCollapsed && "justify-center",
          )}
        >
          {!isCollapsed ? (
            <Link href="/genel" className="group flex items-center gap-3">
              <div className="from-sidebar-primary to-warning flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br shadow-md transition-shadow group-hover:shadow-lg">
                <span className="text-sidebar-primary-foreground text-xl font-bold tracking-wider">
                  K
                </span>
              </div>
              <div className="flex flex-col transition-opacity duration-200">
                <span className="text-sidebar-foreground text-lg font-bold tracking-tight">
                  Kafkasder
                </span>
                <span className="text-sidebar-foreground/60 text-2.5 tracking-wide uppercase">
                  Yönetim Paneli
                </span>
              </div>
            </Link>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="/genel"
                  className="from-sidebar-primary to-warning flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br shadow-md transition-shadow hover:shadow-lg"
                >
                  <span className="text-sidebar-primary-foreground text-xl font-bold tracking-wider">
                    K
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Ana Sayfa</TooltipContent>
            </Tooltip>
          )}
        </div>

        <nav
          role="menu"
          aria-label="Main Navigation"
          aria-orientation="vertical"
          className="scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent flex-1 space-y-1 overflow-y-auto p-3 scroll-smooth"
        >
          <TooltipProvider>
            {NAV_ITEMS.map((item) => (
              <NavItemComponent
                key={item.label}
                item={item}
                onClick={handleToggleMenu}
              />
            ))}
          </TooltipProvider>
        </nav>

        <UserSection />

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleToggleCollapse}
              aria-label={isCollapsed ? "Menüyü genişlet" : "Menüyü daralt"}
              className="from-sidebar-primary to-warning border-background absolute top-20 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-linear-to-br transition-all duration-200 hover:scale-115 hover:shadow-xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
            >
              <ChevronRight
                className={cn(
                  "text-sidebar-primary-foreground h-5 w-5 transition-transform duration-200",
                  !isCollapsed && "rotate-180",
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Genişlet" : "Daralt"}
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
});
