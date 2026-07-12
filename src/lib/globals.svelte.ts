import PeriodData from "$lib/period_data.svelte";
import { get_stored_periods, update_stored_periods } from "$lib/localstorage_updater";

import { browser } from "$app/environment";

const _periods: PeriodData[] = $state(
    browser ?
        get_stored_periods() ?? [] :
        []
);

const _common_other: Record<string, number> = $derived.by(() => {
    const updated: Record<string, number> = {};

    for (const period of _periods) {
        for (const key in period.other) {
            if (!updated[key]) {
                updated[key] = 0;
            }

            updated[key] += 1;
        }
    }

    return Object.fromEntries(
        Object.entries(updated)
            .filter( ([, freq]) => freq >= 3 )
    );
});

let _dev_current_period: number | null = null;

const globals = {
    get periods() { return _periods; },
    periods_push(data: PeriodData) {
        _periods.push(data);
        sort_periods();
        update_stored_periods();
    },
    periods_delete(idx: number) {
        _periods.splice(idx, 1);
        update_stored_periods();
    },
    periods_update(idx: number, data: PeriodData) {
        _periods[idx] = data;
        sort_periods();
        update_stored_periods();
    },

    get common_other() { return _common_other; },



    get dev_current_period() { return _dev_current_period; },
    set dev_current_period(v: number | null) { _dev_current_period = v; }
}

function sort_periods() {
    _periods.sort((a, b) => a.start.to_minutes() - b.start.to_minutes());
}

export default globals;