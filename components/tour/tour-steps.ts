import { DriveStep } from "driver.js";

export const getTourSteps = (t: (key: string) => string): DriveStep[] => [
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
];
