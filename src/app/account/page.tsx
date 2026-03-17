'use client';

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PersonalInfoForm } from "@/components/account/PersonalInfoForm";
import { BillingPaymentsHeader } from "@/components/account/BillingPaymentsHeader";
import { PaymentMethodCard } from "@/components/account/PaymentMethodCard";
import { ChargesTable } from "@/components/account/ChargesTable";

export default function AccountPage() {
  const [billingTab, setBillingTab] = useState<"active" | "inactive">("active");
  const [expandedCardId, setExpandedCardId] = useState<number | null>(1);

  // Mock charges data
  const mockCharges = [
    {
      id: 1,
      type: "loan" as const,
      identifier: "#25645",
      childName: "שרה לאה",
      monthlyAmount: "₪ 1,400",
      chargeDay: 5,
      nextChargeDate: "05/02",
      paidPayments: { count: 30, totalAmount: "15,000 ₪" },
    },
    {
      id: 2,
      type: "unit" as const,
      identifier: "#2-4",
      childName: "שרה לאה",
      monthlyAmount: "₪ 240",
      chargeDay: 5,
      nextChargeDate: "05/02",
      paidPayments: { count: 30, totalAmount: "15,000 ₪" },
    },
    {
      id: 3,
      type: "loan" as const,
      identifier: "#25645",
      childName: "שרה לאה",
      monthlyAmount: "₪ 900",
      chargeDay: 12,
      nextChargeDate: "12/02",
      paidPayments: { count: 30, totalAmount: "15,000 ₪" },
    },
    {
      id: 4,
      type: "unit" as const,
      identifier: "#1-3",
      childName: "משה",
      monthlyAmount: "₪ 420",
      chargeDay: 5,
      nextChargeDate: "05/02",
      paidPayments: { count: 24, totalAmount: "10,080 ₪" },
    },
    {
      id: 5,
      type: "loan" as const,
      identifier: "#25646",
      childName: "דוד",
      monthlyAmount: "₪ 240",
      chargeDay: 20,
      nextChargeDate: "20/02",
      paidPayments: { count: 15, totalAmount: "3,600 ₪" },
    },
  ];

  const mockChargesMax = [
    {
      id: 1,
      type: "loan" as const,
      identifier: "#31245",
      childName: "יעקב דוד",
      monthlyAmount: "₪ 800",
      chargeDay: 15,
      nextChargeDate: "15/02",
      paidPayments: { count: 18, totalAmount: "8,500 ₪" },
    },
    {
      id: 2,
      type: "unit" as const,
      identifier: "#3-2",
      childName: "רחל",
      monthlyAmount: "₪ 350",
      chargeDay: 15,
      nextChargeDate: "15/02",
      paidPayments: { count: 22, totalAmount: "6,200 ₪" },
    },
    {
      id: 3,
      type: "loan" as const,
      identifier: "#31246",
      childName: "יעקב דוד",
      monthlyAmount: "₪ 350",
      chargeDay: 1,
      nextChargeDate: "01/02",
      paidPayments: { count: 10, totalAmount: "3,500 ₪" },
    },
  ];

  return (
    <Tabs defaultValue="personal-info" dir="rtl" className="w-full">
      <TabsList className="mb-6 md:mb-8 w-full md:w-auto h-auto md:h-10">
        <TabsTrigger
          value="personal-info"
          className="flex-1 md:flex-none px-3 py-2 md:px-6 md:py-3 text-xs md:text-base"
        >
          <span className="md:hidden">מידע אישי</span>
          <span className="hidden md:inline">מידע אישי</span>
        </TabsTrigger>
        <TabsTrigger
          value="billing"
          className="flex-1 md:flex-none px-3 py-2 md:px-6 md:py-3 text-xs md:text-base"
        >
          <span className="md:hidden">חיוב ותשלום</span>
          <span className="hidden md:inline">פרטי חיוב ותשלומים</span>
        </TabsTrigger>
        <TabsTrigger
          value="permissions"
          className="flex-1 md:flex-none px-3 py-2 md:px-6 md:py-3 text-xs md:text-base"
        >
          <span className="md:hidden">הרשאות</span>
          <span className="hidden md:inline">הרשאות</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal-info" className="flex flex-col gap-6 md:gap-8">
        <PersonalInfoForm />
      </TabsContent>

      <TabsContent value="billing">
        <div className="bg-card shadow-[var(--elevation-sm)] rounded-[var(--radius-card)] p-6 md:p-8">
          <BillingPaymentsHeader
            activeTab={billingTab}
            onTabChange={setBillingTab}
            onAddPaymentMethod={() => console.log("Add payment method")}
          />

          <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <PaymentMethodCard
              bankName="דיסקונט"
              lastFourDigits="988-4893855"
              monthlyCharge="₪ 3,200"
              nextChargeDate="10/01"
              activeChargesCount={mockCharges.length}
              isSelected={expandedCardId === 1}
              onDetailsClick={() => setExpandedCardId(expandedCardId === 1 ? null : 1)}
              hasAnySelected={expandedCardId !== null}
              paymentMethodId={1}
              onTransferAllCharges={() => console.log("Transfer from 1")}
            />
            <PaymentMethodCard
              bankName="MAX"
              lastFourDigits="4783"
              monthlyCharge="₪ 1,500"
              nextChargeDate="15/01"
              activeChargesCount={mockChargesMax.length}
              paymentType="credit-card"
              isSelected={expandedCardId === 2}
              onDetailsClick={() => setExpandedCardId(expandedCardId === 2 ? null : 2)}
              hasAnySelected={expandedCardId !== null}
              paymentMethodId={2}
              onTransferAllCharges={() => console.log("Transfer from 2")}
            />
            <PaymentMethodCard
              bankName="מזרחי"
              lastFourDigits="456-9876"
              monthlyCharge="₪ 2,800"
              nextChargeDate="20/01"
              activeChargesCount={0}
              onDetailsClick={() => console.log("Details clicked")}
              hasAnySelected={expandedCardId !== null}
              paymentMethodId={3}
              onTransferAllCharges={() => console.log("Transfer from 3")}
            />
          </div>

          {expandedCardId === 1 && (
            <div className="mt-6 md:mt-8">
              <ChargesTable charges={mockCharges} />
            </div>
          )}

          {expandedCardId === 2 && (
            <div className="mt-6 md:mt-8">
              <ChargesTable charges={mockChargesMax} />
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="permissions">
        <div className="bg-card rounded-[var(--radius-card)] p-6 md:p-8">
          <p>הרשאות</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
