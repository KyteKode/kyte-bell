<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        show: boolean,
        children: Snippet
    }

    let { show, children }: Props = $props();
</script>

{#if show}
    <div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm min-w-screen min-h-screen">
        {@render children()}
    </div>
{/if}