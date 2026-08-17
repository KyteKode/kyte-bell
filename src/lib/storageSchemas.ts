import { AMPM } from "$lib/time.svelte";

import * as z from "zod";

export const ZTime = z.object({
    hour: z.string().regex(/^(1[0-2]|[1-9])$/),
    minute: z.string().regex(/^[0-5][0-9]$/),
    ampm: z.enum(AMPM),
});
export type ZTime = z.infer<typeof ZTime>;

export const ZPeriod = z.object({
    name: z.string(),
    start: ZTime,
    end: ZTime,
    other: z.record(z.string(), z.string()).optional(),
});
export type ZPeriod = z.infer<typeof ZPeriod>;

export const ZCriterion = z.union([
    z.object({
        kind: z.literal("dayOfWeek"),
        day: z.number().min(0).max(6)
    }),
    z.object({
        kind: z.literal("month"),
        month: z.number().min(0).max(11)
    }),
    z.object({
        kind: z.literal("date"),
        day: z.number().min(1).max(31),
        month: z.number().min(0).max(11)
    })
]);
export type ZCriterion = z.infer<typeof ZCriterion>;

export const ZPreset = z.object({
    name: z.string(),
    periods: z.array(ZPeriod),
    criteria: z.array(ZCriterion)
});
export type ZPreset = z.infer<typeof ZPreset>;

export const ZStoredData = z.object({
    version: z.literal(1),
    presets: z.array(ZPreset).min(1),
    defaultPreset: z.number().min(0)
}).refine(
    (data) => data.defaultPreset < data.presets.length,
    {
        message: "defaultPreset must be a valid index into presets",
        path: ["defaultPreset"]
    }
);
export type ZStoredData = z.infer<typeof ZStoredData>;

export const ZStoredDataV0 = z.object({
    version: z.literal(0).optional(),
    periods: z.array(ZPeriod)
});
export type ZStoredDataV0 = z.infer<typeof ZStoredDataV0>;



export function migrateV1(data: ZStoredDataV0): ZStoredData {
    return {
        version: 1,
        presets: [
            {
                name: "Classes",
                periods: data.periods,
                criteria: [],
            }
        ],
        defaultPreset: 0
    }
}