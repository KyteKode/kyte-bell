<script lang="ts">
    import PeriodData from "$lib/period.svelte";
    import type Time from "$lib/time.svelte";

    interface Props {
        data: PeriodData,
        now: Time
    }

    let { data, now }: Props = $props();
</script>

<div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col justify-center items-center w-md">
    <span>Current class:</span>
    <span class="text-3xl font-black mb-3 wrap-break-word">{data.name}</span>

    <span class="w-full flex justify-center items-center gap-1">
        <span class="font-bold">Started:</span>
        {now.timeSince(data.start)} ago
    </span>
    <span class="w-full flex justify-center items-center gap-1">
        <span class="font-bold">Ends in:</span>
        {now.timeUntil(data.end)}
    </span>

    {#each Object.entries(data.other) as [key, otherData] (key)}
            <span class="w-full flex justify-center items-center gap-1">
                <span class="font-bold wrap-break-word">{key}:</span>
                <span class="wrap-break-word">{otherData}</span>
            </span>
    {/each}
</div>