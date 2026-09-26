<script lang="ts">
    import CurrentPeriodCard from "./CurrentPeriodCard.svelte";
    import NextPeriodCard from "./NextPeriodCard.svelte";
    import PreviewPeriodCard from "./PreviewPeriodCard.svelte";

    import Time from "$lib/time.svelte";
    import globals from "$lib/globals.svelte";

    import getShownPeriodInfo from "./shownPeriodInfo.ts";

    // Used as a depndency for the `now` variable
    let tick = $state(0);
    setInterval(() => {tick++}, 100);

    // Derived so it updates every second
    const now: Time = $derived.by(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        tick;
        return Time.now();
    });

    // Gets info for showing periods
    const info = $derived(getShownPeriodInfo(now));
</script>

<div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center min-w-screen min-h-screen">
    {#if info.state == "free"}
        <div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col justify-center items-center w-md text-2xl font-bold">
            You're free! 🥳
        </div>
    {/if}
    {#if info.state == "beforeClass"}
        <div class="bg-slate-600 border-2 border-slate-700 p-6 rounded-2xl flex flex-col justify-center items-center w-md text-2xl font-bold">
            Classes haven't started yet.
        </div>
    {/if}

    {#if info.state == "inClass" || info.state == "between"}
        <div class="grid grid-rows-[1fr_1fr_1fr] gap-10">
            <div class="flex justify-center items-center">
                {#if info.previous != null}
                    <PreviewPeriodCard data={globals.periods[info.previous]} now={now} position="previous" />
                {/if}
            </div>

            {#if info.state == "inClass"}
                <CurrentPeriodCard data={globals.periods[info.current]} now={now} />
            {:else}
                <NextPeriodCard data={globals.periods[info.current]} now={now} />
            {/if}

            <div class="flex justify-center items-center">
                {#if info.previous != null}
                    <PreviewPeriodCard data={globals.periods[info.next]} now={now} position="next" />
                {/if}
            </div>
        </div>
    {/if}
</div>