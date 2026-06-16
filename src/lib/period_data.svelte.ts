import Time from "$lib/time_type.svelte";
import PeriodValidData from "$lib/period_valid_data.svelte"
import globals from "$lib/globals.svelte";

export default class PeriodData {
    start: Time = $state(new Time());
    end: Time = $state(new Time());
    other: Record<string, string> = $state({});

    valid: PeriodValidData = $derived(
        (() => {
            const valid_data: PeriodValidData = new PeriodValidData();

            // Checks if the start and end is valid
            valid_data.start_valid = this.start.valid;
            valid_data.end_valid = this.end.valid;

            // Checks if the start is before the end
            valid_data.end_after_start = this.end.after(this.start);

            // Checks if period overlaps with any other periods in any way
            const entries = Object.entries(globals.periods) as [string, PeriodData][];
            valid_data.no_time_overlap = true;
            valid_data.no_name_overlap = true;

            for (const [, data] of entries) {
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

    clone(this: PeriodData): PeriodData {
        const cloned = new PeriodData();
        cloned.start = this.start.clone();
        cloned.end = this.end.clone();
        cloned.other = $state.snapshot(this.other);
        return cloned;
    }
}