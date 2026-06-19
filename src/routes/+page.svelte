<script lang="ts">
    import TimeInput from "$lib/components/TimeInput.svelte";
    import PeriodData from "$lib/period_data.svelte";
    import Time from "$lib/time_type.svelte"
    import {type CurrentPeriod, CurrentPeriodResult} from "$lib/current_period_type";
    import globals from "$lib/globals.svelte";

    let current: CurrentPeriod = $state({ kind: CurrentPeriodResult.InternalError });
    let tick = $state(0);

    setInterval(() => {tick++}, 100);

    let now: Time = $derived.by(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        tick;
        return Time.now();
    });

    function update_current() {
        const now = Time.now();

        // Checks if you're before the first period
        if (globals.periods[0] && globals.periods[0].start.after(now)) {
            current = { kind: CurrentPeriodResult.BeforeStart }; // Before the first period
            return;
        }

        for (const [idx, period] of globals.periods.entries()) {
            if (now.between(period.start, period.end)) {
                // In a period
                current = {
                    kind: CurrentPeriodResult.Some,
                    current_idx: idx
                };
                return;
            }

            // Checks if you're between periods
            const next = globals.periods[idx + 1];
            if (next) {
                if (now.between(period.end, next.start)) {
                    // Between two periods
                    current = {
                        kind: CurrentPeriodResult.Between,
                        next_idx: idx + 1
                    };
                    return;
                }
            }
        }

        current = { kind: CurrentPeriodResult.Free };
    }

    $effect(update_current);

    // Handle new period data
    let show_new_modal: boolean = $state(false);
    let new_period: PeriodData = $state(new PeriodData())
    let new_info_name: string = $state("");

    // Add extra user defined info
    function add_other_info() {
        if (!new_period.other[new_info_name] && new_info_name.trim() != "") {
            new_period.other[new_info_name] = "";
            new_info_name = "";
        }
    }

    // Remove extra user defined info
    function remove_other_info(key: string) {
        delete new_period.other[key];
    }

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

<div class="bg-slate-600 border-3 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
    {#if current.kind == CurrentPeriodResult.Some}
        {@const data = globals.periods[current.current_idx]}

        <span>Current class:</span>
        <span class="text-2xl font-black">{data.name}</span>

        <span>
            <span class="font-bold">Started:</span>
            {now.time_since(data.start)} ago
        </span>
        <span>
            <span class="font-bold">Ends in:</span>
            {now.time_until(data.end)}
        </span>

        {#each Object.entries(data.other) as [key, other_data] (key)}
            <span>
                <span class="font-bold">{key}:</span>
                {other_data}
            </span>
        {/each}

    {:else if current.kind == CurrentPeriodResult.Free}
        <span class="text-2xl font-bold">You're free! 🥳</span>

    {:else if current.kind == CurrentPeriodResult.Between}
        {@const data = globals.periods[current.next_idx]}
        <span>Next class:</span>
        <span class="text-2xl font-bold">{data.name}</span>

        <span>
            <span class="font-bold">Starts in:</span>
            {now.time_until(data.start)}
        </span>

        {#each Object.entries(data.other) as [key, other_data] (key)}
            <span>
                <span class="font-bold">{key}:</span>
                {other_data}
            </span>
        {/each}

    {:else if current.kind == CurrentPeriodResult.BeforeStart}
        <span class="text-2xl font-bold">Classes haven't started yet.</span>

        <span>
            <span class="font-bold">Classes start in:</span>
            {now.time_until(globals.periods[0].start)}
        </span>
    {:else}
        <span class="text-2xl font-black">Internal Error Occured</span>
    {/if}
</div>

<hr class="my-10 w-5/6 border-white/20 border rounded">

<div class="relative bg-slate-800 border-3 border-slate-900 p-9 rounded-2xl">
    <button onclick={() => {show_new_modal = true}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">+</button>

    {#if Object.entries(globals.periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-3 gap-5">
        {#each globals.periods as data, idx (idx)}
            <div class="relative bg-slate-600 border-3 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
                <button onclick={() => {globals.periods_delete(idx)}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

                <span class="text-2xl font-black">{data.name}</span>

                <span>
                    <span class="font-bold">Start:</span>
                    {data.start.to_string()}
                </span>

                <span>
                    <span class="font-bold">End:</span>
                    {data.end.to_string()}
                </span>

                {#each Object.entries(data.other) as [key, other_data] (key)}
                    <span>
                        <span class="font-bold">{key}:</span>
                        {other_data}
                    </span>
                {/each}
            </div>
        {/each}
    </div>
</div>

{#if show_new_modal}
    <div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm min-w-screen min-h-screen">
        <div class="relative flex flex-col gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-sm">
            <button onclick={() => {show_new_modal = false}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

            <div class="grid grid-cols-[1fr_2fr] items-center justify-center gap-2">
                <span class="w-15 text-xl">Name:</span>
                <input bind:value={new_period.name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">

                <span class="w-15 text-xl">Start:</span>
                <TimeInput bind:value={new_period.start} />

                <span class="w-15 text-xl">End:</span>
                <TimeInput bind:value={new_period.end} />

                {#each Object.entries(new_period.other) as [name] (name)}
                <span class="flex flex-row justify-start items-center">
                    <span class="w-15 text-xl">{name}:</span>
                    <button onclick={() => {remove_other_info(name)}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">-</button>
                </span>
                    <input bind:value={new_period.other[name]} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
                {/each}

                <span class="w-15 text-xl">Other:</span>
                <span class="w-56 gap-3 flex items-center justify-center">
                <input bind:value={new_info_name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
                <button onclick={add_other_info} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">+</button>
            </span>
            </div>

            <div class="flex flex-col justify-center items-center gap-2">
                {#if !new_period.valid.overall}
                    <h1>Invalid!</h1>

                    <ul class="list-disc pl-5 space-y-2">
                        {#if !new_period.valid.start_valid}
                            <li>{new_period.start.to_string()} is not a valid start time.</li>
                        {/if}

                        {#if !new_period.valid.end_valid}
                            <li>{new_period.end.to_string()} is not a valid end time.</li>
                        {/if}

                        {#if !new_period.valid.end_after_start}
                            <li>The end time ({new_period.end.to_string()}) is not after the start time ({new_period.start.to_string()}).</li>
                        {/if}

                        {#if !new_period.valid.no_time_overlap}
                            <li>This class's time overlaps with the class ({new_period.valid.overlap_name}).</li>
                        {/if}

                        {#if !new_period.valid.no_name_overlap}
                            <li>This class's name overlaps with the class ({new_period.valid.overlap_name}).</li>
                        {/if}
                    </ul>
                {/if}
                <button onclick={add_new_period} class={`w-3/4 ${new_period.valid.overall ? "bg-blue-500 border-3 border-blue-800 text-2xl" : "bg-red-500 border-3 border-red-800 text-2xl"} rounded-2xl flex justify-center items-center transition hover:scale-120 ${new_period.valid.overall ? "hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]" : "hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]"}`}>Add</button>
            </div>
        </div>
    </div>
{/if}