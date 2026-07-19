import { z } from "zod";
import { apiClient } from "@/lib/api";
import { Paginated, withPagination } from "@/types/common";
import {
  AdminAccount,
  AdminAccountSchema,
  AdminModel,
  AdminModelSchema,
  AdminPlan,
  AdminPlanSchema,
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

// --- plans (price + unlocked models; POST creates, PATCH edits any subset) ---

export async function fetchAdminPlans(): Promise<AdminPlan[]> {
  const res = await apiClient.get<AdminPlan[]>("/uniun/v1/admin/plans");
  return z.array(AdminPlanSchema).parse(res.data);
}

export async function createPlan(plan: AdminPlan): Promise<AdminPlan> {
  const res = await apiClient.post<AdminPlan>("/uniun/v1/admin/plans", plan);
  return AdminPlanSchema.parse(res.data);
}

export async function patchPlan(
  name: string,
  updates: Partial<Omit<AdminPlan, "name">>
): Promise<AdminPlan> {
  const res = await apiClient.patch<AdminPlan>(
    `/uniun/v1/admin/plans/${encodeURIComponent(name)}`,
    updates
  );
  return AdminPlanSchema.parse(res.data);
}

// 409 plan_in_use when accounts still reference it.
export async function deletePlan(name: string): Promise<void> {
  await apiClient.delete(`/uniun/v1/admin/plans/${encodeURIComponent(name)}`);
}

// --- model catalog ---

export async function fetchAdminModels(): Promise<AdminModel[]> {
  const res = await apiClient.get<AdminModel[]>("/uniun/v1/admin/models");
  return z.array(AdminModelSchema).parse(res.data);
}

export async function upsertModel(
  id: string,
  updates: { display_name: string; category: string; available?: boolean }
): Promise<AdminModel> {
  const res = await apiClient.put<AdminModel>(
    `/uniun/v1/admin/models/${encodeURIComponent(id)}`,
    updates
  );
  return AdminModelSchema.parse(res.data);
}

export async function deleteModel(id: string): Promise<void> {
  await apiClient.delete(`/uniun/v1/admin/models/${encodeURIComponent(id)}`);
}

// Proxies the CLIProxyAPI sidecar's /v1/models so the operator picks real
// Claude ids instead of typing them. 502 upstream_error when it's unreachable.
export async function fetchCliproxyModels(): Promise<string[]> {
  const res = await apiClient.get<unknown>("/uniun/v1/admin/cliproxy/models");
  const parsed = z
    .object({ data: z.array(z.object({ id: z.string() })) })
    .safeParse(res.data);
  return parsed.success ? parsed.data.data.map((m) => m.id) : [];
}

// Provider (backend) credentials are config-only on the gateway — the old
// /admin/providers endpoints were removed; there is nothing to call here.
