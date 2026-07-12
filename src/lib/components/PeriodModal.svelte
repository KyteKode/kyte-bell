<script lang="ts">
    import TimeInput from "$lib/components/TimeInput.svelte";

    import type PeriodData from "$lib/period_data.svelte";
    import type { Snippet } from "svelte";
    import globals from "$lib/globals.svelte";

    interface Props {
        data: PeriodData,
        hide: () => void,
        submit_info: () => void,
        children?: Snippet
    }

    let { data = $bindable(), hide, submit_info, children }: Props = $props();

    // Recommendations for other info
    let add_recommendations: string[] = $state(
        Object.keys(globals.common_other)
            .filter( (name) => !data.other[name] )
    );

    let info_name: string = $state("");

    // Add extra user defined info
    function add_other_info(use_info_name: boolean, key?: string) {
        let key_name = key ?? info_name;

        if (!data.other[key_name] && key_name.trim() != "") {
            data.other[key_name] = "";


            if (use_info_name) {
                info_name = "";
            } else {
                add_recommendations = add_recommendations.filter( (name) => name != key_name);
            }
        }
    }

    // Remove extra user defined info
    function remove_other_info(key: string) {
        delete data.other[key];
    }
</script>

<div class="relative flex flex-col gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-lg">
    <button onclick={hide} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

    <div class="grid grid-cols-[1fr_2fr] items-center justify-center gap-2">
        <span class="w-15 text-xl">Name:</span>
        <input bind:value={data.name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">

        <span class="w-15 text-xl">Start:</span>
        <TimeInput bind:value={data.start} />

        <span class="w-15 text-xl">End:</span>
        <TimeInput bind:value={data.end} />

        {#each Object.entries(data.other) as [name] (name)}
            <span class="flex flex-row justify-start items-center">
                <span class="w-32 text-xl wrap-break-word">{name}:</span>
                <button onclick={() => {remove_other_info(name)}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">-</button>
            </span>
            <input bind:value={data.other[name]} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
        {/each}

        <span class="w-15 text-xl">Other:</span>
        <span class="w-56 gap-3 flex items-center justify-center">
            <input bind:value={info_name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
            <button onclick={() => add_other_info(true)} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">+</button>
        </span>

        <div class="grid grid-cols-2 gap-4 w-full col-span-2 p-3">
            {#each add_recommendations as name (name)}
                <button onclick={() => add_other_info(false, name)} class="bg-slate-100 border-3 border-slate-400 text-black rounded-2xl h-12  transition hover:scale-110">+ {name}</button>
            {/each}
        </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-2">
        {#if !data.valid.overall}
            <h1>Invalid!</h1>

            <ul class="list-disc pl-5 space-y-2">
                {#if !data.valid.start_valid}
                    <li>{data.start.to_string()} is not a valid start time.</li>
                {/if}

                {#if !data.valid.end_valid}
                    <li>{data.end.to_string()} is not a valid end time.</li>
                {/if}

                {#if !data.valid.end_after_start}
                    <li>The end time ({data.end.to_string()}) is not after the start time ({data.start.to_string()}).</li>
                {/if}

                {#if !data.valid.no_time_overlap}
                    <li>This class's time overlaps with the class ({data.valid.overlap_name}).</li>
                {/if}

                {#if !data.valid.no_name_overlap}
                    <li>This class's name overlaps with the class ({data.valid.overlap_name}).</li>
                {/if}
            </ul>
        {/if}

        <button onclick={submit_info} class={`w-3/4 ${data.valid.overall ? "bg-blue-500 border-3 border-blue-800 text-2xl" : "bg-red-500 border-3 border-red-800 text-2xl"} rounded-2xl flex justify-center items-center transition hover:scale-120 ${data.valid.overall ? "hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]" : "hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]"}`}>Confirm</button>

        {@render children?.()}
    </div>
</div>