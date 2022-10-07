import { extractModelAndOwner } from "extractModelAndOwner"
import { makeApiRequest, Options } from "makeApiRequest"
import { ModelVersionResponse } from "resolveModel"

type ResolveModelVersionsOptions = {
  model: string
} & Options

type ModelVersionsResponse = {
  previous: null | string
  next: null | string
  results: Array<ModelVersionResponse>
}

export const resolveModelVersions = async (options: ResolveModelVersionsOptions) => {
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
