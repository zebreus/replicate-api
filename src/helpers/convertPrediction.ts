import { cancelPrediction } from "cancelPrediction"
import { getPrediction } from "getPrediction"
import { ReplicateRequestOptions } from "helpers/makeApiRequest"
import { pollPrediction } from "pollPrediction"

export type PredictionStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled"

export type PredictionResponse = {
  id: string
  version: string
  urls: {
    get: string
    cancel: string
  }
  created_at: string
  started_at: string | null
  completed_at: string | null
  status: PredictionStatus
  input: Record<string, unknown>
  output: unknown
  error: null
  logs: null | string
  metrics: {
    /** In seconds */
    predict_time?: number
  }
}

/** Status of a prediction
 *
 * The status is not automatically updated. You can use the `.get()` function on this object to get a new object with the current state on `replicate.com`. You can use `.poll()` to wait for the prediction to finish.
 */
export type PredictionState = {
  /** The id of this prediction */
  id: string
  /** The version of the model used to generate this prediction */
  version: string
  /** Get the updated state of this prediction from replicate
   *
   * @returns A new `PredictionState` representing the current state.
   */
  get: () => Promise<PredictionState>
  /** Cancel a running prediction.
   *
   * @returns A new `PredictionState` representing the updated state.
   */
  cancel: () => Promise<PredictionState>
  /** Poll until the prediction is completed or failed
   *
   *  If the timeout occurs an error is thrown.
   *
   * @param timeout The timeout in milliseconds
   * @returns The `PredictionState` for the finished prediction. It has a status of either "succeeded", "failed" or "canceled".
   */
  poll: (timeout?: number) => Promise<PredictionState>
  /** When the prediction was created */
  createdAt?: Date
  /** When execution of the prediction was started */
  startedAt?: Date
  /** When execution of the prediction was completed (or cancelled) */
  completedAt?: Date
  /** The status of the prediction */
  status: PredictionStatus
  /** The input parameters */
  input: Record<string, unknown>
  /** The output parameters */
  output: unknown
  error: null
  /** The logs of the prediction. A string seperated by newlines */
  logs?: string
  /** Metrics about the prediction */
  metrics: {
    /** In seconds */
    predictTime?: number
  }
}

/** Convert the result that we get from replicate to a more idiomatic TypeScript object.
 *
 * Also adds `get()`, `cancel()` and `poll()` methods.
 */
export const convertPrediction = (
  options: ReplicateRequestOptions,
  prediction: PredictionResponse
): PredictionState => {
  const PredictionState: PredictionState = {
    id: prediction.id,
    version: prediction.version,
    get: async () => await getPrediction({ ...options, id: prediction.id }),
    cancel: async () => await cancelPrediction({ ...options, id: prediction.id }),
    poll: async timeout => await pollPrediction({ ...options, id: prediction.id, timeout: timeout }, PredictionState),
    createdAt: prediction.created_at ? new Date(prediction.created_at) : undefined,
    startedAt: prediction.started_at ? new Date(prediction.started_at) : undefined,
    completedAt: prediction.completed_at ? new Date(prediction.completed_at) : undefined,
    status: prediction.status,
    input: prediction.input,
    output: prediction.output,
    error: prediction.error,
    logs: prediction.logs ?? undefined,
    metrics: {
      predictTime: prediction.metrics?.predict_time,
    },
  }

  return PredictionState
}
