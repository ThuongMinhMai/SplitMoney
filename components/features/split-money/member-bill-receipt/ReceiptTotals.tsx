import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import { formatMoneyFull } from "../utils";

interface ReceiptTotalsProps {
  totalPaid: number;
  totalUsed: number;
  balance: number;
  isPositive: boolean;
}

export function ReceiptTotals({
  totalPaid,
  totalUsed,
  balance,
  isPositive,
}: ReceiptTotalsProps) {
  const { t } = useI18n();
  return (
    <div className="px-6 py-3 border-t border-dashed border-zinc-200 text-[12px]">
      <div className="flex justify-between py-0.5 text-zinc-500">
        <span>{t("receipt.totalYouPaid")}</span>
        <span className="font-mono">{formatMoneyFull(totalPaid)}</span>
      </div>
      <div className="flex justify-between py-0.5 text-zinc-500">
        <span>{t("receipt.totalYouUsed")}</span>
        <span className="font-mono">{formatMoneyFull(totalUsed)}</span>
      </div>
      <div className="flex justify-between py-2 mt-2 border-t border-zinc-300 text-[14px] font-medium text-zinc-900">
        <span>{t("receipt.balance")}</span>
        <span
          className={cn(
            "font-mono",
            isPositive ? "text-[#27500A]" : "text-[#791F1F]"
          )}
        >
          {isPositive ? "+" : "−"} {formatMoneyFull(Math.abs(balance))}
        </span>
      </div>
    </div>
  );
}
