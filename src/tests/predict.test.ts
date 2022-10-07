import { cancelPrediction } from "cancelPrediction"
import { log } from "console"
import { getModel } from "getModel"
import { getPrediction } from "getPrediction"
import { getVersions } from "getVersions"
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
  const prediction = await getModel({
    model: "stability-ai/stable-diffusion",
    token,
  })
  expect(prediction.version).toBeDefined()
})

test("Resolving model versions works", async () => {
  const prediction = await getVersions({
    model: "stability-ai/stable-diffusion",
    token,
  })
  expect(prediction.versions.map(version => version.id)).toContain(
    "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"
  )
})
