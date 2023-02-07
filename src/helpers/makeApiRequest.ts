/** Interface of a fetch function. Compatible with the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) */
export type FetchFunction = (
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<{ json: () => Promise<any>; ok: boolean; status: number }>

/** Basic options for every request */
export type ReplicateRequestOptions = {
  /** Use a custom fetch function. Defaults to the native fetch or `node-fetch` */
  fetch?: FetchFunction
  /** You need an https://replicate.com API token for nearly all operations. You can generate the token in your [account settings](https://replicate.com/account). */
  token: string
  /** The actual API endpoint. Defaults to "https://api.replicate.com/v1/" */
  apiUrl?: string
}

// webpackIgnore: true
const nodeFetch = "node-fetch"

const defaultFetch: FetchFunction | undefined | Promise<FetchFunction | undefined> =
  typeof fetch !== "undefined"
    ? fetch
    : typeof self === "undefined"
    ? // eslint-disable-next-line import/no-unresolved
      import(/* webpackIgnore: true */ nodeFetch).then(module => module.default).catch(() => undefined)
    : undefined

export async function makeApiRequest<ExpectedResponse = unknown>(
  { fetch: passedFetchFunction, token, apiUrl = "https://api.replicate.com/v1/" }: ReplicateRequestOptions,
  method: "POST" | "GET",
  endpoint: string,
  content?: object
) {
  const url = `${apiUrl}${endpoint}`
  const body = method === "POST" && content ? JSON.stringify(content) : null
  const fetchFunctionOrPromise = passedFetchFunction || defaultFetch
  const fetchFunction = await fetchFunctionOrPromise

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
