<script lang="ts">
    import { Icon, ClipboardDocumentList, Check } from "svelte-hero-icons";
    import { JsonView } from '@zerodevx/svelte-json-view'

    import Store from "$lib/localstorage_handler";

    interface Props {
        hide: () => void
    }

    let { hide }: Props = $props();



    const store = new Store();

    function get_data(): string {
        return store.get_item_raw("periods") ?? "[]";
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
            console.error("Copy failed.");
        }
    }

    let text_copy_icon = $state(ClipboardDocumentList);
</script>

<div class="relative gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-lg aspect-square flex flex-col items-center">
    <button onclick={hide} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">×</button>

    <h1 class="text-center">Export Data</h1>

    <hr class="w-5/6 border-white/20 border rounded">

    <div class="flex flex-col justify-center items-center h-full w-full">
        <span class="text-xl m-3">Copy this JSON.</span>
        <div class="bg-slate-900 border-black border-3 w-11/12 overflow-auto max-h-full text-wrap p-3 font-mono rounded-2xl relative">
            <button onclick={copy_data} class:text-green-500={successful_copy} class="absolute top-3 right-4 rounded-2xl bg-transparent transition hover:scale-120 hover:bg-white/20 p-1">
                <Icon src={text_copy_icon} class="size-10 aspect-square text-green" />
            </button>

            <JsonView json={JSON.parse(get_data())} />
        </div>
    </div>
</div>