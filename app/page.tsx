// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Trash2,
  Users,
  Receipt,
  TrendingUp,
  Wallet,
  Coffee,
  Car,
  Music,
  Utensils,
  Info,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
}

interface Bill {
  id: string;
  name: string;
  totalAmount: number;
  paidBy: string;
  participants: string[];
  splitType: "equal" | "custom";
  customAmounts: { [key: string]: number };
}

interface Balance {
  from: string;
  to: string;
  amount: number;
}

interface MemberSummary {
  name: string;
  paid: number;
  used: number;
  balance: number;
  bills: Bill[];
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const [newBill, setNewBill] = useState({
    name: "",
    totalAmount: 0,
    paidBy: "",
    participants: [] as string[],
    splitType: "equal" as "equal" | "custom",
    customAmounts: {} as { [key: string]: number },
  });
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  // Thêm thành viên
  const addMember = () => {
    if (newMemberName.trim()) {
      setMembers([
        ...members,
        { id: Date.now().toString(), name: newMemberName.trim() },
      ]);
      setNewMemberName("");
    }
  };

  // Xóa thành viên
  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    // Xóa thành viên khỏi các bill liên quan
    setBills(
      bills.filter(
        (bill) => bill.paidBy !== id && !bill.participants.includes(id),
      ),
    );
  };

  // Thêm bill
  const addBill = () => {
    if (
      newBill.name &&
      newBill.totalAmount > 0 &&
      newBill.paidBy &&
      newBill.participants.length > 0
    ) {
      const bill: Bill = {
        id: Date.now().toString(),
        name: newBill.name,
        totalAmount: newBill.totalAmount,
        paidBy: newBill.paidBy,
        participants: newBill.participants,
        splitType: newBill.splitType,
        customAmounts:
          newBill.splitType === "custom" ? newBill.customAmounts : {},
      };
      setBills([...bills, bill]);
      resetNewBill();
      setIsBillDialogOpen(false);
    }
  };

  // Reset form bill
  const resetNewBill = () => {
    setNewBill({
      name: "",
      totalAmount: 0,
      paidBy: "",
      participants: [],
      splitType: "equal",
      customAmounts: {},
    });
  };

  // Xóa bill
  const removeBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  // Tính toán số tiền mỗi người phải trả cho một bill
  const getAmountPerPerson = (bill: Bill, memberId: string): number => {
    if (!bill.participants.includes(memberId)) return 0;

    if (bill.splitType === "equal") {
      return bill.totalAmount / bill.participants.length;
    } else {
      return bill.customAmounts[memberId] || 0;
    }
  };

  // Tính tổng số tiền đã chi và đã dùng của mỗi người
  const getMemberSummaries = (): MemberSummary[] => {
    const summaries: { [key: string]: MemberSummary } = {};

    members.forEach((member) => {
      summaries[member.id] = {
        name: member.name,
        paid: 0,
        used: 0,
        balance: 0,
        bills: [],
      };
    });

    bills.forEach((bill) => {
      const payer = members.find((m) => m.id === bill.paidBy);
      if (payer) {
        summaries[bill.paidBy].paid += bill.totalAmount;
      }

      bill.participants.forEach((participantId) => {
        const amount = getAmountPerPerson(bill, participantId);
        summaries[participantId].used += amount;
        summaries[participantId].bills.push(bill);
      });
    });

    members.forEach((member) => {
      summaries[member.id].balance =
        summaries[member.id].paid - summaries[member.id].used;
    });

    return Object.values(summaries);
  };

  // Tối ưu hóa số giao dịch chuyển tiền
  const getOptimizedTransactions = (): Balance[] => {
    const summaries = getMemberSummaries();
    const balances = summaries.map((s) => ({
      name: s.name,
      balance: s.balance,
    }));

    const debtors = balances
      .filter((b) => b.balance < 0)
      .sort((a, b) => a.balance - b.balance);
    const creditors = balances
      .filter((b) => b.balance > 0)
      .sort((a, b) => b.balance - a.balance);

    const transactions: Balance[] = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(-debtor.balance, creditor.balance);

      if (amount > 0.01) {
        transactions.push({ from: debtor.name, to: creditor.name, amount });
      }

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j++;
    }

    return transactions;
  };

  // Format tiền
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Lấy icon cho bill
  const getBillIcon = (billName: string) => {
    const name = billName.toLowerCase();
    if (name.includes("cafe") || name.includes("cà phê"))
      return <Coffee className="h-4 w-4" />;
    if (name.includes("xe") || name.includes("taxi"))
      return <Car className="h-4 w-4" />;
    if (name.includes("karaoke") || name.includes("hát"))
      return <Music className="h-4 w-4" />;
    if (name.includes("ăn") || name.includes("nhà hàng"))
      return <Utensils className="h-4 w-4" />;
    return <Receipt className="h-4 w-4" />;
  };

  const summaries = getMemberSummaries();
  const transactions = getOptimizedTransactions();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto p-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
              <Wallet className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Split Money Pro</h1>
            </div>
            <p className="text-gray-600">
              Chia tiền nhóm bạn thông minh, minh bạch và nhanh chóng
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Members & Bills */}
            <div className="lg:col-span-1 space-y-6">
              {/* Members Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Thành viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Nhập tên thành viên"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMember()}
                    />
                    <Button onClick={addMember} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium">{member.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMember(member.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {members.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          Chưa có thành viên
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Add Bill Button */}
              <Dialog
                open={isBillDialogOpen}
                onOpenChange={setIsBillDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="mr-2 h-4 w-4" /> Thêm khoản chi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Thêm khoản chi mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tên khoản chi</Label>
                      <Input
                        placeholder="VD: Ăn tối, Cafe, Taxi..."
                        value={newBill.name}
                        onChange={(e) =>
                          setNewBill({ ...newBill, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Tổng tiền</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={newBill.totalAmount || ""}
                        onChange={(e) =>
                          setNewBill({
                            ...newBill,
                            totalAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Người trả</Label>
                      <Select
                        value={newBill.paidBy}
                        onValueChange={(value) =>
                          setNewBill({ ...newBill, paidBy: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người trả" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Người tham gia</Label>
                      <div className="border rounded-md p-2 space-y-2 max-h-[150px] overflow-y-auto">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={member.id}
                              checked={newBill.participants.includes(member.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewBill({
                                    ...newBill,
                                    participants: [
                                      ...newBill.participants,
                                      member.id,
                                    ],
                                  });
                                } else {
                                  setNewBill({
                                    ...newBill,
                                    participants: newBill.participants.filter(
                                      (id) => id !== member.id,
                                    ),
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={member.id}>{member.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Cách chia tiền</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={
                            newBill.splitType === "equal"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setNewBill({ ...newBill, splitType: "equal" })
                          }
                          className="flex-1"
                        >
                          Chia đều
                        </Button>
                        <Button
                          variant={
                            newBill.splitType === "custom"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setNewBill({ ...newBill, splitType: "custom" })
                          }
                          className="flex-1"
                        >
                          Chênh lệch
                        </Button>
                      </div>
                    </div>
                    {newBill.splitType === "custom" &&
                      newBill.participants.length > 0 && (
                        <div className="space-y-2">
                          <Label>Nhập số tiền từng người</Label>
                          {newBill.participants.map((participantId) => {
                            const member = members.find(
                              (m) => m.id === participantId,
                            );
                            return member ? (
                              <div
                                key={participantId}
                                className="flex items-center gap-2"
                              >
                                <span className="w-24">{member.name}</span>
                                <Input
                                  type="number"
                                  placeholder="Số tiền"
                                  value={
                                    newBill.customAmounts[participantId] || ""
                                  }
                                  onChange={(e) => {
                                    const amount =
                                      parseFloat(e.target.value) || 0;
                                    setNewBill({
                                      ...newBill,
                                      customAmounts: {
                                        ...newBill.customAmounts,
                                        [participantId]: amount,
                                      },
                                    });
                                  }}
                                />
                              </div>
                            ) : null;
                          })}
                          <Alert>
                            <AlertDescription>
                              Tổng tiền:{" "}
                              {formatMoney(
                                Object.values(newBill.customAmounts).reduce(
                                  (a, b) => a + b,
                                  0,
                                ),
                              )}
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    <Button onClick={addBill} className="w-full">
                      Thêm khoản chi
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Bills List */}
              {bills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Danh sách khoản chi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {bills.map((bill) => {
                          const payer = members.find(
                            (m) => m.id === bill.paidBy,
                          );
                          return (
                            <div
                              key={bill.id}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  {getBillIcon(bill.name)}
                                  <span className="font-medium">
                                    {bill.name}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeBill(bill.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Tổng: {formatMoney(bill.totalAmount)}</div>
                                <div>Người trả: {payer?.name}</div>
                                <div>
                                  Chia:{" "}
                                  {bill.splitType === "equal"
                                    ? "đều"
                                    : "theo chênh lệch"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Tổng chi</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatMoney(
                          summaries.reduce((sum, s) => sum + s.paid, 0),
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Tổng số người
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {members.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Số bill</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {bills.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Member Summary Table */}
              {members.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Sao kê từng người
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thành viên</TableHead>
                          <TableHead className="text-right">Đã chi</TableHead>
                          <TableHead className="text-right">Đã dùng</TableHead>
                          <TableHead className="text-right">
                            Chênh lệch
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaries.map((summary) => (
                          <TableRow key={summary.name}>
                            <TableCell className="font-medium">
                              {summary.name}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatMoney(summary.paid)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatMoney(summary.used)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-bold ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {summary.balance >= 0
                                ? `+${formatMoney(summary.balance)}`
                                : formatMoney(summary.balance)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Optimized Transactions */}
              {transactions.length > 0 && (
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Wallet className="h-5 w-5" />
                      Giao dịch tối ưu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {transactions.map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-red-600">
                              {transaction.from}
                            </Badge>
                            <span>➜</span>
                            <Badge variant="outline" className="text-green-600">
                              {transaction.to}
                            </Badge>
                          </div>
                          <span className="font-bold text-lg">
                            {formatMoney(transaction.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Data Message */}
              {members.length === 0 && (
                <Card>
                  <CardContent className="pt-8 text-center">
                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Thêm thành viên và khoản chi để bắt đầu
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
