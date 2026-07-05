import "server-only";

const BACKEND_URL = process.env.BACKEND_URL;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, body: { error?: string; details?: unknown } | undefined) {
    super(body?.error ?? `Request failed with status ${status}`);
    this.status = status;
    this.details = body?.details;
  }
}

interface BackendFetchOptions extends Omit<RequestInit, "headers"> {
  token?: string;
  headers?: Record<string, string>;
}

export async function backendFetch<T = unknown>(
  path: string,
  opts: BackendFetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = opts;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => undefined);

  if (!res.ok) {
    throw new ApiError(res.status, body);
  }

  return body as T;
}
