import { convertPrediction, PredictionResponse } from "convertPrediction"
import { makeApiRequest, Options } from "makeApiRequest"

type PredictOptions = {
  /** The ID of the model version that you want to run. */
  version: string
  /** The model's input as a JSON object. This differs for each model */
  input: Record<string, unknown>
  /** A webhook that is called when the prediction has completed. */
  webhook?: string
} & Options

export const predict = async (options: PredictOptions) => {
  const response = await makeApiRequest<PredictionResponse>(options, "POST", "predictions", {
    version: options.version,
    input: options.input,
    webhook: options.webhook,
  })

  return convertPrediction(options, response)
}
