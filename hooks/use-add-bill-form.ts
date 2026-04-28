import { billSchema, type BillFormValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IBill } from "../components/features/split-money/types";

export function useAddBillForm(
  onSave: (bill: Omit<IBill, "id">) => void,
  onClose: () => void,
  initialBill?: IBill | null,
) {
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      name: "",
      totalAmount: 0,
      paidBy: "",
      participants: [],
      splitType: "equal",
      customAmounts: {},
    },
  });

  useEffect(() => {
    form.reset({
      name: initialBill?.name ?? "",
      totalAmount: initialBill?.totalAmount ?? 0,
      paidBy: initialBill?.paidBy ?? "",
      participants: initialBill?.participants ?? [],
      splitType: initialBill?.splitType ?? "equal",
      customAmounts: initialBill?.customAmounts ?? {},
    });
  }, [form, initialBill]);

  const { handleSubmit } = form;

  const onSubmit = (data: BillFormValues) => {
    const cleanedCustomAmounts: Record<string, number> = {};

    if (data.splitType === "custom" && data.customAmounts) {
      data.participants.forEach((pid) => {
        cleanedCustomAmounts[pid] = data.customAmounts![pid] || 0;
      });
    }

    onSave({
      ...data,
      customAmounts: cleanedCustomAmounts,
    });
    onClose();
  };

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
  };
}
