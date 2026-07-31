import PeriodData from "$lib/period_data.svelte";

export type PresetCriterion =
    { kind: "dayOfWeek", day: number } |
    { kind: "month", month: number } |
    { kind: "date", day: number, month: number };

export default class Preset {
    name: string;
    periods: PeriodData[];
    criteria: PresetCriterion[];

    constructor(name: string = "Classes", periods: PeriodData[] = [], criteria: PresetCriterion[] = []) {
        this.name = $state(name);
        this.periods = $state(periods);
        this.criteria = $state(criteria);
    }

    criteria_met(this: Preset): boolean {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const today = new Date();
        for (const criterion of this.criteria) {
            switch (criterion.kind) {
                case "dayOfWeek":
                    if (today.getDay() == criterion.day) { return true; }
                    break;
                case "month":
                    if (today.getMonth() == criterion.month) { return true; }
                    break;
                case "date":
                    if (today.getMonth() == criterion.month && today.getDate() == criterion.day) { return true; }
            }
        }
        return false;
    }

    clone(this: Preset): Preset {
        return new Preset(
            $state.snapshot(this.name),
            this.periods.map(p => p.clone()),
            $state.snapshot(this.criteria)
        );
    }
}
