/** Converts a single string in the form of `owner/model` to an object with `owner` and `model` properties.
 *
 * @param ownerModel A string like `stability-ai/stable-diffusion`
 */
export const extractModelAndOwner = (ownerModel: string) => {
  if (!ownerModel.includes("/")) {
    throw new Error("model must be in the form owner/model")
  }

  const owner = ownerModel.split("/")[0]
  const model = ownerModel.split("/")[1]

  if (!owner) {
    throw new Error("The model name must contain the owner before the slash")
  }

  if (!model) {
    throw new Error("The model name must contain the model after the slash")
  }

  return {
    owner,
    model,
  }
}
