<script lang="ts">
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import Button from "$lib/components/Button.svelte";
    import { resolve } from "$app/paths";

    let { form } = $props();
</script>

<ModalBlur show={true}>
    <div class="relative flex flex-col justify-center items-center gap-5 bg-slate-600 border-2 border-slate-700 p-3 rounded-2xl w-lg">
        {#if form?.success}
            <span>Check your email and confirm your account before you log in.</span>
        {:else}
            <h1>Sign Up</h1>
            <form method="POST" action="/auth?/signup" class="grid grid-cols-[1fr_2fr] justify-center items-center gap-2">
                <span class="w-15 text-xl">Email:</span>
                <input name="email" type="email" required class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400">

                <span class="w-15 text-xl">Password:</span>
                <input name="password" type="password" required class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400">

                <span class="w-15 text-xl">Name:</span>
                <input name="displayName" type="text" autocomplete="name" required class="min-w-0 h-12 rounded-2xl  text-slate-900 border-2 border-slate-400">

                <Button type="submit" full class="col-span-2">Sign Up</Button>
            </form>
            {#if form?.error}
                <span>Error: {form.error}</span>
            {/if}
        {/if}
        <p>
            Already have an account?
            <a href={resolve('/auth/login')} class="font-bold underline transition duration-150 hover:scale-110 hover:text-slate-400">
                Log in
            </a>
        </p>
    </div>
</ModalBlur>