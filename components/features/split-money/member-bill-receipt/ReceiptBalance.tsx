import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import { formatMoneyFull } from "../utils";

interface ReceiptBalanceProps {
  balance: number;
  isPositive: boolean;
}

export function ReceiptBalance({ balance, isPositive }: ReceiptBalanceProps) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "mx-6 mb-4 p-4 rounded-sm text-center border",
        isPositive
          ? "bg-[#EAF3DE] border-[#C0DD97]"
          : "bg-[#FCEBEB] border-[#F7C1C1]",
      )}
    >
      <div
        className={cn(
          "text-[9px] uppercase tracking-[0.15em] mb-1 font-sans",
          isPositive ? "text-[#27500A]" : "text-[#791F1F]",
        )}
      >
        {isPositive ? t("receipt.groupOwesYou") : t("receipt.youOweGroup")}
      </div>
      <div
        className={cn(
          "text-[26px] font-medium font-mono",
          isPositive ? "text-[#27500A]" : "text-[#791F1F]",
        )}
      >
        {formatMoneyFull(Math.abs(balance))}
      </div>
      <div
        className={cn(
          "text-[10px] mt-1 font-sans",
          isPositive ? "text-[#3B6D11]" : "text-[#A32D2D]",
        )}
      >
        {isPositive
          ? t("receipt.balancePositiveHint")
          : t("receipt.balanceNegativeHint")}
      </div>
    </div>
  );
}
