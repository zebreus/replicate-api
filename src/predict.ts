import { getModel } from "getModel"
import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { makeApiRequest, Options } from "helpers/makeApiRequest"

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
  /** Set to true to poll until the prediction is completed */
  poll?: boolean
} & ModelIdentifier &
  Options

export const predict = async (options: PredictOptions) => {
  const version = "version" in options ? options.version : (await getModel(options)).version
  const response = await makeApiRequest<PredictionResponse>(options, "POST", "predictions", {
    version: version,
    input: options.input,
    webhook: options.webhook,
  })

  const prediction = convertPrediction(options, response)
  return options.poll ? await prediction.poll() : prediction
}
