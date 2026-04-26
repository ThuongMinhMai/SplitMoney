"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Trash2,
  Coffee,
  Car,
  Music,
  Beer,
  Utensils,
} from "lucide-react";
import { formatMoney, getBillIcon } from "./utils";
import type { Bill, Member } from "./types";
import { CardCustom } from "../ui/card-custom";

const iconMap = {
  Coffee: Coffee,
  Car: Car,
  Music: Music,
  Beer: Beer,
  Utensils: Utensils,
  Receipt: Receipt,
};

interface BillsCardProps {
  bills: Bill[];
  members: Member[];
  onRemove: (id: string) => void;
}

export function BillsCard({ bills, members, onRemove }: BillsCardProps) {
  if (bills.length === 0) {
    return (
      <CardCustom className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="p-1 rounded-lg bg-emerald-100">
              <Receipt className="h-4 w-4 text-emerald-600" />
            </div>
            Khoản chi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
            <Receipt className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p>Chưa có khoản chi nào</p>
            <p className="text-xs">Thêm khoản chi để bắt đầu</p>
          </div>
        </CardContent>
      </CardCustom>
    );
  }

  return (
    <CardCustom className="shadow-sm hover:shadow-md transition-all h-fit flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100">
            <Receipt className="h-4 w-4 text-emerald-600" />
          </div>
          Khoản chi
          <Badge
            variant="secondary"
            className="ml-auto font-mono text-xs bg-emerald-100 text-emerald-800"
          >
            {bills.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-hidden p-0">
        <div className="h-[400px] overflow-y-auto px-4 pb-4 custom-scrollbar">
          <div className="space-y-2 pr-3">
            {bills.map((bill) => {
              const payer = members.find((m) => m.id === bill.paidBy);
              const IconComponent =
                iconMap[getBillIcon(bill.name) as keyof typeof iconMap] ||
                Receipt;
              const participantNames = bill.participants
                .map((pid) => members.find((m) => m.id === pid)?.name)
                .filter(Boolean);

              return (
                <div
                  key={bill.id}
                  className="rounded-xl border bg-gradient-to-br from-card to-muted/20 p-3 group hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-sm truncate">
                        {bill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        {formatMoney(bill.totalAmount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        onClick={() => onRemove(bill.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                    <span>
                      Người trả:{" "}
                      <span className="text-foreground font-medium">
                        {payer?.name}
                      </span>
                    </span>
                    <span>
                      Chia:{" "}
                      <span className="text-foreground">
                        {bill.splitType === "equal" ? "đều" : "chênh lệch"}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {participantNames.map((n) => (
                      <Badge
                        key={n}
                        variant="secondary"
                        className="text-[10px] h-5 px-1.5 bg-muted/50"
                      >
                        {n}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </CardCustom>
  );
}
