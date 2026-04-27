"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import { useMemberBillDetails } from "@/hooks/use-member-bill-details";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { MemberRow } from "./member-bill-details/member-row";
import type { IBill, IMember } from "./types";

interface MemberBillDetailsProps {
  members: IMember[];
  bills: IBill[];
}

export function MemberBillDetails({ members, bills }: MemberBillDetailsProps) {
  const { t } = useI18n();
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const { memberDetails } = useMemberBillDetails(members, bills);

  const toggleMember = (memberId: string) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  if (members.length === 0 || bills.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {t("details.title")}
          <Badge className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-none">
            {members.length} {t("details.memberCount")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {memberDetails.map((member) => (
            <MemberRow
              key={member.memberId}
              member={member}
              isExpanded={expandedMember === member.memberId}
              onToggle={() => toggleMember(member.memberId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
