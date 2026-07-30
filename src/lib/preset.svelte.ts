import PeriodData from "$lib/period_data.svelte";

export enum PresetCriterionKind {
    DayOfWeek,
    Month,
    Date
}

export type PresetCriterion =
    { kind: PresetCriterionKind.DayOfWeek, day: number } |
    { kind: PresetCriterionKind.Month, month: number } |
    { kind: PresetCriterionKind.Date, day: number, month: number };

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
        const today = new Date();
        for (const criterion of this.criteria) {
            switch (criterion.kind) {
                case PresetCriterionKind.DayOfWeek:
                    if (today.getDay() == criterion.day) { return true; }
                    break;
                case PresetCriterionKind.Month:
                    if (today.getMonth() == criterion.month) { return true; }
                    break;
                case PresetCriterionKind.Date:
                    if (today.getMonth() == criterion.month && today.getDate() == criterion.day) { return true; }
            }
        }
        return false;
    }
}
