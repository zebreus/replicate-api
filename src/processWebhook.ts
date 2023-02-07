import { convertPrediction, PredictionResponse } from "helpers/convertPrediction"
import { ReplicateRequestOptions } from "helpers/makeApiRequest"

export type ProcessWebhookOptions = {
  /** The webhook body as an object */
  body: unknown
} & ReplicateRequestOptions

/** Convert the body of a replicate callback to a `PredictionStatusObject`.
 *
 * When creating a prediction you can set a URL that will be called by replicate once the prediction is completed. This function can take the body of that request and converts it to a `PredictionStatusObject`.
 */
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
