"use client";

import { useFormContext } from "react-hook-form";
import { Receipt, DollarSign, Users } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomInput } from "@/components/ui/custom-input";
import { MoneyInput } from "@/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BillFormValues } from "@/lib/validations";
import { Avatar } from "../../Avatar";
import { Member } from "../../types";
import { useI18n } from "@/context/i18n-context";

interface BillInfoFieldsProps {
  members: Member[];
}

export function BillInfoFields({ members }: BillInfoFieldsProps) {
  const { t } = useI18n();
  const { control } = useFormContext<BillFormValues>();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Receipt className="h-3.5 w-3.5" />
              {t('bills.name')}
            </FormLabel>
            <FormControl>
              <CustomInput
                placeholder={t('bills.namePlaceholder')}
                className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-border h-11"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="totalAmount"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5" />
              {t('bills.totalAmount')}
            </FormLabel>
            <FormControl>
              <MoneyInput
                placeholder="0"
                className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-border font-mono text-lg h-11"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paidBy"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              {t('bills.paidBy')}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 border-border h-11">
                  <SelectValue placeholder={t('bills.selectPayer')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent position="popper">
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Avatar name={m.name} size="sm" />
                      <span>{m.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
