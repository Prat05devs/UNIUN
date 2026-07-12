import { apiClient } from "@/lib/api";
import { Paginated, withPagination } from "@/types/common";
import {
  Credits,
  CreditsSchema,
  UsageRow,
  UsageRowSchema
} from "../types";

export async function fetchCredits(): Promise<Credits> {
  const res = await apiClient.get<Credits>("/uniun/v1/credits");
  return CreditsSchema.parse(res.data);
}

export async function fetchUsage(
  page: number,
  perPage: number
): Promise<Paginated<UsageRow>> {
  const res = await apiClient.get<UsageRow[]>(
    `/uniun/v1/usage?page=${page}&per_page=${perPage}`
  );
  return withPagination(UsageRowSchema).parse(res);
}
