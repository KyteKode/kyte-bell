<script lang="ts">
    import TimeInput from "$lib/components/TimeInput.svelte";
    import Time from "$lib/time_type.svelte";
    import PeriodData from "$lib/period_data.svelte";



    let periods: Record<string, PeriodData> = $state({});

    let show_new_modal: boolean = $state(true);

    let new_period: PeriodData = $state(new PeriodData(new Time(), new Time(), {}))
    let new_period_name: string = $state("Class");
    let new_info_name: string = $state("");

    function add_other_info() {
        if (!new_period.other[new_info_name] && new_info_name.trim() != "") {
            new_period.other[new_info_name] = "";
            new_info_name = "";
        }
    }

    function remove_other_info(key: string) {
        delete new_period.other[key];
    }

    function add_new_period() {
        if (new_period.valid) {
            periods[new_period_name] = new_period.clone();
            new_period = new PeriodData(new Time(), new Time(), {});
        }
    }
</script>

<h1>Bell Timer</h1>
<a class="m-3 w-48 flex flex-col gap-1.5 items-center justify-center transition duration-500 hover:scale-125" href="https://github.com/KyteKode">
    <img class="rounded-2xl" alt="" src="https://avatars.githubusercontent.com/u/231786375?s=96&;v=4">
    Created by KyteKode
</a>

<div class="relative bg-slate-800 border-3 border-slate-900 p-6 rounded-2xl">
    <button onclick={() => {show_new_modal = true}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120 absolute -top-3 -left-3">+</button>

    {#if Object.entries(periods).length == 0}
        No classes yet...
    {/if}

    <div class="grid grid-cols-3 gap-5">
        {#each Object.entries(periods) as [name, data] (name)}
            <div class="bg-slate-600 border-3 border-slate-700 p-6 rounded-2xl flex flex-col align-center items-center">
                <span class="text-2xl font-black">{name}</span>

                <span>
                    <span class="font-bold">Start:</span>
                    {data.start.to_string()}
                </span>

                <span>
                    <span class="font-bold">End:</span>
                    {data.end.to_string()}
                </span>

                {#each Object.entries(data.other) as [key, other_data] (key)}
                    <span>
                        <span class="font-bold">{key}:</span>
                        {other_data}
                    </span>
                {/each}
            </div>
        {/each}
    </div>
</div>



{#if show_new_modal}
    <div class="fixed top-1/2 flex flex-col gap-5 bg-slate-600 border-3 border-slate-700 p-3 rounded-2xl w-sm">
        <div class="grid grid-cols-[1fr_2fr] items-center justify-center gap-2">
            <span class="w-15 text-xl">Name:</span>
            <input bind:value={new_period_name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">

            <span class="w-15 text-xl">Start:</span>
            <TimeInput bind:value={new_period.start} />

            <span class="w-15 text-xl">End:</span>
            <TimeInput bind:value={new_period.end} />

            {#each Object.entries(new_period.other) as [name] (name)}
                <span class="flex flex-row justify-start items-center">
                    <span class="w-15 text-xl">{name}:</span>
                    <button onclick={() => {remove_other_info(name)}} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">-</button>
                </span>
                <input bind:value={new_period.other[name]} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
            {/each}

            <span class="w-15 text-xl">Other:</span>
            <span class="w-56 gap-3 flex items-center justify-center">
                <input bind:value={new_info_name} class="min-w-0 h-12 rounded-2xl  text-slate-900 border-3 border-slate-400" type="text">
                <button onclick={add_other_info} class="bg-slate-100 border-3 border-slate-400 text-2xl text-black aspect-square size-10 rounded-2xl flex justify-center items-center transition hover:scale-120">+</button>
            </span>
        </div>

        <div class="flex flex-col justify-center items-center gap-2">
            {#if !new_period.valid}
                <h1>Invalid!</h1>
            {/if}
            <button onclick={add_new_period} class={`w-3/4 ${new_period.valid ? "bg-blue-500 border-3 border-blue-800 text-2xl" : "bg-red-500 border-3 border-red-800 text-2xl"} rounded-2xl flex justify-center items-center transition hover:scale-120 ${new_period.valid ? "hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]" : "hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]"}`}>Add</button>
        </div>
    </div>
{/if}