import { extractModelAndOwner } from "helpers/extractModelAndOwner"
import { makeApiRequest, ReplicateRequestOptions } from "helpers/makeApiRequest"
import { ModelNameOptions } from "predict"

export type ResolveModelOptions = ModelNameOptions & ReplicateRequestOptions

export type ModelVersionResponse = {
  id: string
  created_at: string
  cog_version: string
  openapi_schema: unknown
}

type ModelResponse = {
  url: string
  owner: string
  name: string
  description: null | string
  visibility: "public" | "private"
  github_url: null | string
  paper_url: null | string
  license_url: null | string
  latest_version: ModelVersionResponse
}

/** Get information about a model
 * ```typescript
 * const model = await getModel({
 *   model: "stability-ai/stable-diffusion",
 *   token: "Get your token at https://replicate.com/account"
 * })
 *
 * const version = model.version
 * ```
 */
export const getModel = async (options: ResolveModelOptions) => {
  const { owner, model } = extractModelAndOwner(options.model)
  const response = await makeApiRequest<ModelResponse>(options, "GET", `models/${owner}/${model}`)

  const result = {
    url: response.url,
    owner: response.owner,
    name: response.name,
    description: response.description ?? undefined,
    visibility: response.visibility,
    github: response.github_url ?? undefined,
    paper: response.paper_url ?? undefined,
    license: response.license_url ?? undefined,
    version: response.latest_version.id,
  }

  return result
}
