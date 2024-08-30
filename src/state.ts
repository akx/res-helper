import { z } from "zod";

export const stateSchema = z.object({
  targetMpix: z.number(),
  pixLeeway: z.number(),
  minAR: z.number(),
  maxAR: z.number(),
  minSize: z.number(),
  maxSize: z.number(),
  quantization: z.number(),
  arFilter: z.union([
    z.literal("all"),
    z.literal("landscape"),
    z.literal("portrait"),
  ]),
  useTargetAR: z.boolean(),
  targetAR: z.string(),
  onlyTrainedResolutions: z.boolean(),
});
export type State = z.infer<typeof stateSchema>;

export function getDefaultState(): State {
  return {
    targetMpix: 1,
    pixLeeway: 0.1,
    minAR: 0.5,
    maxAR: 2.0,
    minSize: 512,
    maxSize: 2048,
    quantization: 64,
    arFilter: "all",
    useTargetAR: false,
    targetAR: "1",
    onlyTrainedResolutions: false,
  };
}
