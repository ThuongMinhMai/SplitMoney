import { useState } from "react";
import type { Member } from "@/components/split-money/types";

export function useMemberValidation(members: Member[]) {
  const [error, setError] = useState("");

  const validateMemberName = (name: string): boolean => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Vui lòng nhập tên thành viên");
      return false;
    }

    const isDuplicate = members.some(
      (member) => member.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setError(`Thành viên "${trimmedName}" đã tồn tại`);
      return false;
    }

    setError("");
    return true;
  };

  const clearError = () => setError("");

  return {
    error,
    validateMemberName,
    clearError,
  };
}
