<script lang="ts">
    import { Icon, ClipboardDocumentList, Check } from "svelte-hero-icons";

    import Store from "$lib/localstorage_handler";
    import { ZStoredData } from "$lib/storage_schemas";
    import { fromBinary } from "$lib/bin_convert";
    import { type Option, none, some } from "$lib/option";

    interface Props {
        hide: () => void
    }

    let { hide }: Props = $props();

    let mode: "json" | "bin" = $state("bin");

    const store = new Store();

    let input: string = $state("");

    let successfulPaste: boolean = $state(false);
    let hasData: boolean = $derived(input.trim() != "");

    async function pasteData() {
        successfulPaste = false;

        // Try/catch for clipboard
        try {
            input = await navigator.clipboard.readText();
            textPasteIcon = Check;
            successfulPaste = true;
        } catch {
            textPasteIcon = ClipboardDocumentList;
            console.error("Paste failed.");
            return;
        }
    }

    async function validBin(): Promise<Option<ZStoredData>> {
        return await fromBinary(input);
    }

    function validJSON(): Option<ZStoredData> {
        try {
            const json = JSON.parse(input);
            return some(ZStoredData.parse(json));
        } catch {
            return none();
        }
    }

    async function finalizeImport() {
        const decodedResult = mode == "bin" ? await validBin() : validJSON();

        if (!decodedResult.some) { return; }
        store.stored = decodedResult.data;

        window.location.reload();
    }

    let textPasteIcon = $state(ClipboardDocumentList);
</script>

<div class="relative gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-lg aspect-square flex flex-col items-center">
    <button onclick={hide} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

    <h1 class="text-center">Import Data</h1>

    <span class="grid grid-cols-2 w-full">
        <button onclick={() => mode = "bin"} class={`${mode == "bin" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>Binary</button>
        <button onclick={() => mode = "json"} class={`${mode == "json" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>JSON</button>
    </span>

    <hr class="w-5/6 border-white/20 border rounded">

    <div class="flex flex-col justify-center items-center h-full w-full">
        <span class="text-xl m-3">Paste the data here.</span>
        <div class="bg-slate-900 border-black border-3 w-11/12 overflow-auto h-full text-wrap p-3 font-mono rounded-2xl relative">
            <button onclick={pasteData} class:text-green-500={successfulPaste} class="absolute top-3 right-4 rounded-2xl bg-transparent transition hover:scale-120 hover:bg-white/20 p-1">
                <Icon src={textPasteIcon} class="size-10 aspect-square text-green" />
            </button>

            <textarea bind:value={input} class="w-full h-full bg-slate-900 border-0"></textarea>
        </div>
    </div>

    {#if mode == "bin"}
        {#if hasData}
            {#await validBin()}
            {:then valid}
                {#if !valid}
                    <h1>Invalid!</h1>
                {/if}
                <button onclick={finalizeImport} class={`w-3/4 ${valid ? "bg-blue-500 border-3 border-blue-800 text-2xl" : "bg-red-500 border-3 border-red-800 text-2xl"} rounded-2xl flex justify-center items-center transition hover:scale-120 ${valid ? "hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]" : "hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]"}`}>Import classes</button>
            {:catch}
                <h1>Invalid!</h1>
                <button onclick={finalizeImport} class="w-3/4 bg-red-500 border-3 border-red-800 text-2xl rounded-2xl flex justify-center items-center transition hover:scale-120 hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]">Import classes</button>
            {/await}
        {/if}
    {:else}
        {#if !validJSON}
            <h1>Invalid!</h1>
        {/if}
        {#if hasData}
            <button onclick={finalizeImport} class={`w-3/4 ${validJSON() ? "bg-blue-500 border-3 border-blue-800 text-2xl" : "bg-red-500 border-3 border-red-800 text-2xl"} rounded-2xl flex justify-center items-center transition hover:scale-120 ${validJSON() ? "hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]" : "hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]"}`}>Import classes</button>
        {/if}
    {/if}
</div>