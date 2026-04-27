"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input";
import { useI18n } from "@/context/i18n-context";
import type { BillFormValues } from "@/lib/validations";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Avatar } from "../../Avatar";
import type { IMember } from "../../types";
import { formatMoneyFull } from "../../utils";

interface ICustomAmountsSectionProps {
  members: IMember[];
}

export function CustomAmountsSection({ members }: ICustomAmountsSectionProps) {
  const { t } = useI18n();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BillFormValues>();

  const splitType = watch("splitType");
  const participants = watch("participants");
  const totalAmount = watch("totalAmount");
  const customAmounts = watch("customAmounts") || {};

  if (splitType !== "custom" || participants.length === 0) return null;

  const currentTotalCustom = participants.reduce(
    (sum, pid) => sum + (customAmounts[pid] || 0),
    0,
  );
  const customTotalDiff = Math.abs(currentTotalCustom - totalAmount);
  const isCustomTotalValid = customTotalDiff < 1;
  const errorMessage =
    (errors.customAmounts as any)?.message ||
    (errors.customAmounts as any)?.root?.message;

  return (
    <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("bills.splitCustom")}
      </FormLabel>
      <div className="space-y-2">
        {participants.map((pid) => {
          const member = members.find((m) => m.id === pid);
          if (!member) return null;
          return (
            <div
              key={pid}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/20"
            >
              <div className="flex items-center gap-2 w-32 shrink-0">
                <Avatar name={member.name} size="sm" />
                <span className="text-sm font-medium truncate">
                  {member.name}
                </span>
              </div>
              <div className="flex-1 relative">
                <MoneyInput
                  placeholder="0"
                  className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-border font-mono"
                  value={customAmounts[pid] || 0}
                  onChange={(val) => {
                    setValue(`customAmounts.${pid}`, val, {
                      shouldValidate: true,
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!isCustomTotalValid && totalAmount > 0 && (
        <Alert
          variant="destructive"
          className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs text-red-800 dark:text-red-400">
            ({formatMoneyFull(currentTotalCustom)}) {t("bills.error.totalDiff")}{" "}
            ({formatMoneyFull(totalAmount)})
          </AlertDescription>
        </Alert>
      )}

      {isCustomTotalValid &&
        totalAmount > 0 &&
        participants.length > 0 &&
        currentTotalCustom > 0 && (
          <Alert className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-xs text-emerald-800 dark:text-emerald-400 font-mono flex items-center justify-between ml-2">
              <span>{t("bills.total")}:</span>
              <span className="font-bold">
                {formatMoneyFull(currentTotalCustom)}
              </span>
            </AlertDescription>
          </Alert>
        )}

      {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
    </div>
  );
}
