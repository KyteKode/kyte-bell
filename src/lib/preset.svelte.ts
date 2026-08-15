import PeriodData from "$lib/period.svelte";
import globals from "$lib/globals.svelte";

export type PresetCriterion =
    { kind: "dayOfWeek", day: number } |
    { kind: "month", month: number } |
    { kind: "date", day: number, month: number };

export class PresetValidData {
    noNameOverlap: boolean = $state(false);

    overall: boolean = $derived(
        this.noNameOverlap
    );
}

export default class Preset {
    name: string;
    periods: PeriodData[];
    criteria: PresetCriterion[];

    editIdx: number | null = $state(null);

    valid: PresetValidData = $derived(this.isValid());

    constructor(name: string = "Classes", periods: PeriodData[] = [], criteria: PresetCriterion[] = []) {
        this.name = $state(name);
        this.periods = $state(periods);
        this.criteria = $state(criteria);
    }

    isValid(): PresetValidData {
        const validData = new PresetValidData();

        validData.noNameOverlap = true;
        for (const [idx, preset] of globals.presets.entries()) {
            if (preset.name == this.name && idx != this.editIdx) {
                validData.noNameOverlap = false;
            }
        }

        return validData;
    }

    criteriaMet(this: Preset): boolean {
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
