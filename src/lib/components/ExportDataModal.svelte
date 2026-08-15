<script lang="ts">
    import { ClipboardDocumentList, Check, XMark } from "svelte-hero-icons";
    import ModalBlur from "$lib/components/ModalBlur.svelte";

    import Store from "$lib/localstorage_handler";
    import { toBinary } from "$lib/bin_convert";
    import Button from "$lib/components/Button.svelte";

    let show = $state(false);

    const store = new Store();

    function getJSON(): string {
        return JSON.stringify(store.stored);
    }

    async function getBin(): Promise<string> {
        return toBinary(store.stored);
    }

    async function copyData() {
        try {
            const text = mode == "bin" ? await getBin() : getJSON();
            await navigator.clipboard.writeText(text);
            textCopyIcon = Check;
        } catch {
            textCopyIcon = ClipboardDocumentList;
            console.error("Copy failed.");
        }
    }

    let textCopyIcon = $state(ClipboardDocumentList);

    let mode: "json" | "bin" = $state("bin");

    export function showExports() {
        show = true;
    }

    function binaryInput() {
        mode = "bin";
        textCopyIcon = ClipboardDocumentList;
    }

    function JSONInput() {
        mode = "json";
        textCopyIcon = ClipboardDocumentList;
    }
</script>

<ModalBlur show={show}>
    <div class="relative gap-5 bg-slate-600 border-2 border-slate-700 p-3 rounded-2xl w-lg aspect-square flex flex-col items-center">
        <Button corner onclick={() => show = false} icon={XMark}/>

        <h1 class="text-center">Export Data</h1>

        <span class="grid grid-cols-2 w-full">
        <button onclick={binaryInput} class={`${mode == "bin" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>Binary</button>
        <button onclick={JSONInput} class={`${mode == "json" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>JSON</button>
    </span>

        <hr class="w-5/6 border-white/20 border rounded">

        <div class="flex flex-col justify-center items-center h-full w-full">

            <span class="text-xl m-3">Copy this.</span>
            <div class="bg-slate-900 border-black border-2 w-11/12 h-full overflow-auto text-wrap p-3 font-mono rounded-2xl relative">
                <span class="absolute top-3 right-4">
                    <Button largeIcon color="blur" icon={textCopyIcon} onclick={copyData}/>
                </span>

                <div class="max-w-full break-all">
                    {#if mode == "bin"}
                        {#await getBin()}
                            <span>Compressing data...</span>
                        {:then data}
                            <span>{data}</span>
                        {:catch error}
                            <span>Error: {error}</span>
                        {/await}
                    {:else}
                        {getJSON()}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</ModalBlur>