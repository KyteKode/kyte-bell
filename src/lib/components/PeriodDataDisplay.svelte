<script lang="ts">
    import { Icon, Pencil } from "svelte-hero-icons";
    import Button from "$lib/components/Button.svelte";

    import PeriodData from "$lib/period_data.svelte";

    interface Props {
        data: PeriodData,
        edit: () => void
    }

    let { data, edit }: Props = $props();

    let hovered: boolean = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={() => hovered = true} onmouseleave={() => hovered = false} class="relative bg-slate-600 border-2 border-slate-700 p-4 rounded-2xl flex flex-col align-center">
    <span class:scale-0={!hovered} class="absolute -top-4 -right-4 transition">
        <Button onclick={edit} icon={Pencil} />
    </span>
    <!--button onclick={edit}  class="bg-slate-100 border-2 border-slate-400 text-2xl text-black aspect-square p-1.5 size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -right-3">
        <Icon src={Pencil} />
    </button-->

    <span class="text-3xl font-black wrap-break-word">{data.name}</span>

    <span>
        <span class="font-bold">Start:</span>
        {data.start.toString()}
    </span>

    <span>
        <span class="font-bold">End:</span>
        {data.end.toString()}
    </span>

    {#each Object.entries(data.other) as [key, other_data] (key)}
        <span>
            <span class="font-bold wrap-break-word">{key}:</span>
            <span class="wrap-break-word">{other_data}</span>
        </span>
    {/each}
</div>