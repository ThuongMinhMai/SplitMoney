"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "./Avatar";
import { formatMoneyFull } from "./utils";
import {
  ChevronDown,
  ChevronUp,
  Receipt,
  User,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Member, Bill, MemberBillDetail, BillDetail } from "./types";

interface MemberBillDetailsProps {
  members: Member[];
  bills: Bill[];
}

export function MemberBillDetails({ members, bills }: MemberBillDetailsProps) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Tính toán chi tiết cho từng thành viên
  const getMemberBillDetails = (): MemberBillDetail[] => {
    const details: MemberBillDetail[] = members.map((member) => ({
      memberId: member.id,
      memberName: member.name,
      billsPaid: [],
      billsUsed: [],
    }));

    bills.forEach((bill) => {
      const payer = members.find((m) => m.id === bill.paidBy);

      // Chi tiết cho người trả
      const billDetail: BillDetail = {
        billId: bill.id,
        billName: bill.name,
        totalAmount: bill.totalAmount,
        paidBy: bill.paidBy,
        paidByName: payer?.name || "Unknown",
        participantShares: [],
      };

      // Tính số tiền mỗi người tham gia
      bill.participants.forEach((participantId) => {
        const participant = members.find((m) => m.id === participantId);
        if (!participant) return;

        let amount = 0;
        if (bill.splitType === "equal") {
          amount = bill.totalAmount / bill.participants.length;
        } else {
          amount = bill.customAmounts[participantId] || 0;
        }

        billDetail.participantShares.push({
          memberId: participantId,
          memberName: participant.name,
          amount: amount,
        });
      });

      // Thêm vào danh sách người trả
      const payerDetail = details.find((d) => d.memberId === bill.paidBy);
      if (payerDetail) {
        payerDetail.billsPaid.push(billDetail);
      }

      // Thêm vào danh sách người sử dụng
      bill.participants.forEach((participantId) => {
        const participantDetail = details.find(
          (d) => d.memberId === participantId,
        );
        if (participantDetail) {
          participantDetail.billsUsed.push(billDetail);
        }
      });
    });

    return details;
  };

  const memberDetails = getMemberBillDetails();

  const toggleMember = (memberId: string) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  // Kiểm tra xem người dùng có phải là người trả không
  const isCurrentUserPayer = (bill: BillDetail, memberId: string) => {
    return bill.paidBy === memberId;
  };

  if (members.length === 0 || bills.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          Chi tiết từng người
          <Badge className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            {members.length} thành viên
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {memberDetails.map((member) => (
            <div
              key={member.memberId}
              className="rounded-xl border bg-gradient-to-br from-card to-muted/20 overflow-hidden"
            >
              {/* Member Header */}
              <button
                onClick={() => toggleMember(member.memberId)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={member.memberName} size="md" />
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">
                      {member.memberName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Đã chi:{" "}
                      {formatMoneyFull(
                        member.billsPaid.reduce(
                          (sum, b) => sum + b.totalAmount,
                          0,
                        ),
                      )}{" "}
                      • Đã dùng:{" "}
                      {formatMoneyFull(
                        member.billsUsed.reduce((sum, b) => {
                          const share = b.participantShares.find(
                            (s) => s.memberId === member.memberId,
                          );
                          return sum + (share?.amount || 0);
                        }, 0),
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {member.billsPaid.length} khoản đã trả
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {member.billsUsed.length} khoản đã dùng
                  </Badge>
                  {expandedMember === member.memberId ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedMember === member.memberId && (
                <div className="border-t p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Bills Paid */}
                  {member.billsPaid.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <div className="p-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">
                          <Receipt className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        Khoản đã trả
                      </h4>
                      <div className="space-y-2">
                        {member.billsPaid.map((bill) => {
                          const isSelfPayer = isCurrentUserPayer(
                            bill,
                            member.memberId,
                          );

                          return (
                            <div
                              key={bill.billId}
                              className="rounded-lg bg-muted/30 p-3 relative"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {bill.billName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Tổng: {formatMoneyFull(bill.totalAmount)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {isSelfPayer && (
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Tự trả
                                    </Badge>
                                  )}
                                  <Badge className="bg-emerald-100 text-emerald-800">
                                    Đã trả
                                  </Badge>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Phân bổ cho:
                                </p>
                                <div className="space-y-1">
                                  {bill.participantShares.map((share) => {
                                    const isSelf =
                                      share.memberId === member.memberId;
                                    return (
                                      <div
                                        key={share.memberId}
                                        className={cn(
                                          "flex justify-between text-xs",
                                          isSelf &&
                                            "bg-emerald-50 dark:bg-emerald-950/30 -mx-1 px-1 py-0.5 rounded",
                                        )}
                                      >
                                        <span className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          {share.memberName}
                                          {isSelf && (
                                            <Badge
                                              variant="outline"
                                              className="text-[9px] h-4 px-1 ml-1"
                                            >
                                              Bạn
                                            </Badge>
                                          )}
                                        </span>
                                        <span className="font-mono font-medium">
                                          {formatMoneyFull(share.amount)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bills Used */}
                  {member.billsUsed.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <div className="p-0.5 rounded bg-amber-100 dark:bg-amber-900/50">
                          <User className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        Khoản đã sử dụng
                      </h4>
                      <div className="space-y-2">
                        {member.billsUsed.map((bill) => {
                          const userShare = bill.participantShares.find(
                            (s) => s.memberId === member.memberId,
                          );
                          const isSelfPayer = isCurrentUserPayer(
                            bill,
                            member.memberId,
                          );

                          return (
                            <div
                              key={bill.billId}
                              className="rounded-lg bg-muted/30 p-3 relative"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium text-sm">
                                    {bill.billName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Người trả: {bill.paidByName}
                                    {isSelfPayer && (
                                      <span className="ml-1 text-emerald-600">
                                        (Bạn)
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {isSelfPayer && (
                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Tự dùng
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="text-amber-600"
                                  >
                                    Đã dùng
                                  </Badge>
                                </div>
                              </div>
                              {userShare && (
                                <div className="mt-2 pt-2 border-t">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Số tiền phải trả:
                                    </span>
                                    <span className="font-mono font-semibold text-amber-600">
                                      {formatMoneyFull(userShare.amount)}
                                    </span>
                                  </div>
                                  {isSelfPayer && (
                                    <div className="mt-2 pt-2 border-t border-dashed">
                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <UserCheck className="h-3 w-3" />
                                        Bạn đã trả khoản này, không cần chuyển
                                        tiền
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
