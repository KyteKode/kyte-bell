<script lang="ts">
    import { AMPM } from "$lib/time_type.svelte";

    let { value = $bindable() } = $props();
</script>

<div class="h-12 grid grid-cols-[1fr_auto_1fr_1fr] gap-1 items-center">
    <input bind:value={value.hour} class="h-12 w-full rounded-2xl text-slate-900 text-center border-3 border-slate-400" defaultValue={value.hour} type="text">
    <span>:</span>
    <input bind:value={value.minute} class="h-12 w-full rounded-2xl text-slate-900 text-center border-3 border-slate-400" defaultValue={value.minute} type="text">
    <select bind:value={value.ampm} class="h-12 rounded-2xl text-slate-900 justify-center border-3 border-slate-400">
        <option value={AMPM.AM}>AM</option>
        <option value={AMPM.PM}>PM</option>
    </select>
</div>