export default class Time {
    hour: string = $state("8");
    minute: string = $state("00");
    ampm: AMPM = $state(AMPM.AM);

    valid: boolean = $derived(
        (() => {
            const valid_int = (str: string) => {
                return /^\d+$/.test(str);
            }

            const num_between = (min: number, n: number, max: number) => {
                return n >= min && n <= max;
            }

            if (!valid_int(this.hour)) return false;
            if (!num_between(1, Number(this.hour), 12)) return false;

            if (!valid_int(this.minute)) return false;

            return num_between(0, Number(this.minute), 59);
        })()
    )

    constructor(hour: string = "8", minute: string = "00", ampm: AMPM = AMPM.AM) {
        this.hour = hour;
        this.minute = minute;
        this.ampm = ampm;
    }

    is_after(this: Time, other: Time): boolean {
        if (!this.valid || !other.valid) return false;

        const this_h = Number(this.hour);
        const this_m = Number(this.minute);

        const other_h = Number(other.hour);
        const other_m = Number(other.minute);

        if (this.ampm < other.ampm) return false;
        if (this.ampm > other.ampm) return true;

        if (this_h < other_h) return false;
        if (this_h > other_h) return true;

        return this_m > other_m;
    }

    to_string(this: Time): string {
        const h = String(Number(this.hour));
        const m = this.minute.replace(/^0+(?=\d{2})/, "");
        return `${h}:${m} ${this.ampm == AMPM.AM ? "AM" : "PM"}`;
    }
}

export enum AMPM {
    AM,
    PM
}