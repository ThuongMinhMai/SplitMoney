import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { formatMoney } from "./utils";
import type { MemberSummary } from "./types";
import { CardCustom } from "../ui/card-custom";

interface SummaryCardProps {
  summaries: MemberSummary[];
  hasBills: boolean;
}

export function SummaryCard({ summaries, hasBills }: SummaryCardProps) {
  return (
    <CardCustom className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </div>
          Sao kê từng người
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasBills || summaries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
            <TrendingUp className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p>Thêm khoản chi để xem sao kê</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="text-xs font-semibold">
                    Thành viên
                  </TableHead>
                  <TableHead className="text-xs text-right font-semibold">
                    Đã chi
                  </TableHead>
                  <TableHead className="text-xs text-right font-semibold">
                    Đã dùng
                  </TableHead>
                  <TableHead className="text-xs text-right font-semibold">
                    Chênh lệch
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.name} size="sm" />
                        <span className="font-medium text-sm">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-emerald-700 py-2.5 font-semibold">
                      {formatMoney(s.paid)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-rose-600 py-2.5 font-semibold">
                      {formatMoney(s.used)}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <span
                        className={cn(
                          "font-mono font-bold text-sm px-2 py-0.5 rounded-full",
                          s.balance >= 0
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-rose-600 bg-rose-50",
                        )}
                      >
                        {s.balance >= 0 ? "+" : ""}
                        {formatMoney(s.balance)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </CardCustom>
  );
}
