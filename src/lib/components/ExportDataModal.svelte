<script lang="ts">
    import { Icon, ClipboardDocumentList, Check } from "svelte-hero-icons";

    import Store from "$lib/localstorage_handler";
    import type { StorageSchema } from "$lib/storage_schemas";
    import { to_binary } from "$lib/bin_convert";

    interface Props {
        hide: () => void
    }

    let { hide }: Props = $props();



    const store = new Store<StorageSchema>();

    function get_json(): string {
        return store.get_item_raw("periods") ?? "[]";
    }

    async function get_bin(): Promise<string> {
        const periods: StorageSchema = { periods: store.get_item("periods") ?? [] };
        return to_binary(periods);
    }



    let successful_copy: boolean = $state(false);

    async function copy_data() {
        successful_copy = false;
        try {
            const text = mode == "bin" ? await get_bin() : get_json();
            await navigator.clipboard.writeText(text);
            text_copy_icon = Check;
            successful_copy = true;
        } catch {
            text_copy_icon = ClipboardDocumentList;
            console.error("Copy failed.");
        }
    }

    let text_copy_icon = $state(ClipboardDocumentList);

    let mode: "json" | "bin" = $state("bin");
</script>

<div class="relative gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-lg aspect-square flex flex-col items-center">
    <button onclick={hide} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

    <h1 class="text-center">Export Data</h1>

    <span class="grid grid-cols-2 w-full">
        <button onclick={() => mode = "bin"} class={`${mode == "bin" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>Binary</button>
        <button onclick={() => mode = "json"} class={`${mode == "json" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>JSON</button>
    </span>

    <hr class="w-5/6 border-white/20 border rounded">

    <div class="flex flex-col justify-center items-center h-full w-full">

        <span class="text-xl m-3">Copy this.</span>
        <div class="bg-slate-900 border-black border-3 w-11/12 h-full overflow-auto text-wrap p-3 font-mono rounded-2xl relative">
            <button onclick={copy_data} class:text-green-500={successful_copy} class="absolute right-4 top-3 rounded-2xl backdrop-blur-3xl transition hover:scale-120 bg-white/5 p-1">
                <Icon src={text_copy_icon} class="size-10 aspect-square text-green" />
            </button>

            <div class="max-w-full break-all">
                {#if mode == "bin"}
                    {#await get_bin()}
                        <span>Compressing data...</span>
                    {:then data}
                        <span>{data}</span>
                    {:catch error}
                        <span>Error: {error}</span>
                    {/await}
                {:else}
                    {get_json()}
                {/if}
            </div>
        </div>
    </div>
</div>