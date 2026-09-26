import Time from "$lib/time.svelte.js";
import globals from "$lib/globals.svelte.js";

export type ShownPeriodInfo = {
    state: "inClass" | "between",
    previous: number | null,
    current: number,
    next: number | null
} | {
    state: "beforeClass" | "free"
};

function nullClamp(x: number) {
    if (x < 0 || x >= globals.periods.length) { return null; }
    return x;
}

function buildPeriodInfo(state: "inClass" | "between", idx: number): ShownPeriodInfo {
    return {
        state: state,
        previous: nullClamp(idx - 1),
        current: idx,
        next: nullClamp(idx + 1)
    }
}

export default function getShownPeriodInfo(now: Time): ShownPeriodInfo {
    // Checks if a current period was manually set in the dev menu
    if (globals.devCurrentPeriod != null) {
        return buildPeriodInfo("inClass", globals.devCurrentPeriod);
    }

    // Checks if you're before the first period
    if (globals.periods[0]) {
        if (globals.periods[0].start.after(now)) {
            // Before the first period
            return {
                state: "beforeClass"
            };
        }
    }

    for (const [idx, period] of globals.periods.entries()) {
        if (now.between(period.start, period.end)) {
            // In a period
            return buildPeriodInfo("inClass", idx);
        }

        // Checks if you're between periods
        const next = globals.periods[idx + 1];
        if (next) {
            if (now.between(period.end, next.start)) {
                // Between two periods
                return buildPeriodInfo("between", idx + 1);
            }
        }
    }

    return { state: "free" };
}