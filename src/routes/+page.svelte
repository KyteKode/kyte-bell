<script lang="ts">
    import PeriodModal from "$lib/components/PeriodModal.svelte";
    import PeriodDataDisplay from "$lib/components/PeriodDataDisplay.svelte";

    import PeriodData from "$lib/period_data.svelte";
    import globals from "$lib/globals.svelte";
    import CurrentPeriodDisplay from "$lib/components/CurrentPeriodDisplay.svelte";



    // Handle new period data
    let show_new_modal: boolean = $state(false);
    let new_period: PeriodData = $state(new PeriodData())

    // Add the new period to the periods global
    function add_new_period() {
        if (new_period.valid.overall) {
            globals.periods_push(new_period.clone());
            new_period = new PeriodData();
        }
        show_new_modal = false;
    }
</script>

<h1>Bell Timer</h1>
<a class="m-3 w-48 flex flex-col gap-1.5 items-center justify-center transition duration-500 hover:scale-125" href="https://github.com/KyteKode">
    <img class="rounded-2xl" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
    Created by KyteKode
</a>

<CurrentPeriodDisplay />

<hr class="my-10 w-5/6 border-white/20 border rounded">

<div class="relative bg-slate-800 border-3 border-slate-900 p-9 rounded-2xl">
    <button onclick={() => {show_new_modal = true}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">+</button>

    {#if Object.entries(globals.periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-3 gap-5">
        {#each globals.periods as data, idx (idx)}
            <PeriodDataDisplay data={data} idx={idx} />
        {/each}
    </div>
</div>

{#if show_new_modal}
    <div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm min-w-screen min-h-screen">
        <PeriodModal bind:show={show_new_modal} bind:data={new_period} submit_info={add_new_period} />
    </div>
{/if}