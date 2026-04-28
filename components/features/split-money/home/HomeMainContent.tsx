import { BillsCard } from "@/components/features/split-money/BillsCard";
import { MemberBillDetails } from "@/components/features/split-money/MemberBillDetails";
import { MembersCard } from "@/components/features/split-money/MembersCard";
import { StatCard } from "@/components/features/split-money/StatCard";
import { SummaryCard } from "@/components/features/split-money/SummaryCard";
import { TransactionsCard } from "@/components/features/split-money/TransactionsCard";
import type {
  IBill,
  IMember,
  IMemberSummary,
  ITransaction,
} from "@/components/features/split-money/types";
// import { formatMoney } from "@/components/features/split-money/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, ReceiptText, UserRound } from "lucide-react";
import { formatMoneyFull } from "../utils";

interface IHomeMainContentProps {
  t: (key: string) => string;
  totalSpent: number;
  members: IMember[];
  bills: IBill[];
  summaries: IMemberSummary[];
  transactions: ITransaction[];
  newMemberName: string;
  setNewMemberName: (name: string) => void;
  handleAddMember: () => void;
  removeMember: (id: string) => void;
  removeBill: (id: string) => void;
}

export function HomeMainContent({
  t,
  totalSpent,
  members,
  bills,
  summaries,
  transactions,
  newMemberName,
  setNewMemberName,
  handleAddMember,
  removeMember,
  removeBill,
}: IHomeMainContentProps) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        data-tour="stats"
      >
        <StatCard
          label={t("common.totalSpent")}
          value={formatMoneyFull(totalSpent)}
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
            <BillsCard bills={bills} members={members} onRemove={removeBill} />
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
  );
}
