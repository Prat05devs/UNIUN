import { z } from "zod";
import { apiClient } from "@/lib/api";
import { Model, ModelSchema, Plan, PlanSchema, Price, PriceSchema } from "../types";

export async function fetchPlans(): Promise<Plan[]> {
  const res = await apiClient.get<Plan[]>("/uniun/v1/plans", { auth: false });
  return z.array(PlanSchema).parse(res.data);
}

export async function fetchModels(): Promise<Model[]> {
  const res = await apiClient.get<Model[]>("/uniun/v1/models", {
    auth: false
  });
  return z.array(ModelSchema).parse(res.data);
}

export async function fetchPrices(): Promise<Price[]> {
  const res = await apiClient.get<Price[]>("/uniun/v1/prices", {
    auth: false
  });
  return z.array(PriceSchema).parse(res.data);
}
