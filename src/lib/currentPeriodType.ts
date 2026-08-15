import Time from "$lib/time.svelte";
import globals from "$lib/globals.svelte";

export enum CurrentPeriodResult {
    Some,
    Free,
    BeforeStart,
    Between,
    InternalError
}

export type CurrentPeriod =
    { kind: CurrentPeriodResult.Some; currentIdx: number } |
    { kind: CurrentPeriodResult.Free } |
    { kind: CurrentPeriodResult.BeforeStart } |
    { kind: CurrentPeriodResult.Between; nextIdx: number } |
    { kind: CurrentPeriodResult.InternalError }

export function getCurrentPeriod(now: Time): CurrentPeriod {
    // Checks if a current period was manually set in the dev menu
    if (globals.devCurrentPeriod != null) {
        return {
            kind: CurrentPeriodResult.Some,
            currentIdx: globals.devCurrentPeriod
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
                currentIdx: idx
            };
        }

        // Checks if you're between periods
        const next = globals.periods[idx + 1];
        if (next) {
            if (now.between(period.end, next.start)) {
                // Between two periods
                return {
                    kind: CurrentPeriodResult.Between,
                    nextIdx: idx + 1
                };
            }
        }
    }

    return { kind: CurrentPeriodResult.Free };
}