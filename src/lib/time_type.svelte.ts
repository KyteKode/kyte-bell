import type { JSONTime } from "$lib/storage_schemas";

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

    constructor(hour?: string | number, minute?: string | number, ampm?: AMPM) {
        if (hour) {
            if (typeof hour == "string") {
                this.hour = hour;
            } else {
                this.hour = hour.toString();
            }
        } else {
            this.hour = "8";
        }

        if (minute) {
            if (typeof minute == "string") {
                this.minute = minute;
            } else {
                this.minute = minute.toString().padStart(2, '0');
            }
        } else {
            this.minute = "00";
        }

        this.ampm = ampm ?? AMPM.AM;
    }

    private second: number = $state(0); // used only for time_until and time_since

    to_json_interface(this: Time): JSONTime {
        return {
            hour: this.hour,
            minute: this.minute,
            ampm: this.ampm
        }
    }

    static from_json_interface(data: JSONTime) {
        const inst = new Time(data.hour, data.minute, data.ampm);
        return inst;
    }

    static now() {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const date = new Date();

        let hour = date.getHours();
        const ampm = hour >= 12 ? AMPM.PM : AMPM.AM;

        hour = hour % 12;
        if (hour == 0) { hour = 12; }

        const minute = date.getMinutes()

        const time = new Time(hour, minute, ampm);
        time.second = date.getSeconds();

        return time;
    }

    // Changes the time to minutes for comparisons
    // e.g. 1:00 AM becomes 90, 12:00 PM becomes 720
    to_minutes(this: Time) {
        const hours = Number(this.hour) % 12 + Number(this.ampm == AMPM.PM) * 12;
        return hours * 60 + Number(this.minute);
    }

    // Changes the time to seconds for internal use in time_after and time_since
    private to_seconds(this: Time) {
        const minutes = this.to_minutes();
        return minutes * 60 + this.second;
    }

    // Checks if this time is after another time.
    after(this: Time, other: Time): boolean {
        if (!this.valid || !other.valid) return false;

        const this_mins = this.to_minutes();
        const other_mins = other.to_minutes();

        return this_mins > other_mins;
    }

    // after(), but inclusive
    after_inclusive(this: Time, other: Time): boolean {
        if (!this.valid || !other.valid) return false;

        const this_mins = this.to_minutes();
        const other_mins = other.to_minutes();

        return this_mins >= other_mins;
    }

    // Checks if the time is between two times
    between(this: Time, start: Time, end: Time): boolean {
        if (!this.valid || !start.valid || !end.valid) return false;

        return this.after_inclusive(start) && end.after(this);
    }

    // Evaluates the time since a different time in seconds
    private seconds_time_since(this: Time, other: Time): number {
        return this.to_seconds() - other.to_seconds();
    }

    // Formats a duration in seconds as a string
    private static format_seconds(seconds: number): string {
        const format_unit = (amount: number, unit: string) => {
            let display = amount.toString();
            if (amount == 0) {
                display = '';
            } else {
                display += ` ${unit}`;
                if (amount > 1) {
                    display += 's'
                }
            }
            return display;
        }

        let remaining = seconds;

        const h = Math.floor(remaining / 3600);
        const h_display = format_unit(h, "hour");
        remaining %= 3600;

        const m = Math.floor(remaining / 60);
        const m_display = format_unit(m, "minute");
        remaining %= 60;

        const s = remaining;
        const s_display = format_unit(s, "second");

        return `${h_display} ${m_display} ${s_display}`.trimEnd() + ' ';
    }

    // Evaluates the time until a different time
    time_since(this: Time, other: Time): string {
        const since_seconds = this.seconds_time_since(other);
        return Time.format_seconds(since_seconds);
    }


    // Evaluates the time until a different time
    time_until(this: Time, other: Time): string {
        const until_seconds = -this.seconds_time_since(other);
        return Time.format_seconds(until_seconds);
    }


    // Formats the time as a string.
    to_string(this: Time): string {
        const h = Number(this.hour).toString();
        const m = Number(this.minute).toString().padStart(2, '0');
        return `${h}:${m} ${this.ampm == AMPM.AM ? "AM" : "PM"}`;
    }

    clone(this: Time): Time {
        return new Time(
            $state.snapshot(this.hour),
            $state.snapshot(this.minute),
            $state.snapshot(this.ampm)
        );
    }
}

export enum AMPM {
    AM,
    PM
}