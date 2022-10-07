import { getPrediction } from "getPrediction"
import { PredictionStatusObject } from "helpers/convertPrediction"
import { Options } from "helpers/makeApiRequest"

type PollResultOptions = {
  /** The id of a prediction */
  id: string
  /** Timeout in milliseconds
   * @default 3600000
   */
  timeout?: number
} & Options

/** Poll until the prediction has completed */
export const pollResult = async (options: PollResultOptions, initialResult?: PredictionStatusObject) => {
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
