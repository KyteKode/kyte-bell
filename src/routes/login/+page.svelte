<script lang="ts">
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import Button from "$lib/components/Button.svelte";
</script>

<ModalBlur show={true}>
    <div class="relative flex flex-col justify-center items-center gap-5 bg-slate-600 border-2 border-slate-700 p-3 rounded-2xl w-lg">
        <h1>Log In</h1>
        <form method="POST" class="grid grid-cols-[1fr_2fr] justify-center items-center gap-2">
            <span class="w-15 text-xl">Email:</span>
            <input name="email" type="email" required class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400">

            <span class="w-15 text-xl">Password:</span>
            <input name="password" type="password" required class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400">

            <Button type="submit" full class="col-span-2">Log In</Button>
        </form>
    </div>
</ModalBlur>