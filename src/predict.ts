import { makeApiRequest, Options } from "makeApiRequest"

type PredictOptions = {
  /** The ID of the model version that you want to run. */
  version: string
  /** The model's input as a JSON object. This differs for each model */
  input: Record<string, unknown>
  /** A webhook that is called when the prediction has completed. */
  webhook?: string
} & Options

export type PredictionStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled"

type PredictResponse = {
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
  output: null
  error: null
  logs: null
  metrics: Record<string, never>
}

export const predict = async (options: PredictOptions) => {
  const result = await makeApiRequest<PredictResponse>(options, "POST", "predictions", {
    version: options.version,
    input: options.input,
    webhook: options.webhook,
  })

  const response = {
    id: result.id,
    version: result.version,
    get: null, //TODO insert function
    cancel: null, //TODO insert function
    created_at: result.created_at ? new Date(result.created_at) : null,
    started_at: result.started_at ? new Date(result.started_at) : null,
    completed_at: result.completed_at ? new Date(result.completed_at) : null,
    status: result.status,
    input: result.input,
    output: result.output,
    error: result.error,
    logs: result.logs,
    metrics: result.metrics,
  }

  return response
}
