import PeriodData from "$lib/period_data.svelte";
import Time from "$lib/time_type.svelte";
import { get_stored_periods, update_stored_periods } from "$lib/localstorage_updater";

import { browser } from "$app/environment";

let _periods: PeriodData[] = $state([]);

if (browser) {
    _periods = get_stored_periods() ?? [];
}

// Used as a depndency for the `now` variable
let tick = $state(0);
setInterval(() => {tick++}, 100);

// Derived so it updates every second
const _now: Time = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    tick;
    return Time.now();
});

const globals = {
    get periods() { return _periods; },
    periods_push(data: PeriodData) {
        _periods.push(data);
        _periods.sort((a, b) => a.start.to_minutes() - b.start.to_minutes());
        update_stored_periods();
    },
    periods_delete(idx: number) {
        _periods.splice(idx, 1);
        update_stored_periods();
    },

    get now() { return _now; }
}
export default globals;