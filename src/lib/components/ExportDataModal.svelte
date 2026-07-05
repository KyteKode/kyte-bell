<script lang="ts">
    import { Icon, DocumentArrowDown, ClipboardDocumentList, Check } from "svelte-hero-icons";
    import { JsonView } from '@zerodevx/svelte-json-view'

    import Store from "$lib/localstorage_handler";

    interface Props {
        hide: () => void
    }

    let { hide }: Props = $props();



    const store = new Store();

    let download_link: string = $state(export_blob());

    $effect(() => {
        const url = export_blob();
        download_link = url;
        return () => URL.revokeObjectURL(url);
    });

    function get_data(): string {
        return store.get_item_raw("periods") ?? "[]";
    }

    function export_blob(): string {
        const blob = new Blob([ get_data() ], { type: "application/json" });
        return URL.createObjectURL(blob);
    }



    let successful_copy: boolean = $state(false);

    async function copy_data() {
        successful_copy = false;
        try {
            await navigator.clipboard.writeText(get_data());
            text_copy_icon = Check;
            successful_copy = true;
        } catch {
            text_copy_icon = ClipboardDocumentList;
            successful_copy = false;
        }
    }

    let mode: "file" | "text" = $state("text");

    let text_copy_icon = $state(ClipboardDocumentList);
</script>

<div class="relative flex flex-col gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-lg aspect-square flex flex-col items-center">
    <button onclick={hide} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

    <h1 class="text-center">Export Data</h1>

    <span class="grid grid-cols-2 w-full">
        <button onclick={() => mode = "file"} class={`${mode == "file" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>File</button>
        <button onclick={() => mode = "text"} class={`${mode == "text" ? "underline text-white font-bold" : "text-slate-400 font-normal"} text-2xl transition hover:120`}>Text</button>
    </span>

    <hr class="w-5/6 border-white/20 border rounded">

    <div class="flex flex-col justify-center items-center h-full w-full">
        {#if mode == "file"}
            <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
            <a href={download_link} download="kytebell_data.json" class="flex flex-col justify-center items-center border-3 bg-slate-100 border-slate-400 rounded-2xl text-black p-2 size-84 aspect-square m-5 transition hover:scale-120">
                <Icon src={DocumentArrowDown} class="size-72 aspect-square" />
                <span class="text-xl">Click to download</span>
            </a>
        {:else}
            <span class="text-xl m-3">Copy this</span>
            <div class="bg-slate-900 border-black border-3 w-11/12 overflow-auto max-h-full text-wrap p-3 font-mono rounded-2xl relative">
                <button onclick={copy_data} class:text-green-500={successful_copy} class="absolute top-3 right-4 rounded-2xl bg-transparent transition hover:scale-120 hover:bg-white/20 p-1">
                    <Icon src={text_copy_icon} class="size-10 aspect-square text-green" />
                </button>

                <JsonView json={JSON.parse(get_data())} />
            </div>
        {/if}
    </div>
</div>