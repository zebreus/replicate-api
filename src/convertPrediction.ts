import { getPrediction } from "getPrediction"
import { Options } from "makeApiRequest"

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
  output: Array<string>
  error: null
  logs: null | string
  metrics: {
    /** In seconds */
    predict_time?: number
  }
}

export const convertPrediction = (options: Options, prediction: PredictionResponse) => {
  const predictionStatus = {
    id: prediction.id,
    version: prediction.version,
    get: async () => await getPrediction({ ...options, id: prediction.id }),
    cancel: null, //TODO insert function
    created_at: prediction.created_at ? new Date(prediction.created_at) : null,
    started_at: prediction.started_at ? new Date(prediction.started_at) : null,
    completed_at: prediction.completed_at ? new Date(prediction.completed_at) : null,
    status: prediction.status,
    input: prediction.input,
    output: prediction.output,
    error: prediction.error,
    logs: prediction.logs,
    metrics: {
      predict_time: prediction.metrics?.predict_time,
    },
  }

  return predictionStatus
}
