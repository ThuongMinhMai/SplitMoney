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
    updateBill,
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
  const [editingBill, setEditingBill] = useState<IBill | null>(null);
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
      setEditingBill(null);
    }
  };

  const handleAddMember = useCallback(() => {
    addMember(newMemberName);
    setNewMemberName("");
  }, [addMember, newMemberName]);

  const handleAddBill = useCallback(
    (billData: Omit<IBill, "id">) => {
      isSubmittingRef.current = true;
      if (editingBill) {
        updateBill(editingBill.id, billData);
      } else {
        addBill(billData);
      }
      setIsFormDirty(false);
      setIsSheetOpen(false);
    },
    [addBill, editingBill, updateBill],
  );

  const handleStartAddBill = useCallback(() => {
    setEditingBill(null);
  }, []);

  const handleEditBill = useCallback((bill: IBill) => {
    isSubmittingRef.current = false;
    setEditingBill(bill);
    setIsFormDirty(false);
    setIsSheetOpen(true);
  }, []);

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
        editingBill={editingBill}
        onStartAddBill={handleStartAddBill}
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
        editBill={handleEditBill}
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
