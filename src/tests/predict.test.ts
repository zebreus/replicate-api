import { cancelPrediction } from "cancelPrediction"
import { log } from "console"
import { getPrediction } from "getPrediction"
import { predict } from "predict"
import { resolveModel } from "resolveModel"
import { resolveModelVersions } from "resolveModelVersions"
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

test("Can cancel a existing prediction", async () => {
  const prediction = cancelPrediction({
    id: "uhi3fggr6fgzbnjl5ccbzp3tme",
    token,
  })
  await expect(prediction).resolves.toBeUndefined()
})

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
  const prediction = await resolveModel({
    model: "stability-ai/stable-diffusion",
    token,
  })
  expect(prediction.version).toBeDefined()
})

test("Resolving model versions works", async () => {
  const prediction = await resolveModelVersions({
    model: "stability-ai/stable-diffusion",
    token,
  })
  expect(prediction.versions.map(version => version.id)).toContain(
    "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"
  )
})
