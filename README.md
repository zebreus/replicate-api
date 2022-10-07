# replicate-api

A typed client library for the [replicate.com](https://replicate.com/) API.

## Obtain a API token

You need an API token for nearly all operations. You can find the token in your
[account settings](https://replicate.com/account).

## Examples

### Generate an image with stable-diffusion

```typescript
const { id } = await predict({
  model: "stability-ai/stable-diffusion",
  input: { prompt: "multicolor hyperspace" },
  token: "...", // You need a token from replicate.com
})

const { outputs } = await pollPrediction({ id, token: "..." })

console.log(outputs[0])
// https://replicate.com/api/models/stability-ai/stable-diffusion/files/58a1dcfc-3d5d-4297-bac2-5395294fe463/out-0.png
```

This creates a new prediction using the
[`stability-ai/stable-diffusion`](https://replicate.com/stability-ai/stable-diffusion) model and waits for the result

### Create a new prediction

```typescript
const result = await predict({ model: "replicate/hello-world", input: { prompt: "..." }, token: "..." })
```

Then you can check `result.status` to see if it's `"starting"`, `"processing"` or `succeeded`. If it's `"succeeded"` you
can get the outputs with `result.outputs`. If not you can check back later with `getPrediction` and the id from result
(`result.id`).

You can also use `pollPrediction` to poll until the prediction is done.

### Retrieve the result of a prediction

```typescript
const result = await getPrediction({ id, token: "..." })
```

### Cancel a running prediction

```typescript
await cancelPrediction({ id, token: "..." })
```

### Get information about a model

```typescript
await getModel({ id, token: "..." })
```

You can use `getModel` to get metadata about a model, like the url or the github repo. It also gives you the latest
version, which you can use with `predict`.

## Related projects

- [replicate-js](https://github.com/nicholascelestin/replicate-js) - A js object oriented client for replicate
