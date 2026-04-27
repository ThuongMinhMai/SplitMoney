"use client";

import { useI18n } from "@/context/i18n-context";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { celebrateTourComplete } from "./tour/celebrate";
import { PopoverContent } from "./tour/PopoverContent";
import { getTourSteps } from "./tour/tour-steps";

export function OnboardingTour() {
  const { t } = useI18n();
  const tourStarted = useRef(false);
  const rootsRef = useRef<Map<Element, Root>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tourStarted.current) return;

    const hasSeenTour = localStorage.getItem("has-seen-tour");
    if (hasSeenTour === "true") return;

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

            const isMobile = window.innerWidth < 640;
            const targetWidth = isMobile
              ? `${window.innerWidth - 48}px`
              : "320px";
            container.style.width = targetWidth;
            container.style.maxWidth = targetWidth;
            container.style.minHeight = "160px";
            container.style.display = "flex";
            container.style.flexDirection = "column";

            let root = rootsRef.current.get(container);
            if (!root) {
              container.innerHTML = "";
              root = createRoot(container);
              rootsRef.current.set(container, root);
            }

            const stepIndex = state.activeIndex || 0;
            const totalSteps = config.steps?.length || 0;
            const step = config.steps![stepIndex];

            root.render(
              <PopoverContent
                title={step.popover?.title}
                description={step.popover?.description}
                stepIndex={stepIndex}
                totalSteps={totalSteps}
                isFirst={stepIndex === 0}
                isLast={stepIndex === totalSteps - 1}
                t={t}
                onClose={() => driverObj.destroy()}
                onPrev={() => driverObj.movePrevious()}
                onNext={() =>
                  stepIndex === totalSteps - 1
                    ? driverObj.destroy()
                    : driverObj.moveNext()
                }
              />,
            );
          },
          steps: getTourSteps(t),
          onDestroyed: () => {
            localStorage.setItem("has-seen-tour", "true");
            tourStarted.current = false;
            celebrateTourComplete();
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
