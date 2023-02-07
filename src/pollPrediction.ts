import { getPrediction } from "getPrediction"
import { PredictionStatusObject } from "helpers/convertPrediction"
import { ReplicateRequestOptions } from "helpers/makeApiRequest"

export type PollPredictionOptions = {
  /** The id of a prediction */
  id: string
  /** Timeout in milliseconds
   * @default 3600000
   */
  timeout?: number
} & ReplicateRequestOptions

/** Poll a prediction by ID.
 *
 * ```typescript
 * const result = await pollPrediction({
 *   id: "ID of your prediction",
 *   token: "Get your token at https://replicate.com/account"
 * })
 * ```
 * If you have a `PredictionStatusObject`, you don't have to use this function, just call `.poll()` on that object.
 *
 *  If the timeout occurs an error is thrown.
 *
 * @returns A new `PredictionStatusObject`. It has a status of either "succeeded", "failed" or "canceled".
 */
export const pollPrediction = async (options: PollPredictionOptions, initialResult?: PredictionStatusObject) => {
  let newPrediction = initialResult || (await getPrediction({ ...options, id: options.id }))

  const endAt = Date.now() + (options.timeout ?? 3600000)

  while (Date.now() < endAt) {
    if (
      newPrediction.status === "succeeded" ||
      newPrediction.status === "failed" ||
      newPrediction.status === "canceled"
    ) {
      return newPrediction
    }

    const elapsedTime = newPrediction.started_at ? Date.now() - newPrediction.started_at.getTime() : 0
    const sleepDuration = elapsedTime < 10000 ? 1000 : elapsedTime < 60000 ? 5000 : 10000
    if (newPrediction !== initialResult) {
      await new Promise(resolve => setTimeout(resolve, sleepDuration))
    }
    newPrediction = await getPrediction({ ...options, id: options.id })
  }
  throw new Error("Prediction timed out")
}
