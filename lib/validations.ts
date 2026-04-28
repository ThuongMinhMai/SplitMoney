import { z } from "zod";

export const memberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, "members.error.nameMin")
    .max(50, "members.error.nameMax"),
});

export const billSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "bills.error.nameRequired"),
    totalAmount: z.number().positive("bills.error.amountPositive"),
    paidBy: z.string().min(1, "bills.error.payerRequired"),
    participants: z
      .array(z.string())
      .min(1, "bills.error.participantsRequired"),
    splitType: z.enum(["equal", "custom"]),
    customAmounts: z.record(z.string(), z.number()).optional(),
  })
  .refine(
    (data) => {
      if (data.splitType === "custom") {
        if (!data.customAmounts) return false;
        // Kiểm tra tất cả người tham gia phải có số tiền > 0
        return data.participants.every(
          (pid) => (data.customAmounts?.[pid] || 0) > 0,
        );
      }
      return true;
    },
    {
      message: "bills.error.amountRequired", // Lỗi: Vui lòng nhập số tiền cho tất cả thành viên
      path: ["customAmounts"],
    },
  )
  // Refine 2: Kiểm tra tổng số tiền có khớp không
  .refine(
    (data) => {
      if (data.splitType === "custom" && data.customAmounts) {
        const totalCustom = data.participants.reduce(
          (sum, pid) => sum + (data.customAmounts?.[pid] || 0),
          0,
        );
        return Math.abs(totalCustom - data.totalAmount) < 1;
      }
      return true;
    },
    {
      message: "bills.error.totalDiff",
      path: ["customAmounts"],
    },
  );

export type MemberFormValues = z.infer<typeof memberSchema>;
export type BillFormValues = z.infer<typeof billSchema>;
