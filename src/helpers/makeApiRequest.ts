export type Options = {
  fetch?: (
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<{ json: () => Promise<any>; ok: boolean; status: number }>
  token: string
  apiUrl?: string
}

// webpackIgnore: true
const nodeFetch = "node-fetch"

let defaultFetch =
  typeof fetch !== "undefined"
    ? fetch
    : typeof self === "undefined"
    ? // @ts-expect-error: node-fetch is not a dependency
      // eslint-disable-next-line import/no-unresolved
      import(/* webpackIgnore: true */ nodeFetch)
        .then(module => {
          defaultFetch = module.default
        })
        .catch(() => undefined) && undefined
    : undefined

export async function makeApiRequest<ExpectedResponse = unknown>(
  { fetch: fetchFunction = defaultFetch, token, apiUrl = "https://api.replicate.com/v1/" }: Options,
  method: "POST" | "GET",
  endpoint: string,
  content?: object
) {
  const url = `${apiUrl}${endpoint}`
  const body = method === "POST" && content ? JSON.stringify(content) : null

  if (!fetchFunction) {
    throw new Error("fetch is not available. Use node >= 18 or install node-fetch")
  }

  const response = await fetchFunction(url, {
    method,
    body,
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
  const responseJson = await response.json()
  if (!response.ok) {
    const detail = responseJson.detail
    if (typeof detail === "string") {
      throw new Error(detail)
    }
    throw new Error(`Request failed (${response.status}): ${JSON.stringify(responseJson)}`)
  }
  return responseJson as ExpectedResponse
}
