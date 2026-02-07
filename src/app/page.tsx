"use client";

import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { MobileContent } from "@/components/mobile-content";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* ===== MOBILE VERSION (hidden on print) ===== */}
      <div className="md:hidden print:hidden">
        <MobileSidebar />
        <MobileContent />
      </div>

      {/* ===== DESKTOP VERSION (always visible on print) ===== */}
      <div className="hidden md:block print:block">
        {/* Main Resume Container */}
        <div className="min-h-screen w-full bg-[var(--color-surface)] print-container">
          <Sidebar />
          <div className="md:ml-[var(--sidebar-width)] main-content-wrapper print:ml-0">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
}
