<script lang="ts">
    import globals from "$lib/globals.svelte";

    import { shortcut } from "@svelte-put/shortcut";
    import * as dev from "$lib/dev.svelte";
</script>

<svelte:window
        use:shortcut={{
        trigger: {
            key: 'D',
            modifier: "shift",
            callback: dev.toggle_dev_menu,
        },
    }}
/>

{#if dev.is_dev_open()}
    <div class="bg-slate-600 border-2 border-slate-700 p-4 flex flex-col justify-center items-center gap-3">
        <h1>Developer Menu</h1>
        <p>Hello! If you have found this, you should probably refresh. These actions are only made for testing purposes. Red buttons are irreversible.</p>

        <button onclick={dev.manual_current_period} class="w-full bg-slate-500 border-2 border-slate-800 p-2">Manually set current period</button>
        <button onclick={() => globals.dev_current_period = null} class="w-full bg-slate-500 border-2 border-slate-800 p-2">Reset manual current period</button>

        <button onclick={dev.nuke_ls} class="w-full bg-red-500 border-2 border-red-800 p-2">Nuke the localstorage</button>
        <button onclick={dev.load_debug_json} class="w-full bg-red-500 border-2 border-red-800 p-2">Load debug JSON</button>
        <button onclick={dev.load_debug_base91} class="w-full bg-red-500 border-2 border-red-800 p-2">Load debug Base91</button>

        <hr class="my-4 w-5/6 border-white/20 border rounded">
    </div>
{/if}