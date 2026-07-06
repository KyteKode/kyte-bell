import Time from "$lib/time_type.svelte";
import globals from "$lib/globals.svelte";

export enum CurrentPeriodResult {
    Some,
    Free,
    BeforeStart,
    Between,
    InternalError
}

export type CurrentPeriod =
    { kind: CurrentPeriodResult.Some; current_idx: number } |
    { kind: CurrentPeriodResult.Free } |
    { kind: CurrentPeriodResult.BeforeStart } |
    { kind: CurrentPeriodResult.Between; next_idx: number } |
    { kind: CurrentPeriodResult.InternalError }

export function get_current_period(now: Time): CurrentPeriod {
    // Checks if a current period was manually set in the dev menu
    if (globals.dev_current_period != null) {
        return {
            kind: CurrentPeriodResult.Some,
            current_idx: globals.dev_current_period
        }
    }

    // Checks if you're before the first period
    if (globals.periods[0]) {
        if (globals.periods[0].start.after(now)) {
            return { kind: CurrentPeriodResult.BeforeStart }; // Before the first period
        }
    }

    for (const [idx, period] of globals.periods.entries()) {
        if (now.between(period.start, period.end)) {
            // In a period
            return {
                kind: CurrentPeriodResult.Some,
                current_idx: idx
            };
        }

        // Checks if you're between periods
        const next = globals.periods[idx + 1];
        if (next) {
            if (now.between(period.end, next.start)) {
                // Between two periods
                return {
                    kind: CurrentPeriodResult.Between,
                    next_idx: idx + 1
                };
            }
        }
    }

    return { kind: CurrentPeriodResult.Free };
}