import { apiClient } from "@/lib/api";
import { Paginated, withPagination } from "@/types/common";
import { ApiKey, ApiKeySchema, MintedKey, MintedKeySchema } from "../types";

export async function fetchKeys(
  page: number,
  perPage: number
): Promise<Paginated<ApiKey>> {
  const res = await apiClient.get<ApiKey[]>(
    `/uniun/v1/keys?page=${page}&per_page=${perPage}`
  );
  return withPagination(ApiKeySchema).parse(res);
}

// Mints another key for the account (rotation). The returned api_key is the
// only time the secret is visible — the gateway keeps just a hash.
export async function mintKey(name: string): Promise<MintedKey> {
  const res = await apiClient.post<MintedKey>("/uniun/v1/keys", { name });
  return MintedKeySchema.parse(res.data);
}

export async function revokeKey(id: string): Promise<void> {
  await apiClient.delete(`/uniun/v1/keys/${encodeURIComponent(id)}`);
}
