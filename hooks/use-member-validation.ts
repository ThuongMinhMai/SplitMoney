import { useState } from "react";
import type { Member } from "@/components/features/split-money/types";
import { memberSchema } from "@/lib/validations";
import { toast } from "sonner";

export function useMemberValidation(members: Member[]) {
  const [error, setError] = useState("");

  const validateMemberName = (name: string): boolean => {
    const result = memberSchema.safeParse({ name });

    if (!result.success) {
      const message = result.error.issues[0].message;
      setError(message);
      // toast.error(message);
      return false;
    }

    const trimmedName = name.trim();
    const isDuplicate = members.some(
      (member) => member.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      const message = `Thành viên "${trimmedName}" đã tồn tại`;
      setError(message);
      // toast.error(message);
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
