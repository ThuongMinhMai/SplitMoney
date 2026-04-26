"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberBillContent } from "@/components/features/split-money/MemberBillContent";
import type { MemberBillDetail } from "@/components/features/split-money/types";
import { Receipt } from "lucide-react";

interface InterceptedModalPageProps {
  searchParams: Promise<{ data?: string }>;
}

export default function InterceptedBillModal({
  searchParams,
}: InterceptedModalPageProps) {
  const router = useRouter();
  const [memberData, setMemberData] = useState<MemberBillDetail | null>(null);
  const [open, setOpen] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string>("");

  useEffect(() => {
    searchParams.then(({ data }) => {
      if (!data) return;
      try {
        // safe atob for unicode
        const decodedStr = decodeURIComponent(escape(atob(data)));
        const decoded = JSON.parse(decodedStr) as {
          memberDetail: MemberBillDetail;
          generatedAt: string;
        };
        setMemberData(decoded.memberDetail);
        setGeneratedAt(decoded.generatedAt);
      } catch {
        // invalid data param — just close
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
        className="max-w-lg w-full max-h-[90dvh] overflow-y-auto p-0 gap-0 rounded-2xl border-0 shadow-2xl"
        aria-describedby="bill-modal-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            {memberData ? `Sao kê của ${memberData.memberName}` : "Đang tải..."}
          </DialogTitle>
        </DialogHeader>

        {memberData ? (
          <div className="p-4">
            <MemberBillContent data={memberData} generatedAt={generatedAt} />
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
