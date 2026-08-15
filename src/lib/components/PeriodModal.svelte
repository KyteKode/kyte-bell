<script lang="ts">
    import TimeInput from "$lib/components/TimeInput.svelte";
    import Button from "$lib/components/Button.svelte";

    import type PeriodData from "$lib/period_data.svelte";
    import type { Snippet } from "svelte";
    import globals from "$lib/globals.svelte";
    import { XMark, Plus } from "svelte-hero-icons";

    interface Props {
        data: PeriodData,
        show: boolean,
        children: Snippet,
        valid: boolean
    }

    // eslint-disable-next-line no-useless-assignment
    let { data = $bindable(), show = $bindable(), valid = $bindable(), children }: Props = $props();

    // Recommendations for other info
    let addRecommendations: string[] = $state(
        Object.keys(globals.common_other)
            .filter( (name) => !data.other[name] )
    );

    let infoName: string = $state("");

    // Add extra user defined info
    function addOtherInfo(useInfoName: boolean, key?: string) {
        let keyName = key ?? infoName;

        if (!data.other[keyName] && keyName.trim() != "") {
            data.other[keyName] = "";


            if (useInfoName) {
                infoName = "";
            } else {
                addRecommendations = addRecommendations.filter( (name) => name != keyName);
            }
        }
    }

    // Remove extra user defined info
    function removeOtherInfo(key: string) {
        delete data.other[key];
    }

    $effect(() => {
        valid = data.valid.overall;
    });
</script>

<div class="relative flex flex-col gap-5 bg-slate-600 border-2 border-slate-700 p-3 rounded-2xl w-lg">
    <Button corner onclick={() => show = false} icon={XMark} />

    <div class="grid grid-cols-[1fr_2fr] items-center justify-center gap-2">
        <span class="w-15 text-xl">Name:</span>
        <input bind:value={data.name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400" type="text">

        <span class="w-15 text-xl">Start:</span>
        <TimeInput bind:value={data.start} />

        <span class="w-15 text-xl">End:</span>
        <TimeInput bind:value={data.end} />

        {#each Object.entries(data.other) as [name] (name)}
            <span class="flex flex-row justify-start items-center">
                <span class="w-32 text-xl wrap-break-word">{name}:</span>
                <Button onclick={() => {removeOtherInfo(name)}} icon={Plus} />
            </span>
            <input bind:value={data.other[name]} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400" type="text">
        {/each}

        <span class="w-15 text-xl">Other:</span>
        <span class="w-56 gap-3 flex items-center justify-center">
            <input bind:value={infoName} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400" type="text">
            <Button onclick={() => {addOtherInfo(true)}} icon={Plus} />
        </span>

        <div class="grid grid-cols-2 gap-4 w-full col-span-2 p-3">
            {#each addRecommendations as name (name)}
                <Button onclick={() => {addOtherInfo(false, name)}} icon={Plus}>{name}</Button>
            {/each}
        </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-2">
        {#if !data.valid.overall}
            <ul class="list-disc pl-5 space-y-2">
                {#if !data.valid.start_valid}
                    <li>{data.start.toString()} is not a valid start time.</li>
                {/if}

                {#if !data.valid.end_valid}
                    <li>{data.end.toString()} is not a valid end time.</li>
                {/if}

                {#if !data.valid.end_after_start}
                    <li>The end time ({data.end.toString()}) is not after the start time ({data.start.toString()}).</li>
                {/if}

                {#if !data.valid.no_time_overlap}
                    <li>This class's time overlaps with the class ({data.valid.overlap_name}).</li>
                {/if}

                {#if !data.valid.no_name_overlap}
                    <li>This class's name overlaps with the class ({data.valid.overlap_name}).</li>
                {/if}
            </ul>
        {/if}

        {@render children()}
    </div>
</div>