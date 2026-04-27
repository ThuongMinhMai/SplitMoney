"use client";

import { ShareBar } from "@/components/features/split-money/member-bill-details/ShareBar";
import { MemberBillReceipt } from "@/components/features/split-money/MemberBillReceipt";
import type { IMemberBillDetail } from "@/components/features/split-money/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IInterceptedModalPageProps {
  searchParams: Promise<{ data?: string }>;
}

export default function InterceptedBillModal({
  searchParams,
}: IInterceptedModalPageProps) {
  const router = useRouter();
  const [memberData, setMemberData] = useState<IMemberBillDetail | null>(null);
  const [open, setOpen] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string>("");

  useEffect(() => {
    searchParams.then(({ data }) => {
      if (!data) return;
      try {
        const decodedStr = decodeURIComponent(escape(atob(data)));
        const decoded = JSON.parse(decodedStr) as {
          memberDetail: IMemberBillDetail;
          generatedAt: string;
        };
        setMemberData(decoded.memberDetail);
        setGeneratedAt(decoded.generatedAt);
      } catch {
        router.back();
      }
    });
  }, [searchParams, router]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) router.back();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-xl w-full max-h-[90dvh] overflow-y-auto p-0 gap-0 rounded-2xl border-0 shadow-2xl"
        aria-describedby="bill-modal-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            {memberData ? `Sao kê của ${memberData.memberName}` : "Đang tải..."}
          </DialogTitle>
        </DialogHeader>

        {memberData ? (
          <div className="relative">
            <MemberBillReceipt data={memberData} generatedAt={generatedAt} />
            <ShareBar memberName={memberData.memberName} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Receipt className="h-8 w-8 animate-pulse" />
            <p className="text-sm">Đang tải sao kê...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
