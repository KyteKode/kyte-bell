import Time from "$lib/time_type.svelte";
import PeriodValidData from "$lib/period_valid_data.svelte"
import globals from "$lib/globals.svelte";
import type { JSONPeriodData } from "$lib/storage_schemas";

function latest_end() {
    let latest: Time | null = null;
    for (const period of globals.periods) {
        if (latest == null || period.end.after(latest)) {
            latest = period.end;
        }
    }

    if (latest == null) { return new Time(); }
    return latest.clone();
}

export default class PeriodData {
    start: Time = $state(new Time());
    end: Time = $state(new Time());
    other: Record<string, string> = $state({});
    name: string = $state("Class");

    valid: PeriodValidData = $derived(this.is_valid());

    constructor(start?: Time, end?: Time, other?: Record<string, string>, name?: string) {
        if (start) {
            this.start = start;
        } else {
            const latest = latest_end() ?? new Time();
            this.start = latest.clone();
        }

        if (end) {
            this.end = end;
        } else {
            const latest = latest_end() ?? new Time();

            let new_min = Number(latest.minute) + 40;
            let new_hour = Number(latest.hour);
            let new_ampm = latest.ampm;
            if (new_min > 59) {
                new_min %= 60;
                new_hour++;
                if (new_hour == 12) {
                    new_ampm = 1 - new_ampm;
                }
                if (new_hour == 13) {
                    new_hour = 1;
                }
            }

            this.end = new Time(new_hour, new_min, new_ampm);
        }

        this.other = other ?? {};
        this.name = name ?? "Class";
    }

    private is_valid(this: PeriodData): PeriodValidData {
        const valid_data: PeriodValidData = new PeriodValidData();

        // Checks if the start and end is valid
        valid_data.start_valid = this.start.valid;
        valid_data.end_valid = this.end.valid;

        // Checks if the start is before the end
        valid_data.end_after_start = this.end.after(this.start);

        // Checks if period overlaps with any other periods in any way
        valid_data.no_time_overlap = true;
        valid_data.no_name_overlap = true;

        for (const data of globals.periods) {
            // Checks if time overlaps
            const this_start = this.start.to_minutes();
            const this_end = this.end.to_minutes();
            const other_start = data.start.to_minutes();
            const other_end = data.end.to_minutes();

            if (this_start < other_end && other_start < this_end) {
                valid_data.no_time_overlap = false;
            }
        }
        return valid_data;
    }

    to_json_interface(this: PeriodData): JSONPeriodData {
        return {
            start: this.start.to_json_interface(),
            end: this.end.to_json_interface(),
            other: this.other,
            name: this.name
        }
    }

    static from_json_interface(data: JSONPeriodData) {
        return new PeriodData(
            Time.from_json_interface(data.start),
            Time.from_json_interface(data.end),
            data.other,
            data.name
        );;
    }

    clone(this: PeriodData): PeriodData {
        return new PeriodData(
            this.start.clone(),
            this.end.clone(),
            $state.snapshot(this.other),
            $state.snapshot(this.name)
        );
    }
}