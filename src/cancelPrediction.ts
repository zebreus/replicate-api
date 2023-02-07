import { getPrediction } from "getPrediction"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

export type CancelPredictionOptions = {
  /** The id of a prediction */
  id: string
} & ReplicateRequestOptions

/** Cancel a running prediction.
 * ```typescript
 * const result = await cancelPrediction({
 *   id: "ID of your prediction",
 *   token: "Get your token at https://replicate.com/account"
 * })
 * ```
 * If you have a `PredictionStatusObject`, you don't have to use this function, just call `.cancel()` on that object.
 *
 * @returns A `PredictionStatusObject` representing the new state.
 */
export const cancelPrediction = async (options: CancelPredictionOptions) => {
  await makeApiRequest(options, "POST", `predictions/${options.id}/cancel`)
  return await getPrediction(options)
}
