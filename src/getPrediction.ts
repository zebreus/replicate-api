import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

export type GetPredictionOptions = {
  /** The ID of a prediction */
  id: string
} & ReplicateRequestOptions

/** Get the `PredictionStatusObject` for a given ID.
 *
 * ```typescript
 * const result = await getPrediction({
 *   id: "ID of your prediction",
 *   token: "Get your token at https://replicate.com/account"
 * })
 * ```
 *
 * @returns A new `PredictionStatusObject`.
 */
export const getPrediction = async (options: GetPredictionOptions) => {
  const response = await makeApiRequest<PredictionResponse>(options, "GET", `predictions/${options.id}`)
  return convertPrediction(options, response)
}
