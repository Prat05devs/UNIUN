import { z } from "zod";
import { apiClient } from "@/lib/api";
import { Paginated, withPagination } from "@/types/common";
import {
  AdminAccount,
  AdminAccountSchema,
  AdminPrice,
  AdminPriceSchema,
  AdminStats,
  AdminStatsSchema,
  CreditAdjustResult,
  CreditAdjustResultSchema,
  CreditOp
} from "../types";

// Also serves as the admin gate: a non-admin key gets 403 not_admin.
export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>("/uniun/v1/admin/stats");
  return AdminStatsSchema.parse(res.data);
}

export async function fetchAdminAccounts(
  page: number,
  perPage: number,
  q = ""
): Promise<Paginated<AdminAccount>> {
  const query = q ? `&q=${encodeURIComponent(q)}` : "";
  const res = await apiClient.get<AdminAccount[]>(
    `/uniun/v1/admin/accounts?page=${page}&per_page=${perPage}${query}`
  );
  return withPagination(AdminAccountSchema).parse(res);
}

export async function updateAccount(
  id: string,
  updates: { plan?: string; role?: "user" | "admin" }
): Promise<AdminAccount> {
  const res = await apiClient.patch<AdminAccount>(
    `/uniun/v1/admin/accounts/${id}`,
    updates
  );
  // The detail response includes extra fields (recent_usage etc.) — parse just
  // the list-row shape we render.
  return AdminAccountSchema.parse(res.data);
}

export async function adjustCredits(
  id: string,
  op: CreditOp,
  amount: number,
  reason: string
): Promise<CreditAdjustResult> {
  const res = await apiClient.post<CreditAdjustResult>(
    `/uniun/v1/admin/accounts/${id}/credits`,
    { op, amount, reason }
  );
  return CreditAdjustResultSchema.parse(res.data);
}

export async function fetchAdminPrices(): Promise<AdminPrice[]> {
  const res = await apiClient.get<AdminPrice[]>("/uniun/v1/admin/prices");
  return z.array(AdminPriceSchema).parse(res.data);
}

export async function upsertPrice(
  model: string,
  inputPerMtok: number,
  outputPerMtok: number
): Promise<AdminPrice> {
  const res = await apiClient.put<AdminPrice>(
    `/uniun/v1/admin/prices/${encodeURIComponent(model)}`,
    { input_per_mtok: inputPerMtok, output_per_mtok: outputPerMtok }
  );
  return AdminPriceSchema.parse(res.data);
}

export async function deletePrice(model: string): Promise<void> {
  await apiClient.delete(`/uniun/v1/admin/prices/${encodeURIComponent(model)}`);
}
