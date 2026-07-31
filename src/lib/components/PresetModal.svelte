<script lang="ts">
    import CriterionInput from "$lib/components/CriterionInput.svelte";

    import type Preset from "$lib/preset.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        data: Preset,
        isDefault: boolean,
        hide: () => void,
        submitInfo: () => void,
        children?: Snippet
    }

    let { data = $bindable(), isDefault = $bindable(), hide, submitInfo, children }: Props = $props();

    function addCriterion () {
        data.criteria.push({
            kind: "dayOfWeek",
            day: 5 
        });
    }
</script>

<div class="relative flex flex-col gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-2xl">
    <button onclick={hide} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-5 -left-5">×</button>

    <div class="grid grid-cols-[2fr_5fr] items-center justify-center gap-2">
        <span class="w-15 text-xl">Name:</span>
        <input bind:value={data.name} class="min-w-0 h-12 rounded-2xl text-slate-900 border-3 border-slate-400" type="text">

        <span class="w-15 text-xl flex items-center justify-left gap-3 w-full">
            Criteria:
            <button onclick={addCriterion} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">+</button> </span>
        <div class="flex flex-col items-center justify-center">
            <!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
            {#each Object.entries(data.criteria) as _, idx (idx)}
                <CriterionInput bind:criterion={data.criteria[idx]} idx={idx} />
            {/each}
        </div>

        <span class="w-full text-xl">Set to default:</span>
        <div class="flex items-center justify-center">
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="peer sr-only" />
                <span class="w-72 h-8 bg-slate-300 rounded-full peer-checked:bg-blue-500 transition border-3 border-slate-400 peer-checked:border-blue-800 peer-checked:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]"></span>
                <span class="absolute top-1.1 w-36 h-8 border-3 bg-slate-100 border-slate-400 rounded-full transition peer-checked:translate-x-36"></span>
            </label>
        </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-2">
        <button onclick={submitInfo} class="w-3/4 bg-blue-500 border-3 border-blue-800 text-2xl rounded-2xl flex justify-center items-center transition hover:scale-120 hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]">Confirm</button>

        {@render children?.()}
    </div>
</div>
