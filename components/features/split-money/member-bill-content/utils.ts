import {
  Car,
  Coffee,
  Droplets,
  Film,
  Gift,
  Home,
  Plane,
  Receipt,
  Scissors,
  ShoppingBag,
  Smartphone,
  Utensils,
  Zap,
} from "lucide-react";
import type { IMemberBillDetail, ISmartBill } from "../types";

export const getBillIcon = (billName: string) => {
  const name = billName.toLowerCase();
  if (name.includes("ăn") || name.includes("cơm") || name.includes("nhà hàng"))
    return Utensils;
  if (name.includes("cafe") || name.includes("trà")) return Coffee;
  if (name.includes("mua") || name.includes("shop")) return ShoppingBag;
  if (name.includes("quà") || name.includes("tặng")) return Gift;
  if (name.includes("nhà") || name.includes("thuê")) return Home;
  if (name.includes("xe") || name.includes("taxi")) return Car;
  if (name.includes("phim") || name.includes("cinema")) return Film;
  if (name.includes("điện") || name.includes("thoại")) return Smartphone;
  if (name.includes("cắt") || name.includes("tóc")) return Scissors;
  if (name.includes("máy") || name.includes("bay")) return Plane;
  if (name.includes("nước") || name.includes("uống")) return Droplets;
  if (name.includes("điện")) return Zap;
  return Receipt;
};

export function mergeBills(data: IMemberBillDetail): ISmartBill[] {
  const billMap = new Map<string, ISmartBill>();
  for (const bill of data.billsPaid) {
    billMap.set(bill.billId, {
      billId: bill.billId,
      billName: bill.billName,
      totalAmount: bill.totalAmount,
      paidBy: bill.paidBy,
      paidByName: bill.paidByName,
      participantShares: [...bill.participantShares],
    });
  }

  for (const bill of data.billsUsed) {
    if (billMap.has(bill.billId)) {
      const existing = billMap.get(bill.billId)!;
      if (
        existing.participantShares.length === 0 &&
        bill.participantShares.length > 0
      ) {
        existing.participantShares = bill.participantShares;
      }
    } else {
      billMap.set(bill.billId, {
        billId: bill.billId,
        billName: bill.billName,
        totalAmount: bill.totalAmount,
        paidBy: bill.paidBy,
        paidByName: bill.paidByName,
        participantShares: bill.participantShares,
      });
    }
  }

  return Array.from(billMap.values());
}
