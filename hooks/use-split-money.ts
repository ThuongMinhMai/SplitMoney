import type {
  IBill,
  IMember,
  IMemberSummary,
  ITransaction,
} from "@/components/features/split-money/types";
import { uid } from "@/components/features/split-money/utils";
import { useCallback, useMemo, useState } from "react";

export function useSplitMoney() {
  const [members, setMembers] = useState<IMember[]>([]);
  const [bills, setBills] = useState<IBill[]>([]);

  const addMember = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setMembers((prev) => [...prev, { id: uid(), name: trimmedName }]);
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setBills((prev) =>
      prev.filter((b) => b.paidBy !== id && !b.participants.includes(id)),
    );
  }, []);

  const addBill = useCallback((billData: Omit<IBill, "id">) => {
    setBills((prev) => [...prev, { ...billData, id: uid() }]);
  }, []);

  const updateBill = useCallback((id: string, billData: Omit<IBill, "id">) => {
    setBills((prev) =>
      prev.map((bill) => (bill.id === id ? { ...bill, ...billData, id } : bill)),
    );
  }, []);

  const removeBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const summaries = useMemo((): IMemberSummary[] => {
    const map: Record<string, IMemberSummary> = {};
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

  const transactions = useMemo((): ITransaction[] => {
    const sums = summaries;
    const debtors = sums
      .filter((s) => s.balance < -0.5)
      .sort((a, b) => a.balance - b.balance)
      .map((s) => ({ ...s }));
    const creditors = sums
      .filter((s) => s.balance > 0.5)
      .sort((a, b) => b.balance - a.balance)
      .map((s) => ({ ...s }));
    const txs: ITransaction[] = [];
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
  }, [summaries]);

  const totalSpent = useMemo(
    () => bills.reduce((a, b) => a + b.totalAmount, 0),
    [bills],
  );

  return {
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
  };
}
