<script lang="ts">
    import PeriodModal from "$lib/components/PeriodModal.svelte";
    import PeriodDataDisplay from "$lib/components/PeriodDataDisplay.svelte";
    import ExportDataModal from "$lib/components/ExportDataModal.svelte";
    import ImportDataModal from "$lib/components/ImportDataModal.svelte";
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import DebugMenu from "$lib/components/DebugMenu.svelte";
    import { Icon, ArrowDownTray, ArrowUpTray } from "svelte-hero-icons";

    import PeriodData from "$lib/period_data.svelte";
    import Time from "$lib/time_type.svelte";
    import globals from "$lib/globals.svelte";
    import CurrentPeriodDisplay from "$lib/components/CurrentPeriodDisplay.svelte";
    import { ls_available } from "$lib/localstorage_updater";



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
    let show_new_modal: boolean = $state(false);
    let new_period: PeriodData = $state(new PeriodData());

    // Initialize new period
    function create_new() {
        new_period = new PeriodData();
        show_new_modal = true;
    }

    // Add the new period to the periods global
    function add_new_period() {
        if (new_period.valid.overall) {
            globals.periods_push(new_period.clone());
        }
        show_new_modal = false;
    }



    // Handles edit data
    let show_edit_modal: boolean = $state(false);
    let edit_idx: number | null = $state(null);
    let edited_period: PeriodData = $state(new PeriodData());

    // Edit a period
    function start_edit(idx: number) {
        edited_period = globals.periods[idx].clone();
        edited_period.edit_idx = idx;
        edit_idx = idx;

        show_edit_modal = true;
    }

    function delete_period() {
        if (edit_idx == null) { return; }

        show_edit_modal = false;
        globals.periods_delete(edit_idx);
    }

    function apply_edit() {
        if (edit_idx == null) { return; }

        edited_period.edit_idx = null;
        globals.periods_update(edit_idx, edited_period);

        show_edit_modal = false;
    }



    // Handles export/import modals
    let show_export_modal: boolean = $state(false);
    let show_import_modal: boolean = $state(false);
</script>

<h1>Bell Timer</h1>
<a class="m-3 w-48 flex flex-col gap-1.5 items-center justify-center transition duration-500 hover:scale-125" href="https://github.com/KyteKode">
    <img class="rounded-2xl" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
    Created by KyteKode
</a>

<DebugMenu />

<CurrentPeriodDisplay now={now} />

<hr class="my-10 w-5/6 border-white/20 border rounded">

{#if !ls_available}
    <div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
        <span class="text-2xl font-black">Warning: LocalStorage is not available.</span>
        <span>
            <span class="font-bold">What does this mean?:</span>
            LocalStorage is what lets this website save things across sessions. Without it, none of your class data will save.
        </span>
    </div>
{/if}

<div class="relative bg-slate-800 border-2 border-slate-900 p-6 rounded-2xl">
    <button onclick={create_new} class="bg-slate-100 border-2 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">+</button>

    {#if Object.entries(globals.periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {#each globals.periods as data, idx (idx)}
            <PeriodDataDisplay data={data} edit={() => start_edit(idx)} />
        {/each}
    </div>
</div>



{#if ls_available}
    <div class="flex justify-center items-center">
        <div class="flex justify-center items-center m-5">
            <button onclick={() => show_export_modal = true} class="text-black bg-slate-100 border-2 border-slate-400 rounded-2xl p-2 flex justify-center items-center transition hover:scale-120">
                <span class="w-40">Export Data</span>
                <Icon src={ArrowDownTray} class="size-8 aspect-square" />
            </button>
        </div>

        <div class="flex justify-center items-center m-5">
            <button onclick={() => show_import_modal = true} class="text-black bg-slate-100 border-2 border-slate-400 rounded-2xl p-2 flex justify-center items-center transition hover:scale-120">
                <span class="w-40">Import Data</span>
                <Icon src={ArrowUpTray} class="size-8 aspect-square" />
            </button>
        </div>
    </div>
{/if}



<ModalBlur show={show_new_modal}>
    <PeriodModal bind:data={new_period} hide={() => show_new_modal = false} submit_info={add_new_period} />
</ModalBlur>

<ModalBlur show={show_edit_modal}>
    <PeriodModal bind:data={edited_period} hide={() => show_edit_modal = false} submit_info={apply_edit}>
        <button onclick={delete_period} class="w-3/4 bg-red-500 border-2 border-red-800 text-2xl rounded-2xl flex justify-center items-center transition hover:scale-120 hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]">Delete</button>
    </PeriodModal>
</ModalBlur>

<ModalBlur show={show_export_modal}>
    <ExportDataModal hide={() => show_export_modal = false} />
</ModalBlur>

<ModalBlur show={show_import_modal}>
    <ImportDataModal hide={() => show_import_modal = false} />
</ModalBlur>