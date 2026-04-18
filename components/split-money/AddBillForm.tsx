"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import {
  formatMoneyFull,
  formatNumberWithCommas,
  parseFormattedNumber,
} from "./utils";
import {
  AlertCircle,
  Users,
  DollarSign,
  Scale,
  TrendingUp,
  Receipt,
} from "lucide-react";
import type { Member, Bill } from "./types";
import { CustomInput } from "../ui/custom-input";

interface AddBillFormProps {
  members: Member[];
  onAdd: (bill: Omit<Bill, "id">) => void;
  onClose: () => void;
}

export function AddBillForm({ members, onAdd, onClose }: AddBillFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountRaw, setAmountRaw] = useState<number>(0);
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    {},
  );
  const [error, setError] = useState("");
  const [customTotalError, setCustomTotalError] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      setAmountRaw(numValue);
      setAmount(formatNumberWithCommas(rawValue));
    } else if (rawValue === "") {
      setAmount("");
      setAmountRaw(0);
    }
  };

  const toggleParticipant = (id: string) => {
    setParticipants((prev) => {
      const newParticipants = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];

      // Cleanup customAmounts khi bỏ chọn người tham gia
      if (!newParticipants.includes(id)) {
        setCustomAmounts((prevAmounts) => {
          const newAmounts = { ...prevAmounts };
          delete newAmounts[id];
          return newAmounts;
        });
      }

      return newParticipants;
    });
  };

  const handleCustomAmountChange = (id: string, value: string) => {
    const rawValue = value.replace(/,/g, "");
    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      setCustomAmounts((prev) => ({
        ...prev,
        [id]: formatNumberWithCommas(rawValue),
      }));
    } else if (rawValue === "") {
      setCustomAmounts((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  // Cleanup customAmounts khi splitType thay đổi từ custom sang equal
  useEffect(() => {
    if (splitType !== "custom") {
      setCustomAmounts({});
    }
  }, [splitType]);

  // Reset customAmounts khi participants thay đổi (đảm bảo chỉ giữ lại những người đang tham gia)
  useEffect(() => {
    if (splitType === "custom") {
      setCustomAmounts((prev) => {
        const newAmounts: Record<string, string> = {};
        // Chỉ giữ lại những người đang tham gia
        participants.forEach((pid) => {
          if (prev[pid] !== undefined) {
            newAmounts[pid] = prev[pid];
          }
        });
        return newAmounts;
      });
    }
  }, [participants, splitType]);

  useEffect(() => {
    if (splitType === "custom" && participants.length > 0 && amountRaw > 0) {
      const total = Object.values(customAmounts).reduce((sum, val) => {
        const num = parseFormattedNumber(val);
        return sum + num;
      }, 0);

      if (Math.abs(total - amountRaw) > 1) {
        setCustomTotalError(
          `Tổng số tiền (${formatMoneyFull(total)}) không bằng tổng bill (${formatMoneyFull(amountRaw)})`,
        );
      } else {
        setCustomTotalError("");
      }
    } else {
      setCustomTotalError("");
    }
  }, [customAmounts, amountRaw, participants, splitType]);

  const handleSubmit = () => {
    if (!name.trim()) return setError("Vui lòng nhập tên khoản chi");
    if (!amount || amountRaw <= 0)
      return setError("Vui lòng nhập số tiền hợp lệ");
    if (!paidBy) return setError("Vui lòng chọn người trả");
    if (!participants.length) return setError("Vui lòng chọn người tham gia");

    if (splitType === "custom") {
      if (customTotalError) return setError(customTotalError);
      const customAmountsNumber: Record<string, number> = {};
      for (const pid of participants) {
        const val = parseFormattedNumber(customAmounts[pid] || "0");
        if (val <= 0) {
          setError(`Vui lòng nhập số tiền hợp lệ cho tất cả người tham gia`);
          return;
        }
        customAmountsNumber[pid] = val;
      }

      setError("");
      onAdd({
        name: name.trim(),
        totalAmount: amountRaw,
        paidBy,
        participants,
        splitType,
        customAmounts: customAmountsNumber,
      });
    } else {
      setError("");
      onAdd({
        name: name.trim(),
        totalAmount: amountRaw,
        paidBy,
        participants,
        splitType,
        customAmounts: {},
      });
    }
    onClose();
  };

  const selectedParticipantCount = participants.length;
  const equalAmount =
    selectedParticipantCount > 0 && amountRaw > 0
      ? amountRaw / selectedParticipantCount
      : 0;

  return (
    <div className="space-y-6 px-1">
      {/* Bill Name */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Receipt className="h-3.5 w-3.5" />
          Tên khoản chi
        </Label>
        <CustomInput
          placeholder="VD: Ăn tối nhà hàng, Cafe, Taxi..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-200 dark:border-gray-700 h-11"
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5" />
          Tổng tiền (VNĐ)
        </Label>
        <CustomInput
          type="text"
          placeholder="0"
          value={amount}
          onChange={handleAmountChange}
          className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-200 dark:border-gray-700 font-mono text-lg h-11"
        />
      </div>

      {/* Payer */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          Người trả trước
        </Label>
        <Select value={paidBy} onValueChange={setPaidBy}>
          <SelectTrigger className="focus:ring-2 focus:ring-emerald-500 border-gray-200 dark:border-gray-700 h-11">
            <SelectValue placeholder="Chọn người trả" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white">
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Avatar name={m.name} size="sm" />
                  <span>{m.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          Người tham gia
        </Label>
        <div className="border rounded-xl divide-y bg-muted/20 border-gray-200 dark:border-gray-700 overflow-hidden">
          {members.map((m) => (
            <label
              key={m.id}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <Checkbox
                checked={participants.includes(m.id)}
                onCheckedChange={() => toggleParticipant(m.id)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 border-gray-300 h-5 w-5"
              />
              <Avatar name={m.name} size="sm" />
              <span className="text-sm font-medium">{m.name}</span>
            </label>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Chưa có thành viên
            </p>
          )}
        </div>
      </div>

      {/* Split Type with Radio Group */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Scale className="h-3 w-3" />
          Cách chia tiền
        </Label>

        <RadioGroup
          value={splitType}
          onValueChange={(value) => setSplitType(value as "equal" | "custom")}
          className="flex gap-2"
        >
          <div
            className={cn(
              "flex-1 rounded-md border p-2 cursor-pointer transition-all",
              splitType === "equal"
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300",
            )}
            onClick={() => setSplitType("equal")}
          >
            <RadioGroupItem value="equal" id="equal" className="sr-only" />
            <Label
              htmlFor="equal"
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scale
                className={cn(
                  "h-3.5 w-3.5",
                  splitType === "equal" ? "text-emerald-600" : "text-gray-500",
                )}
              />
              <span className="text-xs font-medium">Chia đều</span>
            </Label>
            {selectedParticipantCount > 0 &&
              amountRaw > 0 &&
              splitType === "equal" && (
                <p className="text-[10px] text-center text-muted-foreground mt-1">
                  {formatMoneyFull(equalAmount)}/người
                </p>
              )}
          </div>

          <div
            className={cn(
              "flex-1 rounded-md border p-2 cursor-pointer transition-all",
              splitType === "custom"
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300",
            )}
            onClick={() => setSplitType("custom")}
          >
            <RadioGroupItem value="custom" id="custom" className="sr-only" />
            <Label
              htmlFor="custom"
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <TrendingUp
                className={cn(
                  "h-3.5 w-3.5",
                  splitType === "custom" ? "text-emerald-600" : "text-gray-500",
                )}
              />
              <span className="text-xs font-medium">Chênh lệch</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Custom amounts */}
      {splitType === "custom" && participants.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Số tiền từng người
          </Label>
          <div className="space-y-2">
            {participants.map((pid) => {
              const member = members.find((m) => m.id === pid);
              if (!member) return null;
              return (
                <div
                  key={pid}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/20"
                >
                  <div className="flex items-center gap-2 w-32 shrink-0">
                    <Avatar name={member.name} size="sm" />
                    <span className="text-sm font-medium truncate">
                      {member.name}
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ₫
                    </span>
                    <CustomInput
                      type="text"
                      placeholder="0"
                      value={customAmounts[pid] || ""}
                      onChange={(e) =>
                        handleCustomAmountChange(pid, e.target.value)
                      }
                      className="pl-7 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-200 dark:border-gray-700 font-mono"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {customTotalError && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs text-red-800 dark:text-red-300">
                {customTotalError}
              </AlertDescription>
            </Alert>
          )}

          {!customTotalError &&
            amountRaw > 0 &&
            participants.length > 0 &&
            Object.values(customAmounts).some((v) => v) && (
              <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
                <AlertDescription className="text-xs text-emerald-800 dark:text-emerald-300 font-mono flex items-center justify-between">
                  <span>Tổng đã nhập:</span>
                  <span className="font-bold">
                    {formatMoneyFull(
                      Object.values(customAmounts).reduce(
                        (sum, val) => sum + parseFormattedNumber(val),
                        0,
                      ),
                    )}
                  </span>
                </AlertDescription>
              </Alert>
            )}
        </div>
      )}

      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm text-red-800 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
        >
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-[2] bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all text-white h-11"
        >
          Thêm khoản chi
        </Button>
      </div>
    </div>
  );
}
