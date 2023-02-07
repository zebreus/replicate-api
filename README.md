# replicate-api

A typed client library for the [replicate.com](https://replicate.com/) API.

You can use this to access the prediction API in a type-safe and convenient way.

## Install

Just install it with your favourite package manager:

```bash
yarn add replicate-api
pnpm add replicate-api
npm install replicate-api
```

The package should work in the browser and in Node.js [versions 18 and up \*](#older-node-versions).

## Obtain a API token

You need an API token for nearly all operations. You can find the token in your
[account settings](https://replicate.com/account).

## Examples

### Generate an image with stable-diffusion

You can create a new prediction using the
[`stability-ai/stable-diffusion`](https://replicate.com/stability-ai/stable-diffusion) model and wait for the result
with:

```typescript
const prediction = await predict({
  model: "stability-ai/stable-diffusion", // The model name
  input: { prompt: "multicolor hyperspace" }, // The model specific input
  token: "...", // You need a token from replicate.com
  poll: true, // Wait for the model to finish
})

console.log(prediction.outputs[0])
// https://replicate.com/api/models/stability-ai/stable-diffusion/files/58a1dcfc-3d5d-4297-bac2-5395294fe463/out-0.png
```

This does some things for you like resolving the model name to a model version and polling until the prediction is
completed.

### Create a new prediction

```typescript
const result = await predict({ model: "replicate/hello-world", input: { prompt: "..." }, token: "..." })
```

Then you can check `result.status` to see if it's `"starting"`, `"processing"` or `succeeded`. If it's `"succeeded"` you
can get the outputs with `result.outputs`. If not you can check back later with `getPrediction` and the id from result
(`result.id`).

You can also set `poll: true` in the options of `predict` to wait until it has finished. If you dont do that, you can
still use `.poll()` to poll until the prediction is done.

### Wait until a prediction is finished

```typescript
// If you have a PredictionStatusObject:
const finishedPrediction = prediction.poll()

// If you only have the prediction ID:
const finishedPrediction = await pollPrediction({ id, token: "..." })

// If you are creating a new prediction anyways:
const finishedPrediction = await predict({ ...otherOptions, poll: true })
```

### Retrieve the current state of a prediction

```typescript
// If you have a PredictionStatusObject:
const currentPrediction = prediction.get()

// If you only have the prediction ID:
const currentPrediction = await getPrediction({ id, token: "..." })
```

### Cancel a running prediction

```typescript
// If you have a PredictionStatusObject:
const currentPrediction = result.cancel()

// If you only have the prediction ID:
const currentPrediction = await cancelPrediction({ id, token: "..." })
```

Canceling the prediction also returns the state of the prediction after canceling.

### Get information about a model

```typescript
const info = await getModel({ model: "replicate/hello-world", token: "..." })
```

### Get a list of all versions of a model

```typescript
const info = await getVersions({ model: "replicate/hello-world", token: "..." })
```

### Generate a prediction without using the convenience functions

The first example used a few convenience functions to make it easier to use the API. You can also use the lower level
functions that map the API calls more directly.

```typescript
const model = await getModel({ model: "stability-ai/stable-diffusion", token: "..." })

let prediction = await predict({
  version: model.version,
  input: { prompt: "multicolor hyperspace" },
  token: "...",
})

// pollPrediction does this a bit smarter, with increasing backoff
while (prediction.status === "starting" || prediction.status === "processing") {
  await new Promise(resolve => setTimeout(resolve, 1000))
  prediction = await getPrediction({ id: prediction.id, token: "..." })
}

console.log(prediction.outputs[0])
// https://replicate.com/api/models/stability-ai/stable-diffusion/files/58a1dcfc-3d5d-4297-bac2-5395294fe463/out-0.png
```

## Related projects

- [replicate-js](https://github.com/nicholascelestin/replicate-js) - A js object oriented client for replicate

## Older node versions

This package uses the `fetch` API which is only supported in Node.js 18 and up. If you need to use an older version of
node, you can use `node-fetch`. It will be detected and used automatically if your node does not provide a native fetch.
The Options object supports passing a custom fetch function, you can also try to pass `node-fetch` there.

## Building and testing this package

To run the tests for this package you need an API token from <replicate.com>. Then you create a `src/tests/token.ts`
file that exports the token as a string like: `export const token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" `. Now
you can run `yarn test` to run the tests.
