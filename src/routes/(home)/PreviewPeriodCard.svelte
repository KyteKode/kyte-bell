<script lang="ts">
    import PeriodData from "$lib/period.svelte";
    import type Time from "$lib/time.svelte";

    interface Props {
        data: PeriodData,
        now: Time,
        position: "previous" | "next"
    }

    let { data, now, position }: Props = $props();
</script>

<div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col justify-center items-center w-sm opacity-50 scale-80 blur-[1px]">
    <span class="text-3xl font-black mb-3 wrap-break-word">{data.name}</span>

    <span class="w-full flex justify-center items-center gap-1">
        {#if position == "previous"}
            <span class="font-bold">Ended:</span>
            {now.timeSince(data.end)} ago
        {:else}
            <span class="font-bold">Starts in:</span>
            {now.timeUntil(data.start)}
        {/if}
    </span>

    {#each Object.entries(data.other) as [key, otherData] (key)}
            <span class="w-full flex justify-center items-center gap-1">
                <span class="font-bold wrap-break-word">{key}:</span>
                <span class="wrap-break-word">{otherData}</span>
            </span>
    {/each}
</div>