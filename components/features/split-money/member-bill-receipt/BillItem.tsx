import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import type { ISmartBill } from "../types";
import { formatMoneyFull } from "../utils";

function Dot({ variant }: { variant: "me" | "payer" | "other" }) {
  return (
    <span
      className={cn(
        "inline-block w-[5px] h-[5px] rounded-full shrink-0 mr-1.5",
        variant === "me" && "bg-[#534AB7]",
        variant === "payer" && "bg-[#3B6D11]",
        variant === "other" && "bg-zinc-300",
      )}
    />
  );
}

export function BillItem({
  bill,
  memberId,
  memberName,
}: {
  bill: ISmartBill;
  memberId: string;
  memberName: string;
}) {
  const { t } = useI18n();
  const isPayer = bill.paidBy === memberId;
  const myShare =
    bill.participantShares.find((s) => s.memberId === memberId)?.amount ?? 0;
  const othersTotal = bill.totalAmount - myShare;

  return (
    <div className="px-6 py-3 border-b border-zinc-100 last:border-b-0">
      <div className="flex justify-between items-start gap-2">
        <span className="text-[13px] font-medium text-zinc-900 font-sans leading-tight flex-1">
          {bill.billName}
        </span>
        <span className="text-[13px] font-medium font-mono text-zinc-900 whitespace-nowrap">
          {formatMoneyFull(bill.totalAmount)}
        </span>
      </div>

      <div className="mt-1">
        <span className="inline-flex items-center text-[9px] font-medium px-1.5 py-0.5 rounded-sm bg-zinc-100 text-zinc-500 tracking-wide font-sans">
          {isPayer
            ? t("receipt.youPaid")
            : t("receipt.paidBy").replace("{{name}}", bill.paidByName)}
        </span>
      </div>

      <div className="mt-2 pt-2 border-t border-dotted border-zinc-200">
        <div
          className={cn(
            "flex justify-between items-center text-[11px] font-medium font-sans px-2 py-1 rounded-sm mb-2",
            isPayer
              ? "bg-[#EAF3DE] text-[#27500A]"
              : "bg-[#FAEEDA] text-[#633806]",
          )}
        >
          <span>{t("receipt.yourShare")}</span>
          <span className="font-mono">{formatMoneyFull(myShare)}</span>
        </div>

        {bill.participantShares.map((s) => {
          const isMe = s.memberId === memberId;
          const isPayer_ = s.memberId === bill.paidBy;
          return (
            <div
              key={s.memberId}
              className={cn(
                "flex items-center text-[11px] py-0.5",
                isMe ? "text-zinc-900 font-medium" : "text-zinc-500",
              )}
            >
              <Dot
                variant={isMe ? "me" : isPayer_ && !isMe ? "payer" : "other"}
              />
              <span className="flex-1">
                {isMe
                  ? t("receipt.youLabel").replace("{{name}}", s.memberName)
                  : s.memberName}
                {isPayer_ && !isMe && (
                  <span className="text-[9px] text-zinc-400 ml-1">
                    ({t("receipt.payer")})
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px]">
                {formatMoneyFull(s.amount)}
              </span>
            </div>
          );
        })}

        <div
          className={cn(
            "flex justify-between text-[10px] pt-1.5 mt-1.5 border-t border-dotted border-zinc-200",
            isPayer ? "text-[#27500A]" : "text-[#854F0B]",
          )}
        >
          {isPayer ? (
            <>
              <span>{t("receipt.theyOweYou")}</span>
              <span className="font-mono">
                + {formatMoneyFull(othersTotal)}
              </span>
            </>
          ) : (
            <>
              <span>
                {t("receipt.youOwe").replace("{{name}}", bill.paidByName)}
              </span>
              <span className="font-mono">− {formatMoneyFull(myShare)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
