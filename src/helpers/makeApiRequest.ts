export type Options = {
  fetch?: typeof fetch
  token: string
  apiUrl?: string
}

export async function makeApiRequest<ExpectedResponse = unknown>(
  { fetch: fetchFunction = fetch, token, apiUrl = "https://api.replicate.com/v1/" }: Options,
  method: "POST" | "GET",
  endpoint: string,
  content?: object
) {
  const url = `${apiUrl}${endpoint}`
  const body = method === "POST" && content ? JSON.stringify(content) : null

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
