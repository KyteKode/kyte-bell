<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

    import DebugMenu from "$lib/components/DebugMenu.svelte";
    import { Icon, Calendar } from "svelte-hero-icons";

    import { resolve } from "$app/paths";

	let { children } = $props();
</script>

<svelte:head>
    <title>Bell Time</title>
    <link rel="icon" href={favicon} />
</svelte:head>

<header class="fixed top-0 bg-slate-900/75 backdrop-blur-sm min-w-screen h-20 px-[2%] py-2 flex justify-between items-center z-9999">
    <div class="flex flex-col justify-center items-center gap-0">
        <a class="transition hover:scale-110" href={resolve("/")}>
            <h1>Bell Timer</h1>
        </a>

        <span class="flex justify-center items-center gap-1.5">
            <span class="font-light">created by</span>
            <a class="flex gap-1.5 items-center justify-center transition font-semibold text-xl hover:scale-110" href="https://github.com/KyteKode">
                KyteKode
                <img class="rounded-xl aspect-square size-8" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
            </a>
        </span>
    </div>
    <nav class="flex justify-center items-center gap-1.5">
        <a class="relative h-16 w-16 group text-md font-bold flex flex-col justify-center items-center gap-1 transition hover:scale-110" href={resolve("/schedule")}>
            <Icon class="aspect-square size-8" src={Calendar} />
            <span class="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] overflow-hidden">
                <span class="min-h-0">Schedule</span>
            </span>
        </a>
    </nav>
</header>

<div class="h-20"></div>

<DebugMenu />

{@render children()}
