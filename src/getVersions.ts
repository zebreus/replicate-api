import { ModelVersionResponse } from "getModel"
import { extractModelAndOwner } from "helpers/extractModelAndOwner"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"
import { ModelNameOptions } from "predict"

/** Options for `getVersions` */
export type GetVersionsOptions = ModelNameOptions & ReplicateRequestOptions

type ModelVersionsResponse = {
  previous: null | string
  next: null | string
  results: Array<ModelVersionResponse>
}

/** Get a list of all versions that are availabe for a model */
export const getVersions = async (options: GetVersionsOptions) => {
  const { owner, model } = extractModelAndOwner(options.model)
  const response = await makeApiRequest<ModelVersionsResponse>(options, "GET", `models/${owner}/${model}/versions`)

  const result = {
    next: response.next,
    previous: response.previous,
    /** The most recent version */
    version: response.results?.[0]?.id,
    versions: response.results?.map(version => ({
      id: version.id,
      created_at: new Date(version.created_at),
      cog_version: version.cog_version,
      schema: version.openapi_schema,
    })),
  }

  return result
}
