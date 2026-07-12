import { apiClient } from "@/lib/api";
import { Profile, ProfileSchema } from "../types";

export async function fetchProfile(): Promise<Profile> {
  const res = await apiClient.get<Profile>("/uniun/v1/profile");
  return ProfileSchema.parse(res.data);
}

// Both fields optional, at least one required (400 invalid_request otherwise).
// username: 3–32 [a-z0-9_], unique → 409 username_taken. email: syntax only.
export async function updateProfile(updates: {
  username?: string;
  email?: string;
}): Promise<Profile> {
  const res = await apiClient.put<Profile>("/uniun/v1/profile", updates);
  return ProfileSchema.parse(res.data);
}
