import type { ZTime } from "$lib/storageSchemas";

export default class Time {
    valid: boolean = $derived(
        (() => {
            const validInt = (str: string) => {
                return /^\d+$/.test(str);
            }

            const numBetween = (min: number, n: number, max: number) => {
                return n >= min && n <= max;
            }

            // Hour is a valid integer between 1 and 12?
            if (!validInt(this.hour)) return false;
            if (!numBetween(1, Number(this.hour), 12)) return false;

            // Minute is a valid integer between 0 and 59?
            if (!validInt(this.minute)) return false;
            return numBetween(0, Number(this.minute), 59);
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

    private second: number = $state(0); // used only for timeUntil and timeSince

    toZod(this: Time): ZTime {
        return {
            hour: this.hour,
            minute: this.minute,
            ampm: this.ampm
        }
    }

    static fromZod(data: ZTime) {
        return new Time(data.hour, data.minute, data.ampm);
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
    toMinutes(this: Time) {
        const hours = Number(this.hour) % 12 + Number(this.ampm == AMPM.PM) * 12;
        return hours * 60 + Number(this.minute);
    }

    // Changes the time to seconds for internal use in timeUntil and timeSince
    private toSeconds(this: Time) {
        const minutes = this.toMinutes();
        return minutes * 60 + this.second;
    }

    // Checks if this time is after another time.
    after(this: Time, other: Time): boolean {
        if (!this.valid || !other.valid) return false;

        const thisMins = this.toMinutes();
        const otherMins = other.toMinutes();

        return thisMins > otherMins;
    }

    // after(), but inclusive
    afterInclusive(this: Time, other: Time): boolean {
        if (!this.valid || !other.valid) return false;

        const thisMins = this.toMinutes();
        const otherMins = other.toMinutes();

        return thisMins >= otherMins;
    }

    // Checks if the time is between two times
    between(this: Time, start: Time, end: Time): boolean {
        if (!this.valid || !start.valid || !end.valid) return false;

        return this.afterInclusive(start) && end.after(this);
    }

    // Evaluates the time since a different time in seconds
    private timeSinceSeconds(this: Time, other: Time): number {
        return this.toSeconds() - other.toSeconds();
    }

    // Formats a duration in seconds as a string
    private static formatSeconds(seconds: number): string {
        const formatUnit = (amount: number, unit: string) => {
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
        const hDisplay = formatUnit(h, "hour");
        remaining %= 3600;

        const m = Math.floor(remaining / 60);
        const mDisplay = formatUnit(m, "minute");
        remaining %= 60;

        const s = remaining;
        const sDisplay = formatUnit(s, "second");

        return `${hDisplay} ${mDisplay} ${sDisplay}`.trimEnd() + ' ';
    }

    // Evaluates the time until a different time
    timeSince(this: Time, other: Time): string {
        const secondsSince = this.timeSinceSeconds(other);
        return Time.formatSeconds(secondsSince);
    }


    // Evaluates the time until a different time
    timeUntil(this: Time, other: Time): string {
        const secondsUntil = -this.timeSinceSeconds(other);
        return Time.formatSeconds(secondsUntil);
    }


    // Formats the time as a string.
    toString(this: Time): string {
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