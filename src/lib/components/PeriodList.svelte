<script lang="ts">
    import PeriodDataDisplay from "$lib/components/PeriodDataDisplay.svelte";
    import Button from "$lib/components/Button.svelte";

    import { Plus } from "svelte-hero-icons";
    import globals from "$lib/globals.svelte";

    interface Props {
        createNewPeriod: () => void,
        startEdit: (idx: number) => void
    }

    let { createNewPeriod, startEdit }: Props = $props();
</script>

<div class="relative bg-slate-800 border-2 border-slate-900 p-6 rounded-2xl flex flex-col items-center">
    <Button corner onclick={createNewPeriod} icon={Plus} />

    {#if Object.entries(globals.periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {#each globals.periods as data, idx (idx)}
            <PeriodDataDisplay data={data} edit={() => startEdit(idx)} />
        {/each}
    </div>
</div>