"use client";

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import type { IMember } from "./types";
import { useMemberValidation } from "@/hooks/use-member-validation";
import { toast } from "sonner";
import { CardCustom } from "@/components/ui/card-custom";
import { useI18n } from "@/context/i18n-context";
import { AddMemberInput } from "./members-card/AddMemberInput";
import { MemberListItem } from "./members-card/MemberListItem";

interface MembersCardProps {
  members: IMember[];
  newMemberName: string;
  setNewMemberName: (v: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function MembersCard({
  members,
  newMemberName,
  setNewMemberName,
  onAdd,
  onRemove,
}: MembersCardProps) {
  const { t } = useI18n();
  const { error, validateMemberName, clearError } = useMemberValidation(members);

  const handleAdd = () => {
    if (validateMemberName(newMemberName)) {
      onAdd();
      toast.success(`${t("members.added")}: "${newMemberName}"`);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMemberName(e.target.value);
    clearError();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <CardCustom
      className="shadow-sm hover:shadow-md transition-all border-border"
      data-tour="members-list"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {t("members.title")}
          {members.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto font-mono text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
            >
              {members.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AddMemberInput
          newMemberName={newMemberName}
          onNameChange={handleNameChange}
          onKeyDown={handleKeyDown}
          onAdd={handleAdd}
          error={error}
          t={t}
        />

        {members.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Users className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p>{t("members.noMembers")}</p>
            <p className="text-xs">{t("members.addHint")}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-52">
            <div className="space-y-1.5 pr-3">
              {members.map((m) => (
                <MemberListItem
                  key={m.id}
                  member={m}
                  onRemove={onRemove}
                  t={t}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </CardCustom>
  );
}
