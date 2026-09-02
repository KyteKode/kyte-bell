<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.png";

    import { ChevronUp, ChevronDown } from "svelte-hero-icons";
    import Button from "$lib/components/Button.svelte";

    import { resolve } from "$app/paths";

    let { children, data } = $props();

    let showAccountActions = $state(false);
</script>

<svelte:head>
    <title>Bell Time</title>
    <link rel="icon" href={favicon} />
</svelte:head>

<header class="w-screen h-14 bg-slate-600 border-b-2 border-b-slate-700 fixed top-0 z-20 flex justify-center items-center">
    <div class="w-4xl h-full py-2 px-2 flex justify-between items-center">
        <a href={resolve('/')} class="flex flex-row items-center justify-center gap-2 text-xl font-bold transition duration-150 hover:scale-110 hover:text-slate-400">
            <img src={favicon} alt="" class="aspect-square size-8" />
            Kyte Bell
        </a>
        {#if data.user}
            <div class="relative">
                <Button icon={showAccountActions ? ChevronUp : ChevronDown} onclick={() => showAccountActions = !showAccountActions} largeText color="transparent" class="anchor/name-anchor">
                    {data.profile?.display_name}
                </Button>
                {#if showAccountActions}
                    <div class="bg-slate-600 border-2 border-t-0 border-slate-700 w-sm h-32 py-2 px-5 flex flex-col justify-center items-center rounded-b-2xl absolute top-13 -right-32">
                        <span class="text-slate-300">{data.user?.email}</span>
                        <hr class="my-5 w-5/6 border-white/20 border rounded">

                        <form method="POST" action="/auth?/logout">
                            <Button color="transparent" noPadding type="submit">Log Out</Button>
                        </form>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="flex items-center justify-center gap-5">
                <a href={resolve("/auth/login")} class="gap-2 text-xl font-bold transition duration-150 hover:scale-110 hover:text-slate-400">
                    Log In
                </a>
                <a href={resolve("/auth/signup")} class="gap-2 text-xl font-bold transition duration-150 hover:scale-110 hover:text-slate-400">
                    Sign Up
                </a>
            </div>
        {/if}
    </div>
</header>

{@render children()}
