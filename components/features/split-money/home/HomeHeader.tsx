import { AddBillForm } from "@/components/features/split-money/AddBillForm";
import type { IBill, IMember } from "@/components/features/split-money/types";
import { LanguageToggle, ThemeToggle } from "@/components/settings-toggles";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus } from "lucide-react";
import Image from "next/image";

interface IHomeHeaderProps {
  t: (key: string) => string;
  isSheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  members: IMember[];
  onAddBill: (billData: Omit<IBill, "id">) => void;
  editingBill?: IBill | null;
  onStartAddBill: () => void;
  isFormDirty: boolean;
  setIsFormDirty: (dirty: boolean) => void;
}

export function HomeHeader({
  t,
  isSheetOpen,
  onSheetOpenChange,
  members,
  onAddBill,
  editingBill,
  onStartAddBill,
  isFormDirty,
  setIsFormDirty,
}: IHomeHeaderProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isEditing = Boolean(editingBill);
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 relative rounded-xl overflow-hidden shadow-md">
            <Image
              src="/logo.jpg"
              sizes="36px"
              alt="logo"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <span className="font-bold text-base leading-none tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              {t("common.appName")}
            </span>
            <p className="text-[10px] text-muted-foreground leading-none mt-1 hidden sm:block">
              {t("common.tagline")}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-1 sm:gap-2 ml-auto"
          data-tour="settings-group"
        >
          <div data-tour="language-toggle">
            <LanguageToggle />
          </div>
          <div data-tour="theme-toggle">
            <ThemeToggle />
          </div>
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
        </div>

        <Sheet open={isSheetOpen} onOpenChange={onSheetOpenChange}>
          <SheetTrigger asChild>
            <Button
              size="default"
              className="bg-gradient-to-r text-white from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 gap-2 shadow-md hover:shadow-lg transition-all"
              disabled={members.length < 2}
              data-tour="add-bill"
              onClick={onStartAddBill}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">{t("common.addBill")}</span>
              <span className="xs:hidden">{t("common.addBill")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side={isDesktop ? "right" : "bottom"}
            className={`rounded-t-2xl p-4 pb-safe bg-background overflow-y-auto transition-all ${
              isDesktop
                ? "w-[400px] sm:w-[540px] border-l"
                : "max-h-[92dvh] border-t-4 border-t-emerald-500"
            }`}
            onPointerDownOutside={(e) => {
              if (isFormDirty) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (isFormDirty) e.preventDefault();
            }}
          >
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                {t(isEditing ? "bills.editTitle" : "bills.title")}
              </SheetTitle>
            </SheetHeader>
            <AddBillForm
              members={members}
              onAdd={onAddBill}
              onClose={() => onSheetOpenChange(false)}
              onDirtyChange={setIsFormDirty}
              initialBill={editingBill}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
