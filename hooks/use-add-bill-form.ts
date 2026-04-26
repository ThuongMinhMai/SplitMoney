import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billSchema, type BillFormValues } from "@/lib/validations";
import type { Bill } from "../components/features/split-money/types";

export function useAddBillForm(onAdd: (bill: Omit<Bill, "id">) => void, onClose: () => void) {
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

  const { watch, setValue, handleSubmit } = form;
  const splitType = watch("splitType");
  const participants = watch("participants");
  const customAmounts = watch("customAmounts") || {};


  const onSubmit = (data: BillFormValues) => {
    const cleanedCustomAmounts: Record<string, number> = {};
    
    if (data.splitType === "custom" && data.customAmounts) {
      data.participants.forEach(pid => {
        cleanedCustomAmounts[pid] = data.customAmounts![pid] || 0;
      });
    }

    onAdd({
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
