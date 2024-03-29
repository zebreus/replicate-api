import { cancelPrediction } from "cancelPrediction"
import { log } from "console"
import { getModel } from "getModel"
import { getPrediction } from "getPrediction"
import { loadFile } from "helpers/loadFile"
import { listPredictions } from "listPredictions"
import { listVersions } from "listVersions"
import { pollPrediction } from "pollPrediction"
import { predict } from "predict"
import { token } from "tests/token"

test("Call predict", async () => {
  const prediction = predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
  })
  await expect(prediction).resolves.toBeTruthy()
  const result = await prediction
  result
})

test("Polling a prediction works", async () => {
  const prediction = await predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
  })
  expect(prediction.status).not.toBe("succeeded")
  const pollResult = await prediction.poll()
  expect(pollResult.status).toBe("succeeded")
}, 20000)

test("Polling with the poll function works", async () => {
  const prediction = await predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
  })
  expect(prediction.status).not.toBe("succeeded")
  const pollR = await pollPrediction({ token, id: prediction.id })
  expect(pollR.status).toBe("succeeded")
}, 20000)

test("Polling with the poll option", async () => {
  const prediction = await predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
    poll: true,
  })
  expect(prediction.status).toBe("succeeded")
}, 20000)

test("Call predict with a model id instead of a version", async () => {
  const prediction = predict({
    model: "stability-ai/stable-diffusion",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
  })
  await expect(prediction).resolves.toBeTruthy()
  const result = await prediction
  result
})

test("Can retrieve an existing prediction predict", async () => {
  const prediction = await getPrediction({
    id: "uhi3fggr6fgzbnjl5ccbzp3tme",
    token,
  })
  expect(prediction.version).toBe("a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef")
  expect(prediction.status).toBe("succeeded")
  log(prediction)
})

test("Canceling a existing prediction works", async () => {
  const prediction = await cancelPrediction({
    id: "uhi3fggr6fgzbnjl5ccbzp3tme",
    token,
  })
  await expect(["succeeded", "canceled", "failed"].includes(prediction.status)).toBeTruthy()
})

test("Canceling a running prediction works", async () => {
  const prediction = await predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
  })
  const canceledPrediction = await cancelPrediction({ id: prediction.id, token })
  expect(canceledPrediction.status).toBe("canceled")
}, 20000)

test("Fails to cancel a nonexistent prediction", async () => {
  const prediction = cancelPrediction({
    id: "uhi3fggr6fgzbnjl5ccbzpaaaa",
    token,
  })
  await expect(prediction).rejects.toBeTruthy()
})

test("Fails with invalid token", async () => {
  const prediction = predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token: "sjsakjfsladjf",
    input: {},
  })
  await expect(prediction).rejects.toBeTruthy()
})

test("Resolving a model works", async () => {
  const prediction = await getModel({
    model: "stability-ai/stable-diffusion",
    token,
  })
  expect(prediction.version).toBeDefined()
})

test("Resolving model versions works", async () => {
  const prediction = await listVersions({
    model: "stability-ai/stable-diffusion",
    token,
  })
  expect(prediction.versions.map(version => version.id)).toContain(
    "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"
  )
})

// These tests require a token that has more than 200 past predictions
test("Listing past predictions return 100 results", async () => {
  const { predictions } = await listPredictions({ token })
  expect(predictions.length).toBe(100)
})

test("Listing all past predictions returns a lot of results", async () => {
  const { predictions: allPastPredictions } = await listPredictions({ token, all: true })
  expect(allPastPredictions.length).toBeGreaterThan(200)
}, 120000)

test("Listing the next predictions returns different results than the first call", async () => {
  const { predictions, next } = await listPredictions({ token })
  expect(predictions.length).toBe(100)
  const { predictions: nextPredictions } = await next()
  expect(nextPredictions.length).toBe(100)
  expect(nextPredictions[0]?.id).not.toBe(predictions[0]?.id)
})

test("Using a model with a file input works", async () => {
  const prediction = predict({
    model: "openai/whisper",
    token,
    input: {
      audio: await loadFile("./testaudio.mp3"),
      model: "base",
    },
    poll: true,
  })
  const result = await prediction
  const { transcription } = (result?.output ?? {}) as { transcription?: unknown }
  expect(transcription).toBeTruthy()
  if (typeof transcription !== "string") {
    throw new Error("Transcription is not a string")
  }

  expect(transcription).toContain(
    "This is the Cal NEH American English Dialect Recordings Collection, produced with funding from the National Endowment for the Humanities and the Center for Applied Linguistics"
  )
}, 240000)

test("Calling predict with a webhook does not fail", async () => {
  const prediction = predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
    webhook: "https://google.com",
  })
  await expect(prediction).resolves.toBeTruthy()
  const awaitedPrediction = await prediction
  await expect(awaitedPrediction.cancel()).resolves.toBeTruthy()
})

test("Calling predict with a webhook and events does not fail", async () => {
  const prediction = predict({
    version: "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
    token,
    input: {
      prompt: "The quick brown fox jumps over the lazy dog",
    },
    webhook: "https://google.com",
    webhookEvents: ["completed", "start"],
  })
  await expect(prediction).resolves.toBeTruthy()
  const awaitedPrediction = await prediction
  await expect(awaitedPrediction.cancel()).resolves.toBeTruthy()
})
