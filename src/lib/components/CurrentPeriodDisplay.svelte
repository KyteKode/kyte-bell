<script lang="ts">
    import {type CurrentPeriod, CurrentPeriodResult, get_current_period} from "$lib/current_period_type";
    import Time from "$lib/time_type.svelte"
    import globals from "$lib/globals.svelte";

    interface Props {
        now: Time
    }

    let { now }: Props = $props();
    let current: CurrentPeriod = $derived(get_current_period(now));
</script>

<div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
    {#if current.kind == CurrentPeriodResult.Some}
        {@const data = globals.periods[current.current_idx]}

        <span>Current class:</span>
        <span class="text-3xl font-black mb-3">{data.name}</span>

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