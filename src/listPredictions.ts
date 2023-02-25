import {
  convertShallowPrediction,
  ShallowPredictionResponse,
  ShallowPredictionState,
} from "helpers/convertShallowPrediction"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"

export type PagedRequestOptions = {
  // TODO: Maybe replace with a maxResults option?
  /** Set to true to get all results */
  all?: boolean
  /** Request data at this location. You should probably use the `.next()` method instead */
  cursor?: string
}

export type ListPredictionsOptions = PagedRequestOptions & ReplicateRequestOptions

type ListPredictionsResponse = {
  previous?: string
  next?: string //"https://api.replicate.com/v1/predictions?cursor=cD0yMDIyLTAxLTIxKzIzJTNBMTglM0EyNC41MzAzNTclMkIwMCUzQTAw",
  results: ShallowPredictionResponse[]
}

export type ListOfPredictions = {
  /** Up to 100 predictions */
  predictions: ShallowPredictionState[]
  /** Get the next predictions */
  next: () => Promise<ListOfPredictions>
  /** Cursor to get the next predictions manually. You should probably use the `.next()` method instead */
  nextCursor?: string
}

const getEmptyResult = async (): Promise<ListOfPredictions> => ({
  predictions: [],
  next: () => getEmptyResult(),
})

/** List your past predictions.
 *
 * ```typescript
 * const result = await listPredictions({
 *   token: "Get your token at https://replicate.com/account"
 * })
 * ```
 *
 * Returns up to 100 predictions. To get more, use the `next` function:
 * ```typescript
 * const moreResults = await result.next()
 * ```
 *
 * @returns A new `ShallowPredictionState`.
 */
export const listPredictions = async (options: ListPredictionsOptions): Promise<ListOfPredictions> => {
  const response = await makeApiRequest<ListPredictionsResponse>(
    options,
    "GET",
    `predictions${options.cursor ? "?cursor=" + options.cursor : ""}`
  )

  const predictions = response.results.map(prediction => convertShallowPrediction(options, prediction))
  const nextCursor = response.next?.split("cursor=").pop()
  const result = {
    predictions: predictions,
    next: () =>
      predictions.length && nextCursor ? listPredictions({ ...options, cursor: nextCursor }) : getEmptyResult(),
    ...(nextCursor ? { nextCursor } : {}),
  }

  if (!options.all) {
    return result
  }

  const nextResult = await result.next()
  const allResults = {
    predictions: [...result.predictions, ...nextResult.predictions],
    next: () => getEmptyResult(),
  }
  return allResults
}
