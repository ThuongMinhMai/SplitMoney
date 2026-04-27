import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input";
import { cn } from "@/lib/utils";
import { AlertCircle, Plus } from "lucide-react";

interface AddMemberInputProps {
  newMemberName: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  error: string | null;
  t: (key: string) => string;
}

export function AddMemberInput({
  newMemberName,
  onNameChange,
  onKeyDown,
  onAdd,
  error,
  t,
}: AddMemberInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <CustomInput
          placeholder={t("members.placeholder")}
          value={newMemberName}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
          data-tour="add-member"
          autoFocus
          className={cn(
            "h-9 text-sm focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 border-border",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          )}
        />
        <Button
          size="sm"
          onClick={onAdd}
          className="h-9 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-sm text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 py-2"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <AlertDescription className="text-xs text-red-800 dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
