export interface Member {
  id: string;
  name: string;
}

export interface Bill {
  id: string;
  name: string;
  totalAmount: number;
  paidBy: string;
  participants: string[];
  splitType: "equal" | "custom";
  customAmounts: Record<string, number>;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface MemberSummary {
  id: string;
  name: string;
  paid: number;
  used: number;
  balance: number;
}

export interface BillDetail {
  billId: string;
  billName: string;
  totalAmount: number;
  paidBy: string;
  paidByName: string;
  participantShares: {
    memberId: string;
    memberName: string;
    amount: number;
  }[];
}

export interface MemberBillDetail {
  memberId: string;
  memberName: string;
  billsPaid: BillDetail[];
  billsUsed: BillDetail[];
}
