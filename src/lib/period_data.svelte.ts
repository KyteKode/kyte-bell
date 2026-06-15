import Time from "$lib/time_type.svelte";

export default class PeriodData {
    start: Time = $state(new Time());
    end: Time = $state(new Time());
    other: Record<string, string> = $state({});

    valid: boolean = $derived(
        (() => {
            if (!this.start.valid) return false;
            if (!this.end.valid) return false;
            if (!this.end.is_after(this.start)) return false;
            return true;
        })()
    )

    constructor(start: Time, end: Time, other: Record<string, string>) {
        this.start = start;
        this.end = end;
        this.other = other;
    }

    clone(this: PeriodData): PeriodData {
        return new PeriodData(
            this.start.clone(),
            this.end.clone(),
            $state.snapshot(this.other)
        )
    }
}