"use client";

import { useFormContext } from "react-hook-form";
import { Users } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { BillFormValues } from "@/lib/validations";
import { Avatar } from "../../Avatar";
import { Member } from "../../types";
import { useI18n } from "@/context/i18n-context";

interface ParticipantsFieldProps {
  members: Member[];
}

export function ParticipantsField({ members }: ParticipantsFieldProps) {
  const { t } = useI18n();
  const { control } = useFormContext<BillFormValues>();

  return (
    <FormField
      control={control}
      name="participants"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            {t('bills.participants')}
          </FormLabel>
          <div className="border rounded-xl divide-y bg-muted/20 border-border overflow-hidden">
            {members.map((m) => {
              const isSelected = field.value.includes(m.id);
              return (
                <label
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => {
                      const newValue = isSelected
                        ? field.value.filter((p: string) => p !== m.id)
                        : [...field.value, m.id];
                      field.onChange(newValue);
                    }}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 text-white border-muted-foreground/30 h-5 w-5"
                  />
                  <Avatar name={m.name} size="sm" />
                  <span className="text-sm font-medium">{m.name}</span>
                </label>
              );
            })}
            {members.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                {t('members.noMembers')}
              </p>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
