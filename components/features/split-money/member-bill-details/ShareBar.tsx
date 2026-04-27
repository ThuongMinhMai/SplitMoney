import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Link2, Share2 } from "lucide-react";

interface ShareBarProps {
  memberName?: string;
  t?: (key: string) => string; // For i18n later
}

export function ShareBar({ memberName }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: `Sao kê của ${memberName}`,
          text: `Xem sao kê chi tiết của ${memberName} từ Split Money`,
          url: currentUrl,
        });
      } else {
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
    <div className="sticky bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white to-transparent">
      <div className="flex items-center gap-2 max-w-md mx-auto">
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

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95"
        >
          <Share2 className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
