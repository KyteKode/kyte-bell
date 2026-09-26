<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

    import DebugMenu from "$lib/components/DebugMenu.svelte";

	let { children } = $props();
</script>

<svelte:head>
    <title>Bell Time</title>
    <link rel="icon" href={favicon} />
</svelte:head>


<DebugMenu />

{@render children()}
