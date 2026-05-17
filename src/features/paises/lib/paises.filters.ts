import { paisListParamsSchema } from "../schemas/paises.schema";

export function parsePaisListParams(url: string) {
  const searchParams = new URL(url).searchParams;

  const raw = {
    q: searchParams.get("q") ?? "",
    page: searchParams.get("page") ?? "1",
    pageSize: searchParams.get("pageSize") ?? "10",
    sortBy: searchParams.get("sortBy") ?? "nombre",
    sortDir: (searchParams.get("sortDir") ?? "asc") as "asc" | "desc",
  };

  const parsed = paisListParamsSchema.parse(raw);

  return {
    q: parsed.q,
    page: Number(parsed.page),
    pageSize: Number(parsed.pageSize),
    sortBy: parsed.sortBy,
    sortDir: parsed.sortDir,
  };
}
