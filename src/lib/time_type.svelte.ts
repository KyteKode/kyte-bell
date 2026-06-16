export default class Time {
    valid: boolean = $derived(
        (() => {
            const valid_int = (str: string) => {
                return /^\d+$/.test(str);
            }

            const num_between = (min: number, n: number, max: number) => {
                return n >= min && n <= max;
            }

            // Hour is a valid integer between 1 and 12?
            if (!valid_int(this.hour)) return false;
            if (!num_between(1, Number(this.hour), 12)) return false;

            // Minute is a valid integer between 0 and 59?
            if (!valid_int(this.minute)) return false;
            return num_between(0, Number(this.minute), 59);
        })()
    );

    hour: string = $state("8");
    minute: string = $state("00");
    ampm: AMPM = $state(AMPM.AM);

    // Changes the time to minutes for comparisons
    // e.g. 1:00 AM becomes 90, 12:00 PM becomes 720
    to_minutes(this: Time) {
        const hours = Number(this.hour) % 12 + Number(this.ampm == AMPM.PM) * 12;
        return hours * 60 + Number(this.minute);
    }

    // Checks if this time is after another time.
    after(this: Time, other: Time): boolean {
        if (!this.valid || !other.valid) return false;

        const this_mins = this.to_minutes();
        const other_mins = other.to_minutes();

        return this_mins > other_mins;
    }

    // Formats the time as a string.
    to_string(this: Time): string {
        const h = String(Number(this.hour));
        const m = this.minute.replace(/^0+(?=\d{2})/, "");
        return `${h}:${m} ${this.ampm == AMPM.AM ? "AM" : "PM"}`;
    }
    
    clone(this: Time): Time {
        const cloned = new Time();
        cloned.hour = $state.snapshot(this.hour);
        cloned.minute = $state.snapshot(this.minute);
        cloned.ampm = $state.snapshot(this.ampm);
        return cloned;
    }
}

export enum AMPM {
    AM,
    PM
}