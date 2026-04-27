import { cn } from "@/lib/utils";
import { formatMoneyFull } from "../utils";

interface IBalanceSummaryProps {
  totalPaid: number;
  totalUsed: number;
  balance: number;
  isPositive: boolean;
}

export function BalanceSummary({
  totalPaid,
  totalUsed,
  balance,
  isPositive,
}: IBalanceSummaryProps) {
  return (
    <div className="px-5 py-4 border-b border-dashed border-zinc-200">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 uppercase">Đã thanh toán</p>
          <p className="text-lg font-bold text-emerald-600">
            {formatMoneyFull(totalPaid)}
          </p>
          <p className="text-[9px] text-zinc-400 mt-0.5">cho nhóm</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 uppercase">Đã sử dụng</p>
          <p className="text-lg font-bold text-amber-600">
            {formatMoneyFull(totalUsed)}
          </p>
          <p className="text-[9px] text-zinc-400 mt-0.5">từ nhóm</p>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 p-3 rounded-lg text-center",
          isPositive ? "bg-emerald-50" : "bg-rose-50",
        )}
      >
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">
          {isPositive ? "SỐ DƯ ĐƯỢC NHẬN" : "SỐ TIỀN CẦN THANH TOÁN"}
        </p>
        <p
          className={cn(
            "text-2xl font-bold mt-0.5",
            isPositive ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {formatMoneyFull(Math.abs(balance))}
        </p>
      </div>
    </div>
  );
}
