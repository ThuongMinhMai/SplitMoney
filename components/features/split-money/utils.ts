export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatMoney(amount: number) {
  if (amount >= 1_000_000)
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M₫";
  if (amount >= 1_000) return Math.round(amount / 1_000) + "K₫";
  return Math.round(amount).toLocaleString("vi-VN") + "₫";
}

export function formatMoneyFull(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumberWithCommas(value: string | number): string {
  const num =
    typeof value === "string" ? value.replace(/,/g, "") : value.toString();
  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// Parse formatted number back to number
export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

export function getBillIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("cafe") || n.includes("cà phê") || n.includes("ca phe"))
    return "Coffee";
  if (n.includes("taxi") || n.includes("grab") || n.includes("xe"))
    return "Car";
  if (n.includes("karaoke") || n.includes("hát")) return "Music";
  if (n.includes("bia") || n.includes("nhậu") || n.includes("bar"))
    return "Beer";
  if (
    n.includes("ăn") ||
    n.includes("nhà hàng") ||
    n.includes("tối") ||
    n.includes("trưa")
  )
    return "Utensils";
  return "Receipt";
}
