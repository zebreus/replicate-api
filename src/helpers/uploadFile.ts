import { createReadStream, statSync } from "fs"
import { guessMimeType } from "helpers/loadFile"
import { basename } from "path"

/** Upload a file to replicate.com and return the serving URL.
 *
 * For now files are uploaded to replicate.com, using an endpoint that is probably not intended for us.
 * If this breaks, future versions of this function may upload to other hosters.
 *
 * The endpoint is behind cloudflare, so I am not sure if this even works without a browser or captchas.
 * Feel free to open issues for all the problems you encounter with this function https://github.com/zebreus/replicate-api/issues
 *
 * @deprecated This is highly experimental and depends on undocumented endpoints of the replicate.com website. It may break at any time. Please open an issue if it does not work for you.
 * @param path Path to a local file
 * @returns A URL where the file can be downloaded from
 */
export const uploadFile = async (path: string) => {
  const { uploadUrl, servingUrl } = await getFileUrls(path)

  const fileSizeInBytes = statSync(path).size
  const mimeType = await guessMimeType(path)
  const fileStream = createReadStream(path)

  const uploadRequest = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-length": fileSizeInBytes + "",
      "Content-type": mimeType,
    },
    body: fileStream as unknown as ReadableStream,
  })
  if (!uploadRequest.ok) {
    console.error(uploadRequest)
    throw new Error("Failed to upload file")
  }
  return servingUrl
}

let csrfToken: string | undefined = undefined

export const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken
  }
  const csrfTokenRequest = await fetch(
    "https://replicate.com/openai/whisper/versions/23241e5731b44fcb5de68da8ebddae1ad97c5094d24f94ccb11f7c1d33d661e2",
    { method: "GET" }
  )
  const setCookieHeader = csrfTokenRequest.headers.get("set-cookie")
  if (!setCookieHeader) {
    throw new Error("Failed to get CSRF token, no set-cookie header")
  }
  const receivedToken = setCookieHeader.match(/csrftoken=([^;]+)/)?.[1]
  if (!receivedToken) {
    throw new Error("Failed to get CSRF token, no token in set-cookie header")
  }
  csrfToken = receivedToken
  return csrfToken
}

export const getFileUrls = async (path: string) => {
  const mimeType = guessMimeType(path)
  const filename = basename(path)
  const url = `https://replicate.com/api/upload/${filename}?content_type=${encodeURIComponent(mimeType)}`
  const csrfToken = await getCsrfToken()
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "cookie": `csrftoken=${csrfToken};`,
      "origin": "https://replicate.com",
      "x-csrftoken": csrfToken,
    },
  })
  const response = await request.json()
  if (typeof response !== "object") {
    throw new Error("Failed to get file URLs")
  }
  const uploadUrl = response.upload_url ?? ""
  const servingUrl = response.serving_url ?? ""
  if (typeof uploadUrl !== "string") {
    throw new Error("Failed to get file URLs, got no upload url")
  }
  if (typeof servingUrl !== "string") {
    throw new Error("Failed to get file URLs, got no serving url")
  }
  return { uploadUrl, servingUrl }
}
