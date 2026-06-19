import Time from "$lib/time_type.svelte";
import PeriodValidData from "$lib/period_valid_data.svelte"
import globals from "$lib/globals.svelte";

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

    valid: PeriodValidData = $derived(
        (() => {
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
        })()
    )

    constructor() {
        const latest = latest_end() ?? new Time();
        this.start = latest.clone();

        this.end = new Time()
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
        this.end.minute = new_min.toString();
        this.end.hour = new_hour.toString();
        this.end.ampm = new_ampm;
    }

    clone(this: PeriodData): PeriodData {
        const cloned = new PeriodData();
        cloned.start = this.start.clone();
        cloned.end = this.end.clone();
        cloned.other = $state.snapshot(this.other);
        cloned.name = $state.snapshot(this.name);
        return cloned;
    }
}