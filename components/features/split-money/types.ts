export interface IMember {
  id: string;
  name: string;
}

export interface IBill {
  id: string;
  name: string;
  totalAmount: number;
  paidBy: string;
  participants: string[];
  splitType: "equal" | "custom";
  customAmounts: Record<string, number>;
}

export interface ITransaction {
  from: string;
  to: string;
  amount: number;
}

export interface IMemberSummary {
  id: string;
  name: string;
  paid: number;
  used: number;
  balance: number;
}

export interface IBillDetail {
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

export interface IMemberBillDetail {
  memberId: string;
  memberName: string;
  billsPaid: IBillDetail[];
  billsUsed: IBillDetail[];
}

export interface ISmartBill {
  billId: string;
  billName: string;
  totalAmount: number;
  paidBy: string;
  paidByName: string;
  participantShares: { memberId: string; memberName: string; amount: number }[];
}

export interface SmartBill {
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
