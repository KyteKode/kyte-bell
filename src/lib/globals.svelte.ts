import PeriodData from "$lib/period_data.svelte";
import { getStoredPeriods, updateStoredPeriods } from "$lib/localstorage_updater";

import { browser } from "$app/environment";

const _periods: PeriodData[] = $state(
    browser ?
        getStoredPeriods() ?? [] :
        []
);

const _commonOther: Record<string, number> = $derived.by(() => {
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

let _devCurrentPeriods: number | null = null;

const globals = {
    get periods() { return _periods; },
    periodsPush(data: PeriodData) {
        _periods.push(data);
        sortPeriods();
        updateStoredPeriods();
    },
    periodsDelete(idx: number) {
        _periods.splice(idx, 1);
        updateStoredPeriods();
    },
    periodsUpdate(idx: number, data: PeriodData) {
        _periods[idx] = data;
        sortPeriods();
        updateStoredPeriods();
    },

    get common_other() { return _commonOther; },



    get dev_current_period() { return _devCurrentPeriods; },
    set devCurrentPeriod(v: number | null) { _devCurrentPeriods = v; }
}

function sortPeriods() {
    _periods.sort((a, b) => a.start.toMinutes() - b.start.toMinutes());
}

export default globals;