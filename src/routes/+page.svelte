<script lang="ts">
    import DebugMenu from "$lib/components/DebugMenu.svelte";

    import Time from "$lib/time.svelte.js";
    import CurrentPeriodDisplay from "$lib/components/CurrentPeriodDisplay.svelte";



    // Used as a depndency for the `now` variable
    let tick = $state(0);
    setInterval(() => {tick++}, 100);

    // Derived so it updates every second
    const now: Time = $derived.by(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        tick;
        return Time.now();
    });

</script>

<h1>Bell Timer</h1>
<a class="m-3 w-48 flex flex-col gap-1.5 items-center justify-center transition duration-500 hover:scale-125" href="https://github.com/KyteKode">
    <img class="rounded-2xl" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
    Created by KyteKode
</a>

<CurrentPeriodDisplay now={now} />

<!--hr class="my-8 w-5/6 border-white/20 border rounded"-->