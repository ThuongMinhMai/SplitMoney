import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { IMemberBillDetail } from "@/components/features/split-money/types";

export interface BillSharePayload {
  memberDetail: IMemberBillDetail;
  generatedAt: string;
}

export function encodeBillSharePayload(payload: BillSharePayload): string {
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeBillSharePayload(encoded: string): BillSharePayload | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as BillSharePayload;
  } catch {
    return null;
  }
}
