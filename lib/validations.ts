import { z } from "zod";

export const memberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "members.error.nameMin").max(50, "members.error.nameMax"),
});

export const billSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "bills.error.nameRequired"),
  totalAmount: z.number().positive("bills.error.amountPositive"),
  paidBy: z.string().min(1, "bills.error.payerRequired"),
  participants: z.array(z.string()).min(1, "bills.error.participantsRequired"),
  splitType: z.enum(["equal", "custom"]),
  customAmounts: z.record(z.string(), z.number()).optional(),
}).refine((data) => {
  if (data.splitType === "custom" && data.customAmounts) {
    const totalCustom = Object.values(data.customAmounts).reduce((a, b) => a + b, 0);
    return Math.abs(totalCustom - data.totalAmount) < 1; // Allowance for floating point
  }
  return true;
}, {
  message: "bills.error.totalDiff",
  path: ["customAmounts"],
});

export type MemberFormValues = z.infer<typeof memberSchema>;
export type BillFormValues = z.infer<typeof billSchema>;
