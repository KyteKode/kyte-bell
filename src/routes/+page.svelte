<script lang="ts">
    import PeriodModal from "$lib/components/PeriodModal.svelte";
    import PeriodDataDisplay from "$lib/components/PeriodDataDisplay.svelte";
    import ExportDataModal from "$lib/components/ExportDataModal.svelte";
    import ImportDataModal from "$lib/components/ImportDataModal.svelte";
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import DebugMenu from "$lib/components/DebugMenu.svelte";
    import PresetModal from "$lib/components/PresetModal.svelte";
    import { Icon, ArrowDownTray, ArrowUpTray, PencilSquare } from "svelte-hero-icons";

    import PeriodData from "$lib/period_data.svelte";
    import Preset from "$lib/preset.svelte";
    import Time from "$lib/time_type.svelte";
    import globals from "$lib/globals.svelte";
    import CurrentPeriodDisplay from "$lib/components/CurrentPeriodDisplay.svelte";
    import { lsAvailable } from "$lib/localstorage_updater";



    // Used as a depndency for the `now` variable
    let tick = $state(0);
    setInterval(() => {tick++}, 100);

    // Derived so it updates every second
    const now: Time = $derived.by(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        tick;
        return Time.now();
    });



    // Handle new period data
    let showNewPeriodModal: boolean = $state(false);
    let newPeriod: PeriodData = $state(new PeriodData());

    // Initialize new period
    function createNewPeriod() {
        newPeriod = new PeriodData();
        showNewPeriodModal = true;
    }

    // Add the new period to the periods global
    function addNewPeriod() {
        if (newPeriod.valid.overall) {
            globals.periodsPush(newPeriod.clone());
        }
        showNewPeriodModal = false;
    }



    // Handles edit data
    let showEditModal: boolean = $state(false);
    let editIdx: number | null = $state(null);
    let editedPeriod: PeriodData = $state(new PeriodData());

    // Edit a period
    function startEdit(idx: number) {
        editedPeriod = globals.periods[idx].clone();
        editedPeriod.editIdx = idx;
        editIdx = idx;

        showEditModal = true;
    }

    function deletePeriod() {
        if (editIdx == null) { return; }

        showEditModal = false;
        globals.periodsDelete(editIdx);
    }

    function applyEdit() {
        if (editIdx == null) { return; }

        editedPeriod.editIdx = null;
        globals.periodsUpdate(editIdx, editedPeriod);

        showEditModal = false;
    }



    // Handles export/import modals
    let showExportModal: boolean = $state(false);
    let showImportModal: boolean = $state(false);


    // Handles new presets
    let showNewPresetModal = $state(false);
    let newPreset = $state(new Preset());
    let newPresetDefault = $state(false);

    function createNewPreset() {
        newPreset = new Preset();
        showNewPresetModal = true;
        newPresetDefault = false;
    }

    function addNewPreset() {
        globals.presetsPush(newPreset.clone());
        showNewPresetModal = false;
        globals.currentPreset = globals.presets.length - 1;

        if (newPresetDefault) { globals.defaultPreset = globals.currentPreset; }
    }
</script>

<h1>Bell Timer</h1>
<a class="m-3 w-48 flex flex-col gap-1.5 items-center justify-center transition duration-500 hover:scale-125" href="https://github.com/KyteKode">
    <img class="rounded-2xl" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
    Created by KyteKode
</a>

<DebugMenu />

<CurrentPeriodDisplay now={now} />

<hr class="my-8 w-5/6 border-white/20 border rounded">

{#if !lsAvailable}
    <div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
        <span class="text-2xl font-black">Warning: LocalStorage is not available.</span>
        <span>
            <span class="font-bold">What does this mean?:</span>
            LocalStorage is what lets this website save things across sessions. Without it, none of your class data will save.
        </span>
    </div>
{/if}


<div class="w-88 bg-slate-800 border-2 border-slate-900 p-4 rounded-2xl mb-8 flex flex-row items-center justify-between">
    <span class="flex flex-row items-center justify-start gap-3">
        <span class="text-xl">Preset:</span>
        <select bind:value={globals.currentPreset} class="h-12 rounded-2xl text-slate-900 justify-center border-3 border-slate-400">
            {#each globals.presets as data, idx (idx)}
                <option value={idx} >{data.name}</option>
            {/each}
        </select>
    </span>

    <span class="flex flex-row items-center justify-end gap-3">
        <button onclick={() => {}} class="p-2 bg-slate-100 border-2 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">
            <Icon src={PencilSquare} />
        </button>
        <button onclick={createNewPreset} class="bg-slate-100 border-2 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">+</button>
    </span>
</div>

<div class="relative bg-slate-800 border-2 border-slate-900 p-6 rounded-2xl flex flex-col items-center">
    <button onclick={createNewPeriod} class="bg-slate-100 border-2 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-5 -left-5">+</button>


    {#if Object.entries(globals.periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {#each globals.periods as data, idx (idx)}
            <PeriodDataDisplay data={data} edit={() => startEdit(idx)} />
        {/each}
    </div>
</div>



{#if lsAvailable}
    <div class="flex justify-center items-center">
        <div class="flex justify-center items-center m-5">
            <button onclick={() => showExportModal = true} class="text-black bg-slate-100 border-2 border-slate-400 rounded-2xl p-2 flex justify-center items-center transition hover:scale-120">
                <span class="w-40">Export Data</span>
                <Icon src={ArrowDownTray} class="size-8 aspect-square" />
            </button>
        </div>

        <div class="flex justify-center items-center m-5">
            <button onclick={() => showImportModal = true} class="text-black bg-slate-100 border-2 border-slate-400 rounded-2xl p-2 flex justify-center items-center transition hover:scale-120">
                <span class="w-40">Import Data</span>
                <Icon src={ArrowUpTray} class="size-8 aspect-square" />
            </button>
        </div>
    </div>
{/if}



<ModalBlur show={showNewPeriodModal}>
    <PeriodModal bind:data={newPeriod} hide={() => showNewPeriodModal = false} submitInfo={addNewPeriod} />
</ModalBlur>

<ModalBlur show={showEditModal}>
    <PeriodModal bind:data={editedPeriod} hide={() => showEditModal = false} submitInfo={applyEdit}>
        <button onclick={deletePeriod} class="w-3/4 bg-red-500 border-2 border-red-800 text-2xl rounded-2xl flex justify-center items-center transition hover:scale-120 hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]">Delete</button>
    </PeriodModal>
</ModalBlur>

<ModalBlur show={showExportModal}>
    <ExportDataModal hide={() => showExportModal = false} />
</ModalBlur>

<ModalBlur show={showImportModal}>
    <ImportDataModal hide={() => showImportModal = false} />
</ModalBlur>

<ModalBlur show={showNewPresetModal}>
    <PresetModal bind:data={newPreset} bind:isDefault={newPresetDefault} hide={() => showNewPresetModal = false} submitInfo={addNewPreset} />
</ModalBlur>
