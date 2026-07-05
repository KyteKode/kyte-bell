import type { AMPM } from "$lib/time_type.svelte";

import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";
import JSONSchema from "$lib/assets/data_schema.json";

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(JSONSchema);

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

export function validate_data(data: string): boolean {
    try {
        const parsed = JSON.parse(data);
        return validate(parsed);
    } catch {
        return false;
    }
}