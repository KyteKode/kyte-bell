import PeriodData from "$lib/period_data.svelte";

let _periods: Record<string, PeriodData> = $state({});
let _new_period_name: string = $state("Class");

const globals = {
    get periods() { return _periods; },
    set periods(v: Record<string, PeriodData>) { _periods = v; },

    get new_period_name() { return _new_period_name; },
    set new_period_name(v: string) { _new_period_name = v; }
}
export default globals;