import type { AMPM } from "$lib/time_type.svelte";

export interface StorageSchema {
    periods: JSONPeriodData[]
}

export interface JSONTime {
    hour: string,
    minute: string,
    ampm: AMPM
}

export interface JSONPeriodData {
    start: JSONTime,
    end: JSONTime,
    other: Record<string, string>,
    name: string
}