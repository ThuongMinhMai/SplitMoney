"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, Plus, ReceiptText, UserRound, Wallet } from "lucide-react";
import { Avatar } from "@/components/features/split-money/Avatar";
import { StatCard } from "@/components/features/split-money/StatCard";
import { AddBillForm } from "@/components/features/split-money/AddBillForm";
import { MembersCard } from "@/components/features/split-money/MembersCard";
import { BillsCard } from "@/components/features/split-money/BillsCard";
import { SummaryCard } from "@/components/features/split-money/SummaryCard";
import { TransactionsCard } from "@/components/features/split-money/TransactionsCard";
import { uid, formatMoney } from "@/components/features/split-money/utils";
import type {
  IMember,
  IBill,
  ITransaction,
  IMemberSummary,
} from "@/components/features/split-money/types";
import { MemberBillDetails } from "@/components/features/split-money/MemberBillDetails";
import Image from "next/image";
import { useSplitMoney } from "@/hooks/use-split-money";
import { useI18n } from "@/context/i18n-context";
import { ThemeToggle, LanguageToggle } from "@/components/settings-toggles";
import { OnboardingTour } from "@/components/OnboardingTour";
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

  return (
    <div className="min-h-screen ">
      <OnboardingTour />
      <header className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 relative rounded-xl overflow-hidden shadow-md">
              <Image
                src="/logo.jpg"
                sizes="36px"
                alt="logo"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <span className="font-bold text-base leading-none tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                {t("common.appName")}
              </span>
              <p className="text-[10px] text-muted-foreground leading-none mt-1 hidden sm:block">
                {t("common.tagline")}
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1 sm:gap-2 ml-auto"
            data-tour="settings-group"
          >
            <div data-tour="language-toggle">
              <LanguageToggle />
            </div>
            <div data-tour="theme-toggle">
              <ThemeToggle />
            </div>
            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          </div>

          <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button
                size="default"
                className="bg-gradient-to-r text-white from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 gap-2 shadow-md hover:shadow-lg transition-all"
                disabled={members.length < 2}
                data-tour="add-bill"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">{t("common.addBill")}</span>
                <span className="xs:hidden">{t("common.addBill")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-2xl max-h-[92dvh] overflow-y-auto p-4 pb-safe bg-background border-t-4 border-t-emerald-500"
              onPointerDownOutside={(e) => {
                if (isFormDirty) e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                if (isFormDirty) e.preventDefault();
              }}
            >
              <SheetHeader className="mb-5">
                <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  {t("bills.title")}
                </SheetTitle>
              </SheetHeader>
              <AddBillForm
                members={members}
                onAdd={handleAddBill}
                onClose={() => handleSheetOpenChange(false)}
                onDirtyChange={setIsFormDirty}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
          data-tour="stats"
        >
          <StatCard
            label={t("common.totalSpent")}
            value={formatMoney(totalSpent)}
            valueClass="text-emerald-700 dark:text-emerald-400"
            icon={<Banknote className="h-5 w-5" />}
          />
          <StatCard
            label={t("common.members")}
            value={String(members.length)}
            icon={<UserRound className="h-6 w-6" />}
          />
          <StatCard
            label={t("common.bills")}
            value={String(bills.length)}
            icon={<ReceiptText className="h-6 w-6" />}
          />
        </div>
        <div className="lg:hidden">
          <Tabs defaultValue="overview" className="w-full flex flex-col">
            <TabsList className="w-full grid grid-cols-3 mb-5 h-11 bg-muted/50 p-1 border border-border/50">
              <TabsTrigger
                value="overview"
                className="text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {t("common.overview")}
              </TabsTrigger>
              <TabsTrigger
                value="bills"
                className="text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {t("common.bills")}
              </TabsTrigger>
              <TabsTrigger
                value="settle"
                className="text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {t("common.settle")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-0">
              <MembersCard
                members={members}
                newMemberName={newMemberName}
                setNewMemberName={setNewMemberName}
                onAdd={handleAddMember}
                onRemove={removeMember}
              />
              <SummaryCard summaries={summaries} hasBills={bills.length > 0} />
            </TabsContent>

            <TabsContent value="bills" className="mt-0">
              <BillsCard
                bills={bills}
                members={members}
                onRemove={removeBill}
              />
            </TabsContent>

            <TabsContent value="settle" className="space-y-4 mt-0">
              <TransactionsCard transactions={transactions} />
              <MemberBillDetails members={members} bills={bills} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden lg:grid lg:grid-cols-[340px_1fr] gap-6">
          <aside className="space-y-5">
            <MembersCard
              members={members}
              newMemberName={newMemberName}
              setNewMemberName={setNewMemberName}
              onAdd={handleAddMember}
              onRemove={removeMember}
            />
            <BillsCard bills={bills} members={members} onRemove={removeBill} />
          </aside>

          <div className="space-y-5">
            <SummaryCard summaries={summaries} hasBills={bills.length > 0} />
            <TransactionsCard transactions={transactions} />
          </div>
        </div>
        <div className="hidden lg:block mt-5">
          <MemberBillDetails members={members} bills={bills} />
        </div>
      </main>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.confirmExit")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.unsavedChanges")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.back")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsFormDirty(false);
                setIsSheetOpen(false);
                setShowExitConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
