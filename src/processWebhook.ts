import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { Options } from "helpers/makeApiRequest"

export type ProcessWebhookOptions = {
  /** The webhook body as an object */
  body: unknown
} & Options

export const processWebhook = (options: ProcessWebhookOptions) => {
  const { body } = options

  if (
    typeof body !== "object" ||
    !body ||
    typeof (body as Record<string, unknown>)["id"] !== "string" ||
    typeof (body as Record<string, unknown>)["created_at"] !== "string"
  ) {
    throw new Error("You need to pass a valid PredictionResponse")
  }

  return convertPrediction(options, body as PredictionResponse)
}
