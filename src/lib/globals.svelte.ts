import PeriodData from "$lib/period_data.svelte";
import Time from "$lib/time_type.svelte";

const _periods: PeriodData[] = $state([]);

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
    },
    periods_delete(idx: number) {
        _periods.splice(idx, 1);
    },

    get now() { return _now; }
}
export default globals;