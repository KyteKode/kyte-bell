export enum CurrentPeriodResult {
    Some,
    Free,
    BeforeStart,
    Between,
    InternalError
}

export type CurrentPeriod =
    { kind: CurrentPeriodResult.Some; current_idx: number } |
    { kind: CurrentPeriodResult.Free } |
    { kind: CurrentPeriodResult.BeforeStart } |
    { kind: CurrentPeriodResult.Between; next_idx: number } |
    { kind: CurrentPeriodResult.InternalError }