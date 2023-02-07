import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

export type GetPredictionOptions = {
  /** The id of a prediction */
  id: string
} & ReplicateRequestOptions

export const getPrediction = async (options: GetPredictionOptions) => {
  const response = await makeApiRequest<PredictionResponse>(options, "GET", `predictions/${options.id}`)
  return convertPrediction(options, response)
}
