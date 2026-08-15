<script lang="ts">
    import CriterionInput from "$lib/components/CriterionInput.svelte";
    import Button from "$lib/components/Button.svelte";

    import type Preset from "$lib/preset.svelte";
    import type { Snippet } from "svelte";
    import { Plus, XMark } from "svelte-hero-icons";

    interface Props {
        data: Preset,
        isDefault: boolean,
        show: boolean,
        children?: Snippet,
        valid: boolean,
        hideDefault: boolean,
    }

    // eslint-disable-next-line no-useless-assignment
    let { data = $bindable(), isDefault = $bindable(), show = $bindable(), children, valid = $bindable(), hideDefault }: Props = $props();

    function addCriterion () {
        data.criteria.push({
            kind: "dayOfWeek",
            day: 5 
        });
    }

    $effect(() => {
        valid = data.valid.overall;
    });
</script>

<div class="relative flex flex-col gap-5 bg-slate-600 border-2 border-slate-700 p-3 rounded-2xl w-2xl">
    <Button corner onclick={() => show = false} icon={XMark} />

    <div class="grid grid-cols-[2fr_5fr] items-center justify-center gap-2">
        <span class="w-15 text-xl">Name:</span>
        <input bind:value={data.name} class="min-w-0 h-12 rounded-2xl text-slate-900 border-2 border-slate-400" type="text">

        <span class="text-xl flex items-center justify-left gap-3 w-full">
            Criteria:
            <Button onclick={addCriterion} icon={Plus} />
        </span>
        <div class="flex flex-col items-center justify-center">
            <!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
            {#each Object.entries(data.criteria) as _, idx (idx)}
                <CriterionInput bind:criterion={data.criteria[idx]} idx={idx} />
            {/each}
        </div>

        {#if !hideDefault}
            <span class="w-full text-xl">Set to default:</span>
            <div class="flex items-center justify-center">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input bind:checked={isDefault} type="checkbox" class="peer sr-only" />
                    <span class="w-72 h-8 bg-slate-300 rounded-full peer-checked:bg-blue-500 transition border-2 border-slate-400 peer-checked:border-blue-800 peer-checked:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]"></span>
                    <span class="absolute top-1.1 w-36 h-8 border-2 bg-slate-100 border-slate-400 rounded-full transition peer-checked:translate-x-36"></span>
                </label>
            </div>
        {/if}
    </div>

    <div class="flex flex-col justify-center items-center gap-2">
        {@render children?.()}
    </div>
</div>
