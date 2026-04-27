"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import type { BillFormValues } from "@/lib/validations";
import { Scale, TrendingUp } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { formatMoneyFull } from "../../utils";

export function SplitTypeField() {
  const { t } = useI18n();
  const { control, watch, setValue } = useFormContext<BillFormValues>();
  const splitType = watch("splitType");
  const participants = watch("participants");
  const totalAmount = watch("totalAmount");

  const selectedParticipantCount = participants.length;
  const equalAmount =
    selectedParticipantCount > 0 && totalAmount > 0
      ? totalAmount / selectedParticipantCount
      : 0;

  return (
    <FormField
      control={control}
      name="splitType"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Scale className="h-3 w-3" />
            {t("bills.splitType")}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem value="equal" id="equal" className="sr-only" />
                <Label
                  htmlFor="equal"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all gap-2 h-28 text-center",
                    field.value === "equal"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-border bg-muted/5 hover:bg-muted/10",
                  )}
                >
                  <Scale
                    className={cn(
                      "h-6 w-6",
                      field.value === "equal"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-bold",
                      field.value === "equal"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {t("bills.splitEqual")}
                  </span>
                  {selectedParticipantCount > 0 &&
                    totalAmount > 0 &&
                    field.value === "equal" && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatMoneyFull(equalAmount)}
                      </span>
                    )}
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="sr-only"
                />
                <Label
                  htmlFor="custom"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all gap-2 h-28 text-center",
                    field.value === "custom"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-border bg-muted/5 hover:bg-muted/10",
                  )}
                >
                  <TrendingUp
                    className={cn(
                      "h-6 w-6",
                      field.value === "custom"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-bold",
                      field.value === "custom"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {t("bills.splitCustom")}
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
