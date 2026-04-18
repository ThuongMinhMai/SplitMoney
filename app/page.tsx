"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wallet } from "lucide-react";
import { Avatar } from "@/components/split-money/Avatar";
import { StatCard } from "@/components/split-money/StatCard";
import { AddBillForm } from "@/components/split-money/AddBillForm";
import { MembersCard } from "@/components/split-money/MembersCard";
import { BillsCard } from "@/components/split-money/BillsCard";
import { SummaryCard } from "@/components/split-money/SummaryCard";
import { TransactionsCard } from "@/components/split-money/TransactionsCard";
import { uid, formatMoney } from "@/components/split-money/utils";
import type {
  Member,
  Bill,
  Transaction,
  MemberSummary,
} from "@/components/split-money/types";
import { MemberBillDetails } from "@/components/split-money/MemberBillDetails";
import Image from "next/image";
export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const addMember = useCallback(() => {
    const name = newMemberName.trim();
    if (!name) return;
    setMembers((prev) => [...prev, { id: uid(), name }]);
    setNewMemberName("");
  }, [newMemberName]);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setBills((prev) =>
      prev.filter((b) => b.paidBy !== id && !b.participants.includes(id)),
    );
  }, []);

  const addBill = useCallback((billData: Omit<Bill, "id">) => {
    setBills((prev) => [...prev, { ...billData, id: uid() }]);
  }, []);

  const removeBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getSummaries = useCallback((): MemberSummary[] => {
    const map: Record<string, MemberSummary> = {};
    members.forEach((m) => {
      map[m.id] = { id: m.id, name: m.name, paid: 0, used: 0, balance: 0 };
    });
    bills.forEach((b) => {
      if (map[b.paidBy]) map[b.paidBy].paid += b.totalAmount;
      b.participants.forEach((pid) => {
        if (!map[pid]) return;
        const amt =
          b.splitType === "equal"
            ? b.totalAmount / b.participants.length
            : (b.customAmounts[pid] ?? 0);
        map[pid].used += amt;
      });
    });
    members.forEach((m) => {
      map[m.id].balance = map[m.id].paid - map[m.id].used;
    });
    return Object.values(map);
  }, [members, bills]);

  const getTransactions = useCallback((): Transaction[] => {
    const sums = getSummaries();
    const debtors = sums
      .filter((s) => s.balance < -0.5)
      .sort((a, b) => a.balance - b.balance)
      .map((s) => ({ ...s }));
    const creditors = sums
      .filter((s) => s.balance > 0.5)
      .sort((a, b) => b.balance - a.balance)
      .map((s) => ({ ...s }));
    const txs: Transaction[] = [];
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i],
        c = creditors[j];
      const amt = Math.min(-d.balance, c.balance);
      if (amt > 0.5) txs.push({ from: d.name, to: c.name, amount: amt });
      d.balance += amt;
      c.balance -= amt;
      if (Math.abs(d.balance) < 0.5) i++;
      if (Math.abs(c.balance) < 0.5) j++;
    }
    return txs;
  }, [getSummaries]);

  const summaries = getSummaries();
  const transactions = getTransactions();
  const totalSpent = bills.reduce((a, b) => a + b.totalAmount, 0);

  return (
    <div className="min-h-screen ">
      <header className="sticky top-0 z-40 border-b backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 relative rounded-xl overflow-hidden shadow-md">
              <Image src="/logo.jpg" alt="logo" fill className="object-cover" />
            </div>

            <div>
              <span className="font-bold text-base leading-none tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Split Money Pro
              </span>
              <p className="text-[10px] text-muted-foreground leading-none mt-1 hidden sm:block">
                Chúng ta chả biết gì
              </p>
            </div>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="default"
                className="bg-gradient-to-r text-white from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 gap-2 shadow-md hover:shadow-lg transition-all"
                disabled={members.length === 0}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Thêm khoản chi</span>
                <span className="xs:hidden">Thêm</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-2xl max-h-[92dvh] overflow-y-auto pb-safe bg-white dark:bg-slate-900 border-t-4 border-t-emerald-500"
            >
              <SheetHeader className="mb-5">
                <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Thêm khoản chi mới
                </SheetTitle>
              </SheetHeader>
              <AddBillForm
                members={members}
                onAdd={addBill}
                onClose={() => setIsSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-6xl  mx-auto px-4 sm:px-6 py-6 pb-20">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Tổng chi"
            value={formatMoney(totalSpent)}
            valueClass="text-emerald-700 dark:text-emerald-400"
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatCard
            label="Thành viên"
            value={String(members.length)}
            icon={<Wallet className="h-4 w-4" />}
          />
          <StatCard
            label="Khoản chi"
            value={String(bills.length)}
            icon={<Wallet className="h-4 w-4" />}
          />
        </div>
        <div className="lg:hidden">
          <Tabs defaultValue="overview" className="w-full flex flex-col">
            <TabsList className="w-full grid grid-cols-3 mb-5 h-11 bg-muted/50 p-1">
              <TabsTrigger
                value="overview"
                className="text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="bills"
                className="text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Khoản chi
              </TabsTrigger>
              <TabsTrigger
                value="settle"
                className="text-xs gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Quyết toán
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-0">
              <MembersCard
                members={members}
                newMemberName={newMemberName}
                setNewMemberName={setNewMemberName}
                onAdd={addMember}
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
              onAdd={addMember}
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
    </div>
  );
}
