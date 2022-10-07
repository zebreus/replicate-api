import { PredictionResponse } from "convertPrediction"
import { makeApiRequest, Options } from "makeApiRequest"

type CancelPredictionOptions = {
  /** The id of a prediction */
  id: string
} & Options

export const cancelPrediction = async (options: CancelPredictionOptions) => {
  await makeApiRequest<PredictionResponse>(options, "POST", `predictions/${options.id}/cancel`)
}
