<script lang="ts">
    import type { PresetCriterion } from "$lib/preset.svelte";

    interface Props {
        criterion: PresetCriterion,
        idx: number
    }

    let { criterion = $bindable(), idx }: Props = $props();
</script>

<div class="flex gap-3 justify-center items-center">
    <span>
        {#if idx > 0}
            Or if
        {:else}
            If
        {/if}
    </span>

    <select bind:value={criterion.kind} class="h-12 rounded-2xl text-slate-900 justify-center border-3 border-slate-400">
        <option value="dayOfWeek">Day of week</option>
        <option value="month">Month</option>
        <option value="date">Date</option>
    </select>

    <span>is</span>

    {#if criterion.kind == "dayOfWeek"}
        <select bind:value={criterion.day} class="h-12 rounded-2xl text-slate-900 justify-center border-3 border-slate-400">
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
        </select>
    {:else if criterion.kind == "month"}
        <select bind:value={criterion.month} class="h-12 rounded-2xl text-slate-900 justify-center border-3 border-slate-400">
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
        </select>
    {:else}
        <select bind:value={criterion.month} class="h-12 rounded-2xl text-slate-900 justify-center border-3 border-slate-400">
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
        </select>
        <input bind:value={criterion.day} class="h-12 w-18 rounded-2xl text-slate-900 text-center border-3 border-slate-400" type="number" min={1} max={31} />
    {/if}
</div>
