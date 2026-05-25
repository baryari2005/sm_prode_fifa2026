"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarNavIcon } from "./SidebarNavIcon";
import { SidebarSection } from "./SidebarSection";
import {
  SIDEBAR_CONFIG,
  type SidebarSubItemConfig,
} from "@/config/sidebar.config";
import { useAuth } from "@/stores/auth";
import type { PermissionDTO } from "@/features/auth/types/auth.types";
import { hasPermission } from "@/features/auth/libs/permissions";

type Props = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

export function Sidebar({ collapsed, setCollapsed }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const permissions = useAuth((state) => state.user?.permisos ?? []);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const badgeMap: Record<string, number> = {
    pendingVacation: 0,
    pendingLicenses: 0,
  };

  const canSeePermission = useCallback(
    (
      permission?:
        | { modulo: string; accion: string }
        | { modulo: string; accion: string }[]
    ) => {
      if (!permission) return true;
      if (Array.isArray(permission)) {
        return permission.some((item: PermissionDTO) =>
          hasPermission(permissions, item.modulo, item.accion)
        );
      }
      return hasPermission(permissions, permission.modulo, permission.accion);
    },
    [permissions]
  );

  const filterVisibleChildren = useCallback(
    (children?: SidebarSubItemConfig[]): SidebarSubItemConfig[] | undefined => {
      if (!children?.length) return undefined;

      const visible = children
        .map((child) => ({
          ...child,
          children: filterVisibleChildren(child.children),
        }))
        .filter((child) => {
          if (!canSeePermission(child.permission)) return false;
          if (child.children && child.children.length === 0) return false;
          return true;
        });

      return visible.length > 0 ? visible : undefined;
    },
    [canSeePermission]
  );

  const visibleItems = useMemo(() => {
    return SIDEBAR_CONFIG.map((item) => {
      const visibleChildren = filterVisibleChildren(item.children);

      return {
        ...item,
        children: visibleChildren,
      };
    }).filter((item) => {
      const itemIsVisible = canSeePermission(item.permission);

      if (!itemIsVisible) return false;
      if (item.children && item.children.length === 0) return false;

      return true;
    });
  }, [canSeePermission, filterVisibleChildren]);

  const grouped = useMemo(() => {
    return visibleItems.reduce<Record<string, typeof visibleItems>>(
      (acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
      },
      {}
    );
  }, [visibleItems]);

  const getHrefMatchScore = useCallback(
    (href: string) => {
      if (!href) return -1;

      const url = new URL(href, "http://local");
      const queryEntries = Array.from(url.searchParams.entries());

      if (url.pathname === "/") {
        return pathname === "/" ? 10_000 : -1;
      }

      if (queryEntries.length > 0) {
        const samePath = pathname === url.pathname;
        const sameQueryParams = queryEntries.every(
          ([key, value]) => searchParams.get(key) === value
        );

        if (!samePath || !sameQueryParams) return -1;

        return 20_000 + url.pathname.length + queryEntries.length;
      }

      if (pathname === url.pathname) {
        return 10_000 + url.pathname.length;
      }

      if (pathname.startsWith(`${url.pathname}/`)) {
        return url.pathname.length;
      }

      return -1;
    },
    [pathname, searchParams]
  );

  const activeHref = useMemo(() => {
    let bestHref = "";
    let bestScore = -1;

    const checkHref = (href: string) => {
      const score = getHrefMatchScore(href);

      if (score > bestScore) {
        bestHref = href;
        bestScore = score;
      }
    };

    const checkChildren = (children?: SidebarSubItemConfig[]) => {
      if (!children?.length) return;

      children.forEach((child) => {
        checkHref(child.href);
        checkChildren(child.children);
      });
    };

    visibleItems.forEach((item) => {
      checkHref(item.href);
      checkChildren(item.children);
    });

    return bestScore >= 0 ? bestHref : "";
  }, [visibleItems, getHrefMatchScore]);

  const isHrefSelected = useCallback(
    (href: string) => {
      if (!href) return false;
      return href === activeHref;
    },
    [activeHref]
  );

  const hasActiveNestedChild = useCallback(
    function hasActiveNestedChild(
      children?: SidebarSubItemConfig[]
    ): boolean {
      if (!children?.length) return false;

      return children.some(
        (child) =>
          isHrefSelected(child.href) || hasActiveNestedChild(child.children)
      );
    },
    [isHrefSelected]
  );

  useEffect(() => {
    visibleItems.forEach((item) => {
      const itemKey = `item::${item.section}::${item.title}::${
        item.href || "no-href"
      }`;

      const hasActiveChild = hasActiveNestedChild(item.children);
      const itemOwnActive = isHrefSelected(item.href);

      if (item.children?.length && (hasActiveChild || itemOwnActive)) {
        setOpenMenus((prev) => ({
          ...prev,
          [itemKey]: true,
        }));
      }
    });
  }, [visibleItems, hasActiveNestedChild, isHrefSelected]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderChildren = (
    children: SidebarSubItemConfig[] | undefined,
    depth = 0,
    parentKey = "root"
  ) => {
    if (!children?.length) return null;

    return (
      <div
        className={`relative space-y-1 ${
          depth === 0 ? "ml-5 pl-4" : "ml-4 pl-3"
        }`}
      >
        <div className="pointer-events-none absolute bottom-1 left-0 top-1 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

        {children.map((child) => {
          const childKey = `${parentKey}::${child.title}::${
            child.href || "no-href"
          }::${depth}`;

          const childHasChildren = Boolean(child.children?.length);
          const childHasActiveNested = hasActiveNestedChild(child.children);
          const childOwnActive = isHrefSelected(child.href);

          const childActive = childHasChildren
            ? childOwnActive || childHasActiveNested
            : childOwnActive;

          const childOpen = Boolean(openMenus[childKey]);

          const ChildIcon = child.icon;

          if (childHasChildren) {
            return (
              <div key={childKey} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleMenu(childKey)}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    childActive
                      ? "cursor-pointer bg-[#FDBB30]/15 text-[#FDBB30]"
                      : "cursor-pointer text-white/75 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ChildIcon className="h-3.5 w-3.5 shrink-0 text-current" />
                    <span className="truncate">{child.title}</span>
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      childOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {childOpen
                  ? renderChildren(child.children, depth + 1, childKey)
                  : null}
              </div>
            );
          }

          return (
            <Link
              key={childKey}
              href={child.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                childActive
                  ? "bg-[#FDBB30]/15 text-[#FDBB30]"
                  : "text-white/75 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <ChildIcon className="h-3.5 w-3.5 shrink-0 text-current" />
              <span className="truncate">{child.title}</span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="flex h-dvh min-h-dvh min-w-0 shrink-0 flex-col overflow-hidden bg-[#06111F] text-white shadow-[18px_0_45px_rgba(0,0,0,0.22)] transition-all duration-300">
      <div className="relative shrink-0 border-b border-white/10 p-3 xl:p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,169,53,0.22),transparent_45%)]" />

        <div
          className={`relative flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <Image
                  src="/logo.png"
                  alt="104 partidos en el Mundial 2026"
                  width={130}
                  height={130}
                  className="h-auto w-[104px] select-none object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] xl:w-[120px]"
                />
              </div>
            </div>
          )}

          {collapsed && (
            <div className="grid h-12 w-12 place-items-center rounded-2xl">
              <Image
                src="/copa.png"
                alt="Logo copa mundial"
                width={30}
                height={30}
                className="h-auto w-8 select-none object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]"
              />
            </div>
          )}

          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="grid h-10 w-10 place-items-center rounded-xl text-white/75 transition hover:bg-white/10 hover:text-[#FDBB30]"
              aria-label="Contraer menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="relative mx-auto mt-3 grid h-9 w-9 place-items-center rounded-xl text-white/75 transition hover:bg-white/10 hover:text-[#FDBB30]"
            aria-label="Expandir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-3 xl:py-4">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="mb-3">
            <SidebarSection label={section} collapsed={collapsed} />

            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children?.length);

                const itemKey = `item::${item.section}::${item.title}::${
                  item.href || "no-href"
                }`;

                const hasActiveChild = hasActiveNestedChild(item.children);
                const itemOwnActive = isHrefSelected(item.href);

                const itemActive = hasChildren
                  ? Boolean(item.href && (itemOwnActive || hasActiveChild))
                  : itemOwnActive;

                const isOpen = Boolean(openMenus[itemKey]);

                if (hasChildren && !collapsed) {
                  return (
                    <div key={itemKey} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleMenu(itemKey)}
                        className={`
                          group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5
                          text-sm font-medium transition
                          ${
                            itemActive
                              ? "bg-[#FDBB30]/12 text-[#FDBB30]"
                              : "cursor-pointer text-white hover:bg-white/10 hover:text-[#FDBB30]"
                          }
                        `}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              itemActive
                                ? "text-[#FDBB30]"
                                : "text-white transition-colors group-hover:text-[#FDBB30]"
                            }`}
                          />

                          <span className="truncate">{item.title}</span>
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            itemActive
                              ? "text-[#FDBB30]"
                              : "text-white/75 group-hover:text-[#FDBB30]"
                          } ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen ? renderChildren(item.children, 0, itemKey) : null}
                    </div>
                  );
                }

                return (
                  <SidebarNavIcon
                    key={itemKey}
                    Icon={item.icon}
                    href={item.href}
                    title={item.title}
                    active={itemActive}
                    collapsed={collapsed}
                    badgeCount={
                      item.badgeKey ? badgeMap[item.badgeKey] : undefined
                    }
                    highlight={
                      item.badgeKey ? badgeMap[item.badgeKey] > 0 : undefined
                    }
                  />
                );
              })}
            </div>

            <Separator className="my-4 bg-white/10" />
          </div>
        ))}

      </div>
    </aside>
  );
}
