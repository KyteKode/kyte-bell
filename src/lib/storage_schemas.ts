import { AMPM } from "$lib/time_type.svelte";

import * as z from "zod";

export const ZTime = z.object({
    hour: z.string().regex(/^(1[0-2]|[1-9])$/),
    minute: z.string().regex(/^[0-5][0-9]$/),
    ampm: z.enum(AMPM),
});
export type ZTime = z.infer<typeof ZTime>;

export const ZPeriodData = z.object({
    name: z.string(),
    start: ZTime,
    end: ZTime,
    other: z.record(z.string(), z.string()).optional(),
});
export type ZPeriodData = z.infer<typeof ZPeriodData>;

export const ZStoredData = z.object({
    version: z.literal(0).optional(),
    periods: z.array(ZPeriodData)
});
export type ZStoredData = z.infer<typeof ZStoredData>;