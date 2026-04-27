import { IMember } from "@/components/features/split-money/types";
import { useI18n } from "@/context/i18n-context";
import { memberSchema } from "@/lib/validations";
import { useState } from "react";

export function useMemberValidation(members: IMember[]) {
  const [error, setError] = useState("");
  const { t } = useI18n();

  const validateMemberName = (name: string): boolean => {
    const result = memberSchema.safeParse({ name });

    if (!result.success) {
      const errorKey = result.error.issues[0].message;

      setError(t(errorKey));
      return false;
    }

    const trimmedName = name.trim();
    const isDuplicate = members.some(
      (member) => member.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setError(t("members.alreadyExists"));
      return false;
    }

    setError("");
    return true;
  };

  return { error, validateMemberName, clearError: () => setError("") };
}
