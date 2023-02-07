import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

export type CancelPredictionOptions = {
  /** The id of a prediction */
  id: string
} & ReplicateRequestOptions

/** Cancel a running prediction.
 * @returns `void` if the prediction was canceled, or the prediction if it was already completed.
 */
export const cancelPrediction = async (options: CancelPredictionOptions) => {
  await makeApiRequest(options, "POST", `predictions/${options.id}/cancel`)
}
