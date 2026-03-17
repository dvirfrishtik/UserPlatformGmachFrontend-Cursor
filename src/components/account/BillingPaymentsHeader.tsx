'use client';

interface BillingPaymentsHeaderProps {
  activeTab: "active" | "inactive";
  onTabChange: (tab: "active" | "inactive") => void;
}

export function BillingPaymentsHeader({
  activeTab,
  onTabChange,
}: BillingPaymentsHeaderProps) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center md:justify-between w-full"
      style={{ gap: "var(--spacing-4, 16px)" }}
    >
      {/* Title */}
      <h3
        className="text-foreground text-right whitespace-nowrap shrink-0"
        style={{
          fontSize: "20px",
          fontWeight: "var(--font-weight-bold)",
          lineHeight: "24px",
        }}
      >
        אמצעי התשלום שלי
      </h3>

      {/* Container for Tabs + Separator + Button */}
      <div
        className="flex items-center justify-between md:justify-start"
        style={{ gap: "0", height: "40px" }}
      >
        {/* Tabs */}
        <div
          className="bg-muted flex items-center justify-center relative shrink-0 h-full"
          style={{
            borderRadius: "12px",
            gap: "var(--spacing-2, 8px)",
            padding: "var(--spacing-1-5, 6px)",
            paddingTop: "var(--spacing-1, 4px)",
            paddingBottom: "var(--spacing-1, 4px)",
          }}
          dir="rtl"
        >
          <div
            aria-hidden="true"
            className="absolute border border-border inset-0 pointer-events-none"
            style={{ borderRadius: "12px" }}
          />

          {/* Active Tab */}
          <button
            onClick={() => onTabChange("active")}
            className={`flex items-center justify-center shrink-0 transition-all border-0 h-full ${
              activeTab === "active"
                ? "bg-card text-foreground shadow-sm"
                : "bg-transparent text-muted-foreground"
            }`}
            style={{
              borderRadius: "var(--radius-button)",
              paddingLeft: "var(--spacing-4, 16px)",
              paddingRight: "var(--spacing-4, 16px)",
              paddingTop: activeTab === "active" ? "var(--spacing-2-5, 10px)" : "var(--spacing-3, 12px)",
              paddingBottom: activeTab === "active" ? "var(--spacing-2-5, 10px)" : "var(--spacing-3, 12px)",
              minWidth: "0",
            }}
          >
            <p
              className="text-center whitespace-nowrap"
              style={{
                fontSize: "var(--text-sm, 14px)",
                fontWeight:
                  activeTab === "active"
                    ? "var(--font-weight-bold, 700)"
                    : "var(--font-weight-normal, 400)",
                lineHeight: "18px",
              }}
            >
              פעילים (3)
            </p>
          </button>

          {/* Inactive Tab */}
          <button
            onClick={() => onTabChange("inactive")}
            className={`flex items-center justify-center shrink-0 transition-all border-0 h-full ${
              activeTab === "inactive"
                ? "bg-card text-foreground shadow-sm"
                : "bg-transparent text-muted-foreground"
            }`}
            style={{
              borderRadius: "var(--radius-button)",
              paddingLeft: "var(--spacing-4, 16px)",
              paddingRight: "var(--spacing-4, 16px)",
              paddingTop: activeTab === "inactive" ? "var(--spacing-2-5, 10px)" : "var(--spacing-3, 12px)",
              paddingBottom: activeTab === "inactive" ? "var(--spacing-2-5, 10px)" : "var(--spacing-3, 12px)",
              minWidth: "0",
            }}
          >
            <p
              className="text-center whitespace-nowrap"
              style={{
                fontSize: "var(--text-sm, 14px)",
                fontWeight:
                  activeTab === "inactive"
                    ? "var(--font-weight-bold, 700)"
                    : "var(--font-weight-normal, 400)",
                lineHeight: "18px",
              }}
            >
              לא פעילים (1)
            </p>
          </button>
        </div>

      </div>
    </div>
  );
}
