import { cancelPrediction } from "cancelPrediction"
import { getPrediction } from "getPrediction"
import { Options } from "helpers/makeApiRequest"
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

export type PredictionStatusObject = {
  id: string
  version: string
  get: () => Promise<PredictionStatusObject>
  cancel: () => Promise<void>
  /** Poll until the prediction is completed or failed
   * @param timeout The timeout in milliseconds
   */
  poll: (timeout?: number) => Promise<PredictionStatusObject>
  created_at?: Date
  started_at?: Date
  completed_at?: Date
  status: PredictionStatus
  input: Record<string, unknown>
  output: unknown
  error: null
  logs?: string
  metrics: {
    predict_time?: number
  }
}

export const convertPrediction = (options: Options, prediction: PredictionResponse): PredictionStatusObject => {
  const predictionStatus: PredictionStatusObject = {
    id: prediction.id,
    version: prediction.version,
    get: async () => await getPrediction({ ...options, id: prediction.id }),
    cancel: async () => await cancelPrediction({ ...options, id: prediction.id }),
    poll: async () => await pollPrediction({ ...options, id: prediction.id }, predictionStatus),
    created_at: prediction.created_at ? new Date(prediction.created_at) : undefined,
    started_at: prediction.started_at ? new Date(prediction.started_at) : undefined,
    completed_at: prediction.completed_at ? new Date(prediction.completed_at) : undefined,
    status: prediction.status,
    input: prediction.input,
    output: prediction.output,
    error: prediction.error,
    logs: prediction.logs ?? undefined,
    metrics: {
      predict_time: prediction.metrics?.predict_time,
    },
  }

  return predictionStatus
}
