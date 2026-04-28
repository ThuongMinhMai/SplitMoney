import { MemberBillReceipt } from "@/components/features/split-money/MemberBillReceipt";
import type { IMemberBillDetail } from "@/components/features/split-money/types";
import { decodeBillSharePayload } from "@/lib/bill-share-link";
import en from "@/locales/en.json";
import vi from "@/locales/vi.json";
import { Receipt } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

interface BillPageProps {
  searchParams: Promise<{ data?: string; d?: string }>;
  params: Promise<{ memberId: string }>;
}

type LocaleDict = typeof vi;

function getLocaleFromHeaders(acceptLanguage: string | null): "vi" | "en" {
  if (!acceptLanguage) return "vi";
  return acceptLanguage.toLowerCase().startsWith("en") ? "en" : "vi";
}

function getByPath(obj: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, segment) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[segment]
          : undefined,
      obj,
    );
  return typeof value === "string" ? value : path;
}

function translate(
  dict: LocaleDict,
  key: string,
  vars?: Record<string, string>,
): string {
  let text = getByPath(dict, key);
  if (!vars) return text;
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replaceAll(`{{${k}}}`, v);
  });
  return text;
}

export async function generateMetadata({
  searchParams,
}: BillPageProps): Promise<Metadata> {
  const hdrs = await headers();
  const locale = getLocaleFromHeaders(hdrs.get("accept-language"));
  const dict = locale === "en" ? en : vi;
  const { data, d } = await searchParams;
  if (d) {
    const decoded = decodeBillSharePayload(d);
    if (decoded) {
      return {
        title: `${translate(dict, "billPage.meta.titleWithName", { name: decoded.memberDetail.memberName })} | ${translate(dict, "common.appName")}`,
        description: translate(dict, "billPage.meta.descriptionWithName", {
          name: decoded.memberDetail.memberName,
        }),
      };
    }
  }
  if (data) {
    try {
      const decodedStr = decodeURIComponent(escape(atob(data)));
      const decoded = JSON.parse(decodedStr) as {
        memberDetail: IMemberBillDetail;
      };
      return {
        title: `${translate(dict, "billPage.meta.titleWithName", { name: decoded.memberDetail.memberName })} | ${translate(dict, "common.appName")}`,
        description: translate(dict, "billPage.meta.descriptionWithName", {
          name: decoded.memberDetail.memberName,
        }),
      };
    } catch {}
  }
  return {
    title: `${translate(dict, "billPage.meta.title")} | ${translate(dict, "common.appName")}`,
  };
}

export default async function BillPage({ searchParams }: BillPageProps) {
  const hdrs = await headers();
  const locale = getLocaleFromHeaders(hdrs.get("accept-language"));
  const dict = locale === "en" ? en : vi;
  const { data, d } = await searchParams;

  let memberData: IMemberBillDetail | null = null;
  let generatedAt = "";

  if (d) {
    const decoded = decodeBillSharePayload(d);
    if (decoded) {
      memberData = decoded.memberDetail;
      generatedAt = decoded.generatedAt;
    }
  } else if (data) {
    try {
      const decodedStr = decodeURIComponent(escape(atob(data)));
      const decoded = JSON.parse(decodedStr) as {
        memberDetail: IMemberBillDetail;
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
      <header className="sticky top-0 z-10 border-b backdrop-blur-md bg-background/80 px-4 h-14 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Receipt className="h-4 w-4" />
          <span className="font-semibold text-foreground">
            {translate(dict, "common.appName")}
          </span>
        </Link>
        {memberData && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate max-w-[200px]">
              {translate(dict, "billPage.statementLabel", {
                name: memberData.memberName,
              })}
            </span>
          </>
        )}
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {memberData ? (
          <MemberBillReceipt data={memberData} generatedAt={generatedAt} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-muted/60">
              <Receipt className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {translate(dict, "billPage.notFoundTitle")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {translate(dict, "billPage.notFoundDescription")}
              </p>
            </div>
            <Link
              href="/"
              className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {translate(dict, "billPage.backHome")}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
