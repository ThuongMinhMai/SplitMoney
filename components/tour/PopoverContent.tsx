import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface IPopoverContentProps {
  title?: string;
  description?: string;
  stepIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  t: (key: string) => string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PopoverContent({
  title,
  description,
  stepIndex,
  totalSteps,
  isFirst,
  isLast,
  t,
  onClose,
  onPrev,
  onNext,
}: IPopoverContentProps) {
  return (
    <div className="p-5 w-full h-full bg-background border border-border/50 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
              {t("tour.quickGuide")}
            </span>
          </div>
          <h3 className="font-bold text-lg leading-none tracking-tight text-foreground">
            {title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
        {description}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            {t("tour.step")} {stepIndex + 1} / {totalSteps}
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === stepIndex ? "w-4 bg-emerald-500" : "w-1 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {isFirst ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs font-medium px-3"
            >
              Skip
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              className="h-8 text-xs font-medium px-3"
            >
              {t("tour.prev")}
            </Button>
          )}
          <Button
            size="sm"
            onClick={onNext}
            className="h-8 text-xs font-bold px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
          >
            {isLast ? t("tour.done") : t("tour.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
