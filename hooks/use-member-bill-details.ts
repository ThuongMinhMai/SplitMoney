import { useMemo } from "react";
import type { Member, Bill, MemberBillDetail, BillDetail } from "@/components/features/split-money/types";

export function useMemberBillDetails(members: Member[], bills: Bill[]) {
  const memberDetails = useMemo((): MemberBillDetail[] => {
    const details: MemberBillDetail[] = members.map((member) => ({
      memberId: member.id,
      memberName: member.name,
      billsPaid: [],
      billsUsed: [],
    }));

    bills.forEach((bill) => {
      const payer = members.find((m) => m.id === bill.paidBy);

      const billDetail: BillDetail = {
        billId: bill.id,
        billName: bill.name,
        totalAmount: bill.totalAmount,
        paidBy: bill.paidBy,
        paidByName: payer?.name || "Unknown",
        participantShares: [],
      };

      bill.participants.forEach((participantId) => {
        const participant = members.find((m) => m.id === participantId);
        if (!participant) return;

        let amount = 0;
        if (bill.splitType === "equal") {
          amount = bill.totalAmount / bill.participants.length;
        } else {
          amount = (bill.customAmounts && bill.customAmounts[participantId]) || 0;
        }

        billDetail.participantShares.push({
          memberId: participantId,
          memberName: participant.name,
          amount: amount,
        });
      });

      const payerDetail = details.find((d) => d.memberId === bill.paidBy);
      if (payerDetail) {
        payerDetail.billsPaid.push(billDetail);
      }

      bill.participants.forEach((participantId) => {
        const participantDetail = details.find(
          (d) => d.memberId === participantId,
        );
        if (participantDetail) {
          participantDetail.billsUsed.push(billDetail);
        }
      });
    });

    return details;
  }, [members, bills]);

  return { memberDetails };
}
