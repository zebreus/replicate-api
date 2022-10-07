import { makeApiRequest, Options } from "helpers/makeApiRequest"

type CancelPredictionOptions = {
  /** The id of a prediction */
  id: string
} & Options

/** Cancel a running prediction.
 * @returns `void` if the prediction was canceled, or the prediction if it was already completed.
 */
export const cancelPrediction = async (options: CancelPredictionOptions) => {
  await makeApiRequest(options, "POST", `predictions/${options.id}/cancel`)
}
