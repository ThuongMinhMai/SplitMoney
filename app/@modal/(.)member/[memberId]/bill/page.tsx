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
import { Receipt, Share2, Link2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [copied, setCopied] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    searchParams.then(({ data }) => {
      if (!data) return;
      try {
        const decodedStr = decodeURIComponent(escape(atob(data)));
        const decoded = JSON.parse(decodedStr) as {
          memberDetail: MemberBillDetail;
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

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;

      // Try to use native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `Sao kê của ${memberData?.memberName}`,
          text: `Xem sao kê chi tiết của ${memberData?.memberName} từ Split Money`,
          url: currentUrl,
        });
      } else {
        // Fallback to copy link
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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
            <MemberBillContent data={memberData} generatedAt={generatedAt} />

            {/* Fixed Bottom Share Bar */}
            <div className="sticky bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white to-transparent">
              <div className="flex items-center gap-2 max-w-md mx-auto">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
                    "bg-white border border-gray-200 shadow-md",
                    copied
                      ? "bg-emerald-50 border-emerald-300"
                      : "hover:bg-gray-50 active:scale-95",
                  )}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">
                        Đã sao chép!
                      </span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Sao chép link
                      </span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95"
                >
                  <Share2 className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Chia sẻ
                  </span>
                </button>
              </div>
            </div>
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
