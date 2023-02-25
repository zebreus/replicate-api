import { ModelVersionResponse } from "getModel"
import { extractModelAndOwner } from "helpers/extractModelAndOwner"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"
import { PagedRequestOptions } from "listPredictions"
import { ModelNameOptions } from "predict"

/** Options for `getVersions` */
export type GetVersionsOptions = PagedRequestOptions & ModelNameOptions & ReplicateRequestOptions

type ModelVersionsResponse = {
  previous?: string
  next?: string
  results: Array<ModelVersionResponse>
}

export type ModelVersion = {
  id: string
  createdAt: Date
  cogVersion: string
  schema: unknown
}

export type ListOfVersions = {
  /** The id of the latest version */
  version: string | undefined
  /** Up to 100 versions */
  versions: ModelVersion[]
  /** Get the next versions */
  next: () => Promise<ListOfVersions>
  /** Cursor to get the next versions manually. You should probably use the `.next()` method instead */
  nextCursor?: string
}

const getEmptyResult = async (): Promise<ListOfVersions> => ({
  version: undefined,
  versions: [],
  next: () => getEmptyResult(),
})

/** Get a list of all versions that are availabe for a model
 * ```typescript
 * const {versions, version} = await getVersions({
 *   model: "stability-ai/stable-diffusion",
 *   token: "Get your token at https://replicate.com/account"
 * })
 * ```
 */
export const getVersions = async (options: GetVersionsOptions): Promise<ListOfVersions> => {
  const { owner, model } = extractModelAndOwner(options.model)
  const response = await makeApiRequest<ModelVersionsResponse>(
    options,
    "GET",
    `models/${owner}/${model}/versions${options.cursor ? "?cursor=" + options.cursor : ""}`
  )

  const versions = response.results.map(version => ({
    id: version.id,
    createdAt: new Date(version.created_at),
    cogVersion: version.cog_version,
    schema: version.openapi_schema,
  }))
  const nextCursor = response.next?.split("cursor=").pop()
  const result = {
    version: versions[0]?.id,
    versions: versions,
    next: () => (versions.length && nextCursor ? getVersions({ ...options, cursor: nextCursor }) : getEmptyResult()),
    ...(nextCursor ? { nextCursor } : {}),
  }

  if (!options.all) {
    return result
  }

  const nextResult = await result.next()
  const allResults = {
    version: result.version,
    versions: [...result.versions, ...nextResult.versions],
    next: () => getEmptyResult(),
  }
  return allResults
}
