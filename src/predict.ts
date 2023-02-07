import { getModel } from "getModel"
import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

/** Option for the model name; e.g. `stability-ai/stable-diffusion`  */
export type ModelNameOptions = {
  /** The name of the model; e.g. `stability-ai/stable-diffusion` */
  model: string
}

/** Option for the model version */
export type ModelVersionOptions = {
  /** The ID of the model version that you want to run. */
  version: string
}

/** Options for creating a new prediction */
export type PredictOptions = {
  /** The model's input as a JSON object. This differs for each model */
  input: Record<string, unknown>
  /** A webhook that is called when the prediction has completed. */
  webhook?: string
  /** Set to true to poll until the prediction is completed */
  poll?: boolean
} & (ModelVersionOptions | ModelNameOptions) &
  ReplicateRequestOptions

/** Create a new prediction
 *
 * ```typescript
 * const result = await predict({
 *   model: "stability-ai/stable-diffusion",
 *   input: { prompt: "multicolor hyperspace" },
 *   token: "Get your token at https://replicate.com/account",
 *   poll: true,
 * })
 * ```
 *
 * Then you can check `result.status` to see if it's `"starting"`, `"processing"` or `succeeded`. If it's `"succeeded"` you can get the outputs with `result.outputs`. If not you can check back later with `getPrediction` and the id from result (`result.id`).
 *
 * If you set the `poll` option this function will return a promise that waits until the prediction is completed.
 */
export const predict = async (options: PredictOptions) => {
  const version = "version" in options ? options.version : (await getModel(options)).version
  const response = await makeApiRequest<PredictionResponse>(options, "POST", "predictions", {
    version: version,
    input: options.input,
    webhook_completed: options.webhook,
  })

  const prediction = convertPrediction(options, response)
  return options.poll ? await prediction.poll() : prediction
}
