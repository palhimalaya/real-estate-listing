const DEFAULT_NEST_PUBLIC_BASE_URL = "http://localhost:3001";

export function getNestPublicBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL?.trim();

  if (!configured) {
    return DEFAULT_NEST_PUBLIC_BASE_URL;
  }

  return configured.replace(/\/$/, "");
}

export function buildNestPublicUrl(
  path: string,
  searchParams?: URLSearchParams,
): string {
  const base = getNestPublicBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url.toString();
}
