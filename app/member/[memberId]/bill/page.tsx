import { MemberBillContent } from "@/components/features/split-money/MemberBillContent";
import type { MemberBillDetail } from "@/components/features/split-money/types";
import { Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

interface BillPageProps {
  searchParams: Promise<{ data?: string }>;
  params: Promise<{ memberId: string }>;
}

export async function generateMetadata({
  searchParams,
}: BillPageProps): Promise<Metadata> {
  const { data } = await searchParams;
  if (data) {
    try {
      const decodedStr = decodeURIComponent(escape(atob(data)));
      const decoded = JSON.parse(decodedStr) as { memberDetail: MemberBillDetail };
      return {
        title: `Sao kê của ${decoded.memberDetail.memberName} | Split Money Pro`,
        description: `Chi tiết khoản chi của ${decoded.memberDetail.memberName}`,
      };
    } catch {}
  }
  return { title: "Sao kê cá nhân | Split Money Pro" };
}

export default async function BillPage({ searchParams }: BillPageProps) {
  const { data } = await searchParams;

  let memberData: MemberBillDetail | null = null;
  let generatedAt = "";

  if (data) {
    try {
      const decodedStr = decodeURIComponent(escape(atob(data)));
      const decoded = JSON.parse(decodedStr) as {
        memberDetail: MemberBillDetail;
        generatedAt: string;
      };
      memberData = decoded.memberDetail;
      generatedAt = decoded.generatedAt;
    } catch {
      memberData = null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-10 border-b backdrop-blur-md bg-background/80 px-4 h-14 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Receipt className="h-4 w-4" />
          <span className="font-semibold text-foreground">Split Money Pro</span>
        </Link>
        {memberData && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate max-w-[200px]">
              Sao kê: {memberData.memberName}
            </span>
          </>
        )}
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {memberData ? (
          <MemberBillContent data={memberData} generatedAt={generatedAt} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-muted/60">
              <Receipt className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Không tìm thấy sao kê</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Link này không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu người
                chia sẻ link mới.
              </p>
            </div>
            <Link
              href="/"
              className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              ← Về trang chủ
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
