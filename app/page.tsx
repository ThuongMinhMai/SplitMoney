"use client";

import { useState, useCallback, useRef } from "react";
import type { IBill } from "@/components/features/split-money/types";
import { useSplitMoney } from "@/hooks/use-split-money";
import { useI18n } from "@/context/i18n-context";
import { OnboardingTour } from "@/components/OnboardingTour";
import { HomeHeader } from "@/components/features/split-money/home/HomeHeader";
import { HomeMainContent } from "@/components/features/split-money/home/HomeMainContent";
import { ExitConfirmDialog } from "@/components/features/split-money/home/ExitConfirmDialog";

export default function Home() {
  const {
    members,
    bills,
    addMember,
    removeMember,
    addBill,
    removeBill,
    summaries,
    transactions,
    totalSpent,
  } = useSplitMoney();

  const { t } = useI18n();

  const [newMemberName, setNewMemberName] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSheetOpenChange = (open: boolean) => {
    if (!open && isFormDirty && !isSubmittingRef.current) {
      setShowExitConfirm(true);
      return;
    }
    setIsSheetOpen(open);
    if (!open) {
      setIsFormDirty(false);
      isSubmittingRef.current = false;
    }
  };

  const handleAddMember = useCallback(() => {
    addMember(newMemberName);
    setNewMemberName("");
  }, [addMember, newMemberName]);

  const handleAddBill = useCallback(
    (billData: Omit<IBill, "id">) => {
      isSubmittingRef.current = true;
      addBill(billData);
      setIsFormDirty(false);
      setIsSheetOpen(false);
    },
    [addBill],
  );

  const handleExitConfirm = useCallback(() => {
    setIsFormDirty(false);
    setIsSheetOpen(false);
    setShowExitConfirm(false);
  }, []);

  return (
    <div className="min-h-screen">
      <OnboardingTour />
      
      <HomeHeader 
        t={t}
        isSheetOpen={isSheetOpen}
        onSheetOpenChange={handleSheetOpenChange}
        members={members}
        onAddBill={handleAddBill}
        isFormDirty={isFormDirty}
        setIsFormDirty={setIsFormDirty}
      />

      <HomeMainContent 
        t={t}
        totalSpent={totalSpent}
        members={members}
        bills={bills}
        summaries={summaries}
        transactions={transactions}
        newMemberName={newMemberName}
        setNewMemberName={setNewMemberName}
        handleAddMember={handleAddMember}
        removeMember={removeMember}
        removeBill={removeBill}
      />

      <ExitConfirmDialog 
        t={t}
        isOpen={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        onConfirm={handleExitConfirm}
      />
    </div>
  );
}
