<script lang="ts">
    import { Icon, PencilSquare } from "svelte-hero-icons";

    // i have no idea why but i need to import globals here or it throws error 500
    // its not even used anywhere in the file
    import {} from "$lib/globals.svelte";
    import PeriodData from "$lib/period_data.svelte";

    interface Props {
        data: PeriodData,
        edit: () => void
    }

    let { data, edit }: Props = $props();
</script>

<div class="relative bg-slate-600 border-3 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
    <button onclick={edit} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square p-1.5 size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">
        <Icon src={PencilSquare} />
    </button>

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