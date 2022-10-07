import { convertPrediction, PredictionResponse } from "convertPrediction"
import { makeApiRequest, Options } from "makeApiRequest"
import { resolveModel } from "resolveModel"

type ModelIdentifier =
  | {
      /** The ID of the model version that you want to run. */
      version: string
    }
  | {
      /** The name of the model; e.g. `stability-ai/stable-diffusion` */
      model: string
    }

type PredictOptions = {
  /** The model's input as a JSON object. This differs for each model */
  input: Record<string, unknown>
  /** A webhook that is called when the prediction has completed. */
  webhook?: string
} & ModelIdentifier &
  Options

export const predict = async (options: PredictOptions) => {
  const version = "version" in options ? options.version : (await resolveModel(options)).version
  const response = await makeApiRequest<PredictionResponse>(options, "POST", "predictions", {
    version: version,
    input: options.input,
    webhook: options.webhook,
  })

  return convertPrediction(options, response)
}
