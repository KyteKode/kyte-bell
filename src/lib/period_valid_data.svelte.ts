export default class PeriodValidData {
    start_valid: boolean = $state(false);
    end_valid: boolean = $state(false);
    end_after_start: boolean = $state(false);
    no_time_overlap: boolean = $state(false);
    no_name_overlap: boolean = $state(false); // reserved for later

    overlap_name: string = $state("")

    overall: boolean = $derived(
        this.start_valid &&
        this.end_valid &&
        this.end_after_start &&
        this.no_time_overlap &&
        this.no_name_overlap
    );
}