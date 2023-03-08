// eslint-disable-next-line import/no-deprecated
import { getCsrfToken, getFileUrls, uploadFile } from "helpers/uploadFile"

test("Should be able to obtain CSRF token", async () => {
  const csrfTokenRequest = await fetch(
    "https://replicate.com/openai/whisper/versions/23241e5731b44fcb5de68da8ebddae1ad97c5094d24f94ccb11f7c1d33d661e2",
    { method: "GET" }
  )
  const setCookieHeader = csrfTokenRequest.headers.get("set-cookie")
  expect(setCookieHeader).toBeTruthy()
  if (!setCookieHeader) {
    throw new Error("No set-cookie header")
  }
  console.log(setCookieHeader)
  const csrfToken = setCookieHeader.match(/csrftoken=([^;]+)/)?.[1]
  console.log(csrfToken)
  expect(csrfToken).toBeTruthy()
})

test("Function for getting csrf token seems to work", async () => {
  const csrfToken = await getCsrfToken()

  const uploadRequest = await fetch("https://replicate.com/api/upload/hai.wav?content_type=audio%2Fwav", {
    method: "POST",
    headers: {
      "cookie": `csrftoken=${csrfToken};`,
      "origin": "https://replicate.com",
      "x-csrftoken": csrfToken,
    },
  })

  const uploadResponse = await uploadRequest.json()
  expect(uploadResponse).toBeTruthy()
})

test("Function for getting upload URLs works", async () => {
  const urls = await getFileUrls("./testaudio.mp3")
  expect(urls.servingUrl).toBeTruthy()
  expect(urls.uploadUrl).toBeTruthy()
})

test("Function for uploading files works", async () => {
  // eslint-disable-next-line import/no-deprecated
  const servingUrl = await uploadFile("./testaudio.mp3")
  expect(servingUrl).toBeTruthy()
})
