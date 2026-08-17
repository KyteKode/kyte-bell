import PeriodData from "$lib/period.svelte";
import { getPresets, getDefaultPreset, updateLS } from "$lib/lsUpdater";
import Preset from "$lib/preset.svelte";

import { browser } from "$app/environment";



let _presets: Preset[] = $state([
    new Preset("Classes", [], [])
]);

let _manualPreset: number | null = $state(null);
let _defaultPreset: number = 0;

const _currentPreset = $derived.by(() => {
    if (_manualPreset != null) { return _manualPreset; }

    return _defaultPreset;
});

if (browser) {
    queueMicrotask(() => {
        _presets = getPresets();
        _defaultPreset = getDefaultPreset();
    })
}

const _periods: PeriodData[] = $derived(_presets[_currentPreset]?.periods ?? []);

const _commonOther: Record<string, number> = $derived.by(() => {
    const updated: Record<string, number> = {};

    for (const period of _periods) {
        for (const key in period.other) {
            if (!updated[key]) {
                updated[key] = 0;
            }

            updated[key] += 1;
        }
    }

    return Object.fromEntries(
        Object.entries(updated)
            .filter(([, freq]) => freq >= 3)
    );
});

let _devCurrentPeriods: number | null = $state(null);

const globals = {
    get periods() { return _periods; },
    periodsPush(data: PeriodData) {
        _periods.push(data);
        sortPeriods();
        updateLS();
    },
    periodsDelete(idx: number) {
        _periods.splice(idx, 1);
        updateLS();
    },
    periodsUpdate(idx: number, data: PeriodData) {
        _periods[idx] = data;
        sortPeriods();
        updateLS();
    },

    get common_other() { return _commonOther; },

    get presets() { return _presets },
    presetsPush(data: Preset) {
        _presets.push(data);
        updateLS();
    },
    presetsDelete(idx: number) {
        _presets.splice(idx, 1);
        updateLS();
    },
    presetsUpdate(idx: number, data: Preset) {
        _presets[idx] = data;
        updateLS();
    },

    get currentPreset() { return _currentPreset; },
    set currentPreset(v: number) { _manualPreset = v },

    set defaultPreset(v: number) {
        _defaultPreset = v;
        updateLS();
    },
    get defaultPreset() { return _defaultPreset; },



    get devCurrentPeriod() { return _devCurrentPeriods; },
    set devCurrentPeriod(v: number | null) { _devCurrentPeriods = v; }
}

function sortPeriods() {
    _periods.sort((a, b) => a.start.toMinutes() - b.start.toMinutes());
}

export default globals;
