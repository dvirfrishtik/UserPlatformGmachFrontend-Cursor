'use client';

import svgPaths from "../imports/svg-fymzuqw3ph";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: "overview", label: "תמונת מצב", icon: <IconOverview />, href: "#" },
    { id: "history", label: "לוח תנועות", icon: <IconHistory />, href: "#" },
    { id: "donation", label: "יחידות תרומה", icon: <IconDonation />, href: "/" },
    { id: "loan-requests", label: "בקשות הלוואה", icon: <IconLoan />, hasNotification: true, href: "/loan-requests" },
    { id: "loans", label: "הלוואות", icon: <IconLoan />, href: "#" },
    { id: "deposits", label: "פקדונות", icon: <IconSafeBox />, href: "#" },
    { id: "guarantees", label: "הערבויות שלי", icon: <IconShieldCheck />, href: "#" },
  ];

  const lowerMenuItems = [
    { id: "kids", label: "הילדים שלי", icon: <IconKids />, href: "/kids" },
    { id: "documents", label: "מסמכים ואישורים", icon: <IconDocumentDuplicate />, href: "#" },
  ];

  const toolsItems = [
    { id: "programs", label: "תכניות הגמ״ח", icon: <IconSquares2X />, external: true, href: "#" },
    { id: "simulator", label: "סימולטור", icon: <IconCubeTransparent />, external: true, href: "#" },
    { id: "accessibility", label: "נגישות", icon: <IconAccessible />, href: "#" },
  ];

  const accountItems = [
    { id: "account", label: "החשבון שלי", icon: <IconChild />, href: "/account" },
    { id: "referrals", label: "הפניות שלי", icon: <IconContact />, href: "#" },
    { id: "logout", label: "התנתקות", icon: <IconLogOut />, href: "#" },
  ];

  const [toolsOpen, setToolsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const toolsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toolsOpen) return;

    const el = scrollRef.current;
    if (!el) return;

    // Wait for layout after expansion
    requestAnimationFrame(() => {
      const containerRect = el.getBoundingClientRect();
      const target = toolsContentRef.current ?? toolsButtonRef.current;
      if (!target) return;
      const targetRect = target.getBoundingClientRect();

      const bottomOverflow = targetRect.bottom - containerRect.bottom;
      const topOverflow = containerRect.top - targetRect.top;

      // Scroll only when the expanded content isn't fully visible
      if (bottomOverflow > 8) {
        el.scrollBy({ top: bottomOverflow + 12, behavior: "smooth" });
      } else if (topOverflow > 8) {
        el.scrollBy({ top: -(topOverflow + 12), behavior: "smooth" });
      }
    });
  }, [toolsOpen]);

  const getActiveItem = () => {
    if (pathname === "/account") return "account";
    if (pathname === "/kids") return "kids";
    if (pathname === "/loan-requests") return "loan-requests";
    if (pathname === "/" || pathname === "/donation-units") return "donation";
    return "overview";
  };

  const activeItem = getActiveItem();

  return (
    <div
      className="fixed top-0 right-0 h-screen w-[237px] flex flex-col z-50"
      style={{ background: "linear-gradient(196.765deg, rgb(23, 37, 84) 0%, rgb(7, 13, 35) 100%)" }}
    >
      {/* Header with Logo */}
      <div className="h-[72px] flex items-center justify-start px-2 bg-[#172554]">
        <img
          alt="Logo"
          className="h-[36px] w-[156px] object-cover"
          src="/assets/f63bc72c8d54f154a5f6f3eb5aa95d02b6f326c9.png"
        />
      </div>

      {/* Scrollable menu area */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 0; background: transparent; }
        .sidebar-scroll { scrollbar-width: none; }
      `}</style>
      <div ref={scrollRef} className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        <div className="flex flex-col gap-2">
          {menuItems.slice(0, 2).map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeItem === item.id}
              hasNotification={item.hasNotification}
              href={item.href}
            />
          ))}

          <div className="bg-white h-px opacity-30 my-2" />

          {menuItems.slice(2).map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeItem === item.id}
              hasNotification={item.hasNotification}
              href={item.href}
            />
          ))}

          <div className="bg-white h-px opacity-30 my-2" />

          {lowerMenuItems.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeItem === item.id}
              href={item.href}
            />
          ))}

          {/* Expandable tools section */}
          <button
            type="button"
            ref={toolsButtonRef}
            onClick={() => setToolsOpen((v) => !v)}
            className={`h-12 rounded flex items-center px-2 gap-2 relative cursor-pointer transition-colors w-full ${
              toolsOpen ? 'bg-[rgba(255,255,255,0.1)]' : 'hover:bg-[rgba(255,255,255,0.05)]'
            }`}
            dir="rtl"
          >
            <div className="shrink-0">
              <img src="/icons/tools-tab.svg" alt="" width={24} height={24} />
            </div>
            <p className={`${toolsOpen ? 'text-[#cca559] font-bold' : 'text-white'}`}>
              כלים ומידע נוסף
            </p>
            <div className="shrink-0 mr-auto">
              <svg
                width="16" height="16" fill="none" viewBox="0 0 24 24"
                className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {toolsOpen && (
            <div ref={toolsContentRef} className="flex flex-col gap-0.5 pr-4">
              {toolsItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeItem === item.id}
                  external={item.external}
                  href={item.href}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Section - fixed at bottom */}
      <div
        className="relative shrink-0 px-2 pb-4 pt-2"
        style={{
          boxShadow: '0 -12px 28px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Stronger scroll hint shadow/gradient above account area */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-0 right-0 h-6"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="flex flex-col">
          {accountItems.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeItem === item.id}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  hasNotification?: boolean;
  external?: boolean;
  href: string;
}

function SidebarItem({ label, icon, isActive, hasNotification, external, href }: SidebarItemProps) {
  const content = (
    <>
      <div className="shrink-0">{icon}</div>
      <p className={`${isActive ? "text-[#cca559] font-bold" : "text-white"}`}>
        {label}
      </p>
      {external && (
        <div className="shrink-0 mr-auto">
          <IconOpenNewTab />
        </div>
      )}
      {hasNotification && (
        <div className="absolute left-[65px] top-[11px] w-[7px] h-[7px] bg-[#f93e3e] rounded-full" />
      )}
    </>
  );

  if (href !== "#") {
    return (
      <Link
        href={href}
        className={`h-12 rounded flex items-center px-2 gap-2 relative cursor-pointer transition-colors no-underline ${
          isActive ? "bg-[rgba(255,255,255,0.1)]" : "hover:bg-[rgba(255,255,255,0.05)]"
        }`}
        dir="rtl"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`h-12 rounded flex items-center px-2 gap-2 relative cursor-pointer transition-colors ${
        isActive ? "bg-[rgba(255,255,255,0.1)]" : "hover:bg-[rgba(255,255,255,0.05)]"
      }`}
      dir="rtl"
    >
      {content}
    </div>
  );
}

// Icon Components - using SVG paths from Figma Make
function IconOverview() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p21efc00} fill="white" />
        <path d={svgPaths.p14601900} fill="white" />
        <path d={svgPaths.p6ef3600} fill="white" />
      </svg>
    </div>
  );
}

function IconHistory() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p2477c200} fill="white" />
        <path d={svgPaths.p14175080} fill="white" />
      </svg>
    </div>
  );
}

function IconDonation() {
  return (
    <div className="w-6 h-6 relative overflow-clip">
      <div className="absolute inset-[69.19%_56.69%_12.5%_21.44%]">
        <svg className="w-full h-full" fill="none" viewBox="0 0 5.24999 4.395">
          <path d={svgPaths.p3b0a2100} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[12.5%_19.18%_64.43%_49.57%]">
        <svg className="w-full h-full" fill="none" viewBox="0 0 7.50024 5.53731">
          <path d={svgPaths.p284f9b0} fill="white" />
        </svg>
      </div>
      <div className="absolute inset-[24.73%_27.35%_27.05%_19.18%]">
        <svg className="w-full h-full" fill="none" viewBox="0 0 12.8308 11.5723">
          <path d={svgPaths.p1aa6ce00} fill="white" />
        </svg>
      </div>
    </div>
  );
}

function IconLoan() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.p15b9c180} fill="white" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p2fa99780} fill="white" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p2d426900} fill="white" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconSafeBox() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p30d7e500} fill="white" />
      </svg>
    </div>
  );
}

function IconShieldCheck() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.p3a2c1000} fill="white" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconKids() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.p3ea3f380} fill="white" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p7247c80} fill="white" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p3993da80} fill="white" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p3b9aa470} fill="white" fillRule="evenodd" />
        <path d={svgPaths.p30258f00} fill="white" />
        <path d={svgPaths.p279a8980} fill="white" />
      </svg>
    </div>
  );
}

function IconDocumentDuplicate() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p3c1cf100} fill="white" />
        <path d={svgPaths.pd21c400} fill="white" />
        <path d={svgPaths.p37e10300} fill="white" />
      </svg>
    </div>
  );
}

function IconSquares2X() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.pba48880} fill="white" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconCubeTransparent() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p265b8f00} fill="white" />
        <path d={svgPaths.p179f3380} fill="white" />
        <path d={svgPaths.p1ab90a80} fill="white" />
      </svg>
    </div>
  );
}

function IconChild() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.p36ad7bc0} fill="white" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p1ec5b680} fill="white" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconContact() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.pb32d800} fill="white" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconAccessible() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p160b6500} fill="white" />
      </svg>
    </div>
  );
}

function IconLogOut() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p12248b80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M16 16L20 12L16 8" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M20 12H9" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function IconEllipsis() {
  return (
    <div className="w-6 h-6">
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="1.5" fill="white" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
        <circle cx="19" cy="12" r="1.5" fill="white" />
      </svg>
    </div>
  );
}

function IconOpenNewTab() {
  return (
    <div className="w-4 h-4">
      <svg className="w-full h-full" fill="none" viewBox="0 0 16 16">
        <path d={svgPaths.p1f071500} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
