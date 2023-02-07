import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

export type GetPredictionOptions = {
  /** The ID of a prediction */
  id: string
} & ReplicateRequestOptions

/** Get the `PredictionStatusObject` for a given ID.
 */
export const getPrediction = async (options: GetPredictionOptions) => {
  const response = await makeApiRequest<PredictionResponse>(options, "GET", `predictions/${options.id}`)
  return convertPrediction(options, response)
}
