import PeriodData from "$lib/period_data.svelte";

const _periods: PeriodData[] = $state([]);

const globals = {
    get periods() { return _periods; },
    periods_push(data: PeriodData) {
        _periods.push(data);
        _periods.sort((a, b) => a.start.to_minutes() - b.start.to_minutes());
    },
    periods_delete(idx: number) {
        _periods.splice(idx, 1);
    }
}
export default globals;