"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Plus, X, AlertCircle } from "lucide-react";
import { Avatar } from "./Avatar";
import type { Member } from "./types";
import { CardCustom } from "../ui/card-custom";
import { CustomInput } from "../ui/custom-input";
import { useMemberValidation } from "@/hooks/useMemberValidation";
import { cn } from "@/lib/utils";

interface MembersCardProps {
  members: Member[];
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
  const { error, validateMemberName, clearError } =
    useMemberValidation(members);

  const handleAdd = () => {
    if (validateMemberName(newMemberName)) {
      onAdd();
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
    <CardCustom className="shadow-sm hover:shadow-md transition-all border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100">
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          Thành viên
          {members.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto font-mono text-xs bg-emerald-100 text-emerald-800"
            >
              {members.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex gap-2">
            <CustomInput
              placeholder="Nhập tên thành viên..."
              value={newMemberName}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "h-9 text-sm focus:ring-0.5 focus:ring-emerald-500 focus:border-emerald-500 border-gray-200",
                error &&
                  "border-red-500 focus:ring-red-500 focus:border-red-500",
              )}
            />
            <Button
              size="sm"
              onClick={handleAdd}
              className="h-9 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-sm text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 py-2"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <AlertDescription className="text-xs text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {members.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Users className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p>Chưa có thành viên nào</p>
            <p className="text-xs">Thêm thành viên để bắt đầu</p>
          </div>
        ) : (
          <ScrollArea className="max-h-52">
            <div className="space-y-1.5 pr-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 hover:from-muted/60 hover:to-muted/40 transition-all group border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.name} size="sm" />
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                    onClick={() => onRemove(m.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </CardCustom>
  );
}
