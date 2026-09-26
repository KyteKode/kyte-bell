<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import PeriodList from "$lib/components/PeriodList.svelte";

    import ExportDataModal from "$lib/components/ExportDataModal.svelte";
    import ImportDataModal from "$lib/components/ImportDataModal.svelte";

    import NewPresetModal from "$lib/components/NewPresetModal.svelte";
    import EditPresetModal from "$lib/components/EditPresetModal.svelte";

    import NewPeriodModal from "$lib/components/NewPeriodModal.svelte";
    import EditPeriodModal from "$lib/components/EditPeriodModal.svelte";
    import { ArrowDownTray, ArrowUpTray, Pencil, Plus } from "svelte-hero-icons";

    import globals from "$lib/globals.svelte";
    import { lsAvailable } from "$lib/lsUpdater";



    // Binds to the modals
    let newPeriod: NewPeriodModal;
    let editPeriod: EditPeriodModal;
    let exportData: ExportDataModal;
    let importData: ImportDataModal;
    let newPreset: NewPresetModal;
    let editPreset: EditPresetModal;

</script>

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
        <select bind:value={globals.currentPreset} class="h-12 rounded-2xl text-slate-900 justify-center border-2 border-slate-400">
            {#each globals.presets as data, idx (idx)}
                <option value={idx} >{data.name}</option>
            {/each}
        </select>
    </span>

    <span class="flex flex-row items-center justify-end gap-3">
        <Button onclick={() => editPreset.edit()} icon={Pencil} />
        <Button onclick={() => newPreset.create()} icon={Plus} />
    </span>
</div>

<PeriodList createNewPeriod={() => newPeriod.create()} startEdit={(idx: number) => editPeriod.edit(idx)} />

{#if lsAvailable}
    <div class="flex justify-center items-center gap-10">
        <Button onclick={() => exportData.showExports()} icon={ArrowDownTray}>Export Data</Button>
        <Button onclick={() => importData.showImports()} icon={ArrowUpTray}>Import Data</Button>
    </div>
{/if}

<NewPeriodModal bind:this={newPeriod} />
<EditPeriodModal bind:this={editPeriod} />
<ExportDataModal bind:this={exportData} />
<ImportDataModal bind:this={importData} />
<NewPresetModal bind:this={newPreset} />
<EditPresetModal bind:this={editPreset} />