"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAddBillForm } from "@/hooks/use-add-bill-form";
import { BillInfoFields } from "./add-bill-form/sections/bill-info-fields";
import { ParticipantsField } from "./add-bill-form/sections/participants-field";
import { SplitTypeField } from "./add-bill-form/sections/split-type-field";
import { CustomAmountsSection } from "./add-bill-form/sections/custom-amounts-section";
import type { Member, Bill } from "./types";
import { useState, useEffect } from "react";
import { useI18n } from "@/context/i18n-context";

interface AddBillFormProps {
  members: Member[];
  onAdd: (bill: Omit<Bill, "id">) => void;
  onClose: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function AddBillForm({
  members,
  onAdd,
  onClose,
  onDirtyChange,
}: AddBillFormProps) {
  const { t } = useI18n();

  const { form, onSubmit } = useAddBillForm(
    (data) => {
      onAdd(data);
      toast.success(t('bills.added'));
    },
    onClose
  );

  const isDirty = form.formState.isDirty;

  // Notify parent of dirty state
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6 px-1">
        <BillInfoFields members={members} />
        <ParticipantsField members={members} />
        <SplitTypeField />
        <CustomAmountsSection members={members} />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 border-border hover:bg-muted"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            className="flex-[2] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all text-white h-11"
          >
            {t('common.addBill')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
