# replicate-api

A typed client library for the replicate.com API.

## Examples

### Create a new prediction

```typescript
const { id } = await predict({ version: "", input: { prompt: "..." }, apiKey: "..." })
```

### Retrieve the result of a prediction

```typescript
const result = await getPrediction({ id, apiKey: "..." })
```

### Cancel a running prediction

```typescript
await getPrediction({ id, apiKey: "..." })
```

## Related projects

- [replicate-js](https://github.com/nicholascelestin/replicate-js) - A js object oriented client for replicate
