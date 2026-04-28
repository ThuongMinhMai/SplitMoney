import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import { CheckCircle2, Link2, Share2 } from "lucide-react";
import { useRef, useState } from "react";

interface ShareBarProps {
  memberName?: string;
}

export function ShareBar({ memberName }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const shortenedUrlRef = useRef<string | null>(null);

  const withTimeout = async (promise: Promise<Response>, ms: number) => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Short link timeout")), ms),
    );
    return Promise.race([promise, timeoutPromise]);
  };

  const getShareableUrl = async () => {
    if (shortenedUrlRef.current) return shortenedUrlRef.current;
    const originalUrl = window.location.href;
    try {
      const response = (await withTimeout(
        fetch(
          `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`,
        ),
        5000,
      )) as Response;
      if (response.ok) {
        const shortUrl = (await response.text()).trim();
        if (shortUrl) {
          shortenedUrlRef.current = shortUrl;
          return shortUrl;
        }
      }
    } catch {
      // Fallback to original URL when shortener is unreachable.
    }
    return originalUrl;
  };

  const handleShare = async () => {
    try {
      const currentUrl = await getShareableUrl();
      if (navigator.share) {
        await navigator.share({
          title: t("share.title", { name: memberName }),
          text: t("share.description", { name: memberName }),
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
      const currentUrl = await getShareableUrl();
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
                {t("share.copied")}
              </span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {t("share.copyLink")}
              </span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95"
        >
          <Share2 className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">
            {t("share.shareBtn")}
          </span>
        </button>
      </div>
    </div>
  );
}
