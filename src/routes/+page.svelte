<script lang="ts">
    import TimeInput from "$lib/components/TimeInput.svelte";

    import Time from "$lib/time_type.svelte";

    interface PeriodData {
        start: Time,
        end: Time,
        other: Record<string, string>
    }

    let periods: Record<string, PeriodData> = $state({});



    let showNewPeriodModal: boolean = $state(true);

    let newPeriodName: string = $state("");
    let newPeriodStart: Time = $state(new Time());
    let newPeriodEnd: Time = $state(new Time());

    let newPeriodValid: boolean = $derived(newPeriodStart.valid && newPeriodEnd.valid && newPeriodEnd.is_after(newPeriodStart));

    let otherInfo: Record<string, string> = $state({});
    let newInfoName: string = $state("");

    function addOtherInfo() {
        if (!otherInfo[newInfoName] && newInfoName.trim() != "") {
            otherInfo[newInfoName] = "";
        }
    }

    function removeOtherInfo(key: string) {
        delete otherInfo[key];
    }

    function addNewPeriod() {
        if (newPeriodValid) {
            // do stuff here
        }
    }
</script>

<h1>Bell Timer</h1>
<a class="m-3 w-48 flex flex-col gap-1.5 items-center justify-center transition duration-500 hover:scale-125" href="https://github.com/KyteKode">
    <img class="rounded-2xl" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
    Created by KyteKode
</a>

<div class="relative bg-slate-800 border-3 border-slate-900 p-6 rounded-2xl">
    <button onclick={() => {showNewPeriodModal = true}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">+</button>

    {#if Object.entries(periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-3 gap-5">
        <!--{#each periods as [name, data] (name)}
            <div class="bg-slate-600 border-3 border-slate-700 p-6 rounded-2xl">
                <span class="text-2xl">{name}</span>
            </div>
        {/each}-->
    </div>
</div>



{#if showNewPeriodModal}
    <div class="fixed top-1/2 flex flex-col gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-sm">
        <div class="grid grid-cols-[1fr_2fr] items-center justify-center gap-2">
            <span class="w-15 text-xl">Name:</span>
            <input bind:value={newPeriodName} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">

            <span class="w-15 text-xl">Start:</span>
            <TimeInput bind:value={newPeriodStart} />

            <span class="w-15 text-xl">End:</span>
            <TimeInput bind:value={newPeriodEnd} />

            {#each Object.entries(otherInfo) as [name] (name)}
                <span class="flex flex-row justify-start items-center">
                    <span class="w-15 text-xl">{name}:</span>
                    <button onclick={() => {removeOtherInfo(name)}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">-</button>
                </span>
                <input bind:value={otherInfo[name]} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
            {/each}

            <span class="w-15 text-xl">Other:</span>
            <span class="w-56 gap-3 flex items-center justify-center">
                <input bind:value={newInfoName} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
                <button onclick={addOtherInfo} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">+</button>
            </span>
        </div>

        <div class="flex flex-col justify-center items-center gap-2">
            {#if !newPeriodValid}
                <h1>Invalid!</h1>
            {/if}
            <button onclick={addNewPeriod} class={`w-3/4 ${newPeriodValid ? "bg-blue-500 border-3 border-blue-800 text-2xl" : "bg-red-500 border-3 border-red-800 text-2xl"} rounded-2xl flex justify-center items-center transition hover:scale-120 ${newPeriodValid ? "hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]" : "hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]"}`}>Add</button>
        </div>
    </div>
{/if}