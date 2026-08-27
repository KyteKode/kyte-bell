<script lang="ts">
    import { ClipboardDocumentList, Check, XMark } from "svelte-hero-icons";
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import Button from "$lib/components/Button.svelte";

    import Store from "$lib/lsHandler";
    import { ZStoredData } from "$lib/storageSchemas";
    import { decodeBin } from "$lib/binSchemas";
    import { type Option, none, some } from "$lib/option";

    let show = $state(false);

    let mode: "json" | "bin" = $state("bin");

    const store = new Store();

    let input: string = $state("");

    let hasData: boolean = $derived(input.trim() != "");

    async function pasteData() {

        // Try/catch for clipboard
        try {
            input = await navigator.clipboard.readText();
            textPasteIcon = Check;
        } catch {
            textPasteIcon = ClipboardDocumentList;
            console.error("Paste failed.");
            return;
        }
    }

    async function validBin(): Promise<Option<ZStoredData>> {
        try {
            return some(decodeBin(input));
        } catch {
            return none();
        }
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

    export function showImports() {
        show = true;
        input = "";
        textPasteIcon = ClipboardDocumentList;
    }

    function binaryInput() {
        mode = "bin";
        textPasteIcon = ClipboardDocumentList;
        input = "";
    }

    function JSONInput() {
        mode = "json";
        textPasteIcon = ClipboardDocumentList;
        input = "";
    }
</script>

<ModalBlur show={show}>
    <div class="relative gap-5 bg-slate-600 border-2 border-slate-700 p-3 rounded-2xl w-lg aspect-square flex flex-col items-center">
        <Button corner onclick={() => show = false} icon={XMark}/>

        <h1 class="text-center">Import Data</h1>

        <span class="grid grid-cols-2 w-full">
        <button onclick={binaryInput} class={`${mode == "bin" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>Binary</button>
        <button onclick={JSONInput} class={`${mode == "json" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>JSON</button>
    </span>

        <hr class="w-5/6 border-white/20 border rounded">

        <div class="flex flex-col justify-center items-center h-full w-full">
            <span class="text-xl m-3">Paste the data here.</span>
            <div class="bg-slate-900 border-black border-2 w-11/12 overflow-auto h-full text-wrap p-3 font-mono rounded-2xl relative">
                <span class="absolute top-3 right-4">
                    <Button largeIcon color="blur" icon={textPasteIcon} onclick={pasteData}/>
                </span>

                <textarea bind:value={input} class="w-full h-full bg-slate-900 border-0"></textarea>
            </div>
        </div>

        {#if mode == "bin"}
            {#if hasData}
                {#await validBin()}
                {:then validOption}
                    {@const valid = validOption.some}
                    {@const color = valid ? "blue" : "grey"}
                    {@const text = valid ? "Import Classes" : "Invalid"}

                    <Button full largeText onclick={finalizeImport} color={color}>{text}</Button>
                {:catch}
                    <Button full largeText color="grey">Invalid</Button>
                {/await}
            {:else}
                <Button full largeText color="grey">Paste something...</Button>
            {/if}
        {:else}
            {#if hasData}
                {@const valid = validJSON().some}
                {@const color = valid ? "blue" : "grey"}
                {@const text = valid ? "Import Classes" : "Invalid"}

                <Button full largeText onclick={finalizeImport} color={color}>{text}</Button>
            {:else}
                <Button full largeText color="grey">Paste something...</Button>
            {/if}
        {/if}
    </div>
</ModalBlur>