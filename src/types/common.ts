import { z, ZodTypeAny } from "zod";

// Gateway list envelope pagination: { page, per_page, total, total_pages }
export const PaginationSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number()
});

export type Pagination = z.infer<typeof PaginationSchema>;

export type Paginated<T> = {
  data: T[];
  pagination: Pagination;
};

export function withPagination<T extends ZodTypeAny>(schema: T) {
  return z.object({
    data: z.array(schema),
    pagination: PaginationSchema
  });
}
