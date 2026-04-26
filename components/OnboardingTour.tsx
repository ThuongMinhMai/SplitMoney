"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useI18n } from "@/context/i18n-context";
import { createRoot, Root } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import confetti from "canvas-confetti";

export function OnboardingTour() {
  const { t } = useI18n();
  const tourStarted = useRef(false);
  const rootsRef = useRef<Map<Element, Root>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tourStarted.current) return;

    const hasSeenTour = localStorage.getItem("has-seen-tour");
    if (hasSeenTour === "true") return;
    const celebrateTourComplete = () => {
      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
        });

        confetti({
          particleCount: 4,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      confetti({
        particleCount: 140,
        spread: 120,
        origin: { y: 0.6 },
      });
    };
    const startTour = () => {
      if (tourStarted.current) return;

      try {
        const driverObj = driver({
          showProgress: false,
          allowClose: true,
          overlayColor: "rgba(0, 0, 0, 0.7)",
          popoverClass: "driver-popover-custom",
          stagePadding: 5,
          popoverOffset: 45,
          animate: true,
          smoothScroll: true,
          onPopoverRender: (popover, { config, state }) => {
            const container = popover.wrapper;
            if (!container) return;

            // Layout stability
            const isMobile = window.innerWidth < 640;
            const targetWidth = isMobile
              ? `${window.innerWidth - 48}px`
              : "320px";
            container.style.width = targetWidth;
            container.style.maxWidth = targetWidth;
            container.style.minHeight = "160px";
            container.style.display = "flex";
            container.style.flexDirection = "column";

            // Root management
            let root = rootsRef.current.get(container);
            if (!root) {
              container.innerHTML = "";
              root = createRoot(container);
              rootsRef.current.set(container, root);
            }

            const stepIndex = state.activeIndex || 0;
            const totalSteps = config.steps?.length || 0;
            const isFirst = stepIndex === 0;
            const isLast = stepIndex === totalSteps - 1;
            const step = config.steps![stepIndex];

            root.render(
              <div className="p-5 w-full h-full bg-background border border-border/50 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                        Quick Guide
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-none tracking-tight text-foreground">
                      {step.popover?.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => driverObj.destroy()}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                  {step.popover?.description}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                  <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                      Step {stepIndex + 1} / {totalSteps}
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all ${
                            i === stepIndex
                              ? "w-4 bg-emerald-500"
                              : "w-1 bg-border"
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
                        onClick={() => driverObj.destroy()}
                        className="h-8 text-xs font-medium px-3"
                      >
                        Skip
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => driverObj.movePrevious()}
                        className="h-8 text-xs font-medium px-3"
                      >
                        {t("tour.prev")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() =>
                        isLast ? driverObj.destroy() : driverObj.moveNext()
                      }
                      className="h-8 text-xs font-bold px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                    >
                      {isLast ? t("tour.done") : t("tour.next")}
                    </Button>
                  </div>
                </div>
              </div>,
            );
          },
          steps: [
            {
              popover: {
                title: t("tour.welcome"),
                description: t("tour.welcomeDesc"),
              },
            },
            {
              element: () =>
                [...document.querySelectorAll('[data-tour="add-member"]')].find(
                  (el) => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                  },
                ) || document.querySelector('[data-tour="add-member"]')!,

              popover: {
                title: t("tour.addMember"),
                description: t("tour.addMemberDesc"),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: '[data-tour="add-bill"]',
              popover: {
                title: t("tour.addBill"),
                description: t("tour.addBillDesc"),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: '[data-tour="stats"]',
              popover: {
                title: t("tour.stats"),
                description: t("tour.statsDesc"),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: () =>
                [
                  ...document.querySelectorAll('[data-tour="summary-card"]'),
                ].find((el) => {
                  const rect = el.getBoundingClientRect();
                  return rect.width > 0 && rect.height > 0;
                }) || document.querySelector('[data-tour="summary-card"]')!,

              popover: {
                title: t("tour.summary"),
                description: t("tour.summaryDesc"),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: '[data-tour="transactions-card"]',
              popover: {
                title: t("tour.transactions"),
                description: t("tour.transactionsDesc"),
                side: "top",
                align: "center",
              },
            },
            {
              element: '[data-tour="settings-group"]',
              popover: {
                title: t("tour.settings"),
                description: t("tour.settingsDesc"),
                side: "bottom",
                align: "center",
              },
            },
          ],
          onDestroyed: () => {
            localStorage.setItem("has-seen-tour", "true");
            tourStarted.current = false;
            celebrateTourComplete();
            // Clean up roots
            rootsRef.current.forEach((root) => root.unmount());
            rootsRef.current.clear();
          },
        });

        tourStarted.current = true;
        driverObj.drive();
      } catch (err) {
        console.error("Driver.js error:", err);
      }
    };

    (window as any).startAppTour = startTour;
    const timeoutId = setTimeout(startTour, 2000);
    return () => {
      clearTimeout(timeoutId);
      delete (window as any).startAppTour;
    };
  }, [t]);

  return null;
}
