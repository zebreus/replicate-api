import { cancelPrediction } from "cancelPrediction"
import { getPrediction } from "getPrediction"
import { PredictionResponse, PredictionState } from "helpers/convertPrediction"
import { ReplicateRequestOptions } from "helpers/makeApiRequest"
import { pollPrediction } from "pollPrediction"

/** List does not return full predictions. This is the type for those response elements */
export type ShallowPredictionResponse = Pick<
  PredictionResponse,
  "id" | "version" | "created_at" | "started_at" | "completed_at" | "status"
>

/** Status of a prediction without the actual results
 *
 * You can use `.get()` to get the full `PredictionState`.
 */
export type ShallowPredictionState = Pick<
  PredictionState,
  "id" | "version" | "createdAt" | "startedAt" | "completedAt" | "status" | "get" | "cancel" | "poll"
>

/** Convert prediction list entries from replicate to a more idiomatic TypeScript object.
 *
 * Also adds `get()`, `cancel()` and `poll()` methods.
 */
export const convertShallowPrediction = (
  options: ReplicateRequestOptions,
  prediction: ShallowPredictionResponse
): ShallowPredictionState => {
  const PredictionState: ShallowPredictionState = {
    id: prediction.id,
    version: prediction.version,
    get: async () => await getPrediction({ ...options, id: prediction.id }),
    cancel: async () => await cancelPrediction({ ...options, id: prediction.id }),
    poll: async timeout => await pollPrediction({ ...options, id: prediction.id, timeout: timeout }),
    createdAt: prediction.created_at ? new Date(prediction.created_at) : undefined,
    startedAt: prediction.started_at ? new Date(prediction.started_at) : undefined,
    completedAt: prediction.completed_at ? new Date(prediction.completed_at) : undefined,
    status: prediction.status,
  }

  return PredictionState
}
