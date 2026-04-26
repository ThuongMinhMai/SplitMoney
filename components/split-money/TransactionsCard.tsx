import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatMoney } from "./utils";
import type { Transaction } from "./types";
import { CardCustom } from "../ui/card-custom";

interface TransactionsCardProps {
  transactions: Transaction[];
}

export function TransactionsCard({ transactions }: TransactionsCardProps) {
  return (
    <CardCustom className="shadow-sm hover:shadow-md transition-all border-emerald-200/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100">
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          Giao dịch
          {transactions.length > 0 && (
            <Badge className="ml-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-mono text-xs">
              {transactions.length} giao dịch
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm space-y-1">
            <CheckCircle2 className="h-10 w-10 mx-auto opacity-30 mb-2 text-emerald-500" />
            <p className="font-medium">Không có giao dịch nào cần thực hiện</p>
            <p className="text-xs">Mọi người đã hòa vốn</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <Badge
                    variant="outline"
                    className="border-rose-200 text-rose-700 bg-rose-50 text-xs font-semibold px-2 py-1"
                  >
                    {tx.from}
                  </Badge>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <Badge
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 bg-emerald-50 text-xs font-semibold px-2 py-1"
                  >
                    {tx.to}
                  </Badge>
                </div>
                <span className="font-mono font-bold text-sm shrink-0 bg-emerald-50 px-2 py-1 rounded-lg">
                  {formatMoney(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </CardCustom>
  );
}
