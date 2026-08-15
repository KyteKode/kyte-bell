<script lang="ts">
    import Button from "$lib/components/Button.svelte";

    import globals from "$lib/globals.svelte";

    import { shortcut } from "@svelte-put/shortcut";
    import * as dev from "$lib/dev.svelte";
    import { ExclamationTriangle } from "svelte-hero-icons";
</script>

<svelte:window
        use:shortcut={{
        trigger: {
            key: 'D',
            modifier: "shift",
            callback: dev.toggleDevMenu,
        },
    }}
/>

{#if dev.isDevOpen()}
    <div class="bg-slate-600 border-2 border-slate-700 p-4 flex flex-col justify-center items-center gap-3">
        <h1>Developer Menu</h1>
        <p>Hello! If you have found this, you should probably refresh. These actions are only made for testing purposes. Red buttons are irreversible.</p>

        <Button full onclick={dev.manualCurrentPeriod}>Manually set current period</Button>
        <Button full onclick={() => globals.devCurrentPeriod = null}>Reset manually set period</Button>

        <hr class="my-4 w-5/6 border-white/20 border rounded">

        <Button full color="red" icon={ExclamationTriangle} onclick={dev.nukeLocalStorage}>Nuke the localstorage!!!</Button>
        <Button full color="red" icon={ExclamationTriangle} onclick={dev.loadDebugJSON}>Load Debug (JSON)</Button>
        <Button full color="red" icon={ExclamationTriangle} onclick={dev.loadDebugBase91}>Load Debug (Base91)</Button>
    </div>
{/if}