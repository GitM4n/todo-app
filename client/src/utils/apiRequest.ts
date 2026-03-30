export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public response: unknown,
    message?: string
  ) {
    super(message ?? statusText);
  }
}

export type RequestQueryOption = Record<string, unknown>;
export type RequestBodyOption = unknown;
export type RequestHeaderOption = Record<string, string>;

export type HttpRequestOptions = {
  query?: RequestQueryOption;
  body?: RequestBodyOption;
  headers?: RequestHeaderOption;
};

export const httpUrl = {
  apiBaseUrl: '',
};

export async function apiRequest<TRes = unknown>(
  method: HttpMethod,
  endpoint: string,
  { query, body, headers: customHeaders }: HttpRequestOptions = {}
): Promise<TRes> {
  const url = new URL(endpoint, httpUrl.apiBaseUrl);

  if (query)
    url.search = new URLSearchParams(
      Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)]))
    ).toString();

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...customHeaders,
  };

  let payload: BodyInit | undefined;
  if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: payload,
  });

  const text = await response.text();

  let data: unknown;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, data);
  }

  return data as TRes;
}
