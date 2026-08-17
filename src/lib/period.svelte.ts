import Time from "$lib/time.svelte";
import globals from "$lib/globals.svelte";
import type { ZPeriod } from "$lib/storageSchemas";

export class PeriodValidData {
    startValid: boolean = $state(false);
    endValid: boolean = $state(false);
    endAfterStart: boolean = $state(false);
    noTimeOverlap: boolean = $state(false);

    overlapName: string = $state("");

    overall: boolean = $derived(
        this.startValid &&
        this.endValid &&
        this.endAfterStart &&
        this.noTimeOverlap
    );
}

function latestEnd() {
    let latest: Time | null = null;
    for (const period of globals.periods) {
        if (latest == null || period.end.after(latest)) {
            latest = period.end;
        }
    }

    if (latest == null) { return new Time(); }
    return latest.clone();
}

export default class PeriodData {
    start: Time = $state(new Time());
    end: Time = $state(new Time());
    other: Record<string, string> = $state({});
    name: string = $state("Class");

    editIdx: number | null = $state(null);

    valid: PeriodValidData = $derived(this.isValid());

    constructor(start?: Time, end?: Time, other?: Record<string, string>, name?: string) {
        if (start) {
            this.start = start;
        } else {
            const latest = latestEnd() ?? new Time();
            this.start = latest.clone();
        }

        if (end) {
            this.end = end;
        } else {
            const latest = latestEnd() ?? new Time();

            let newMin = Number(latest.minute) + 40;
            let newHour = Number(latest.hour);
            let newAMPM = latest.ampm;
            if (newMin > 59) {
                newMin %= 60;
                newHour++;
                if (newHour == 12) {
                    newAMPM = 1 - newAMPM;
                }
                if (newHour == 13) {
                    newHour = 1;
                }
            }

            this.end = new Time(newHour, newMin, newAMPM);
        }

        this.other = other ?? {};
        this.name = name ?? "Class";
    }

    private isValid(this: PeriodData): PeriodValidData {
        const validData: PeriodValidData = new PeriodValidData();

        // Checks if the start and end is valid
        validData.startValid = this.start.valid;
        validData.endValid = this.end.valid;

        // Checks if the start is before the end
        validData.endAfterStart = this.end.after(this.start);

        // Checks if period overlaps with any other periods in any way
        validData.noTimeOverlap = true;

        for (const [idx, data] of globals.periods.entries()) {
            if (idx === this.editIdx) continue;

            // Checks if time overlaps
            const thisStart = this.start.toMinutes();
            const thisEnd = this.end.toMinutes();
            const otherStart = data.start.toMinutes();
            const otherEnd = data.end.toMinutes();

            if (thisStart < otherEnd && otherStart < thisEnd) {
                validData.noTimeOverlap = false;
                validData.overlapName = data.name;
            }
        }
        return validData;
    }

    toZod(this: PeriodData): ZPeriod {
        return {
            start: this.start.toZod(),
            end: this.end.toZod(),
            other: this.other,
            name: this.name
        }
    }

    static fromZod(data: ZPeriod) {
        return new PeriodData(
            Time.fromZod(data.start),
            Time.fromZod(data.end),
            data.other,
            data.name
        );
    }

    clone(this: PeriodData): PeriodData {
        return new PeriodData(
            this.start.clone(),
            this.end.clone(),
            $state.snapshot(this.other),
            $state.snapshot(this.name)
        );
    }
}
