<script lang="ts">
    import { Icon } from "svelte-hero-icons";

    import type { IconSource } from "@steeze-ui/heroicons";
    import type { Snippet } from "svelte";
    import clsx from "clsx";

    export type Color = "red" | "blue" | "grey" | "blur";

    interface Props {
        icon?: IconSource,
        onclick?: () => void,
        children?: Snippet,
        color?: Color,
        corner?: boolean,
        full?: boolean,
        largeText?: boolean,
        largeIcon?: boolean,
        hide?: boolean,
        type?: string,
        class?: string,
    }

    let { icon, onclick, children, color, corner, full, largeText, largeIcon, hide, type, class: classes }: Props = $props();

    function buttonClasses() {
        return clsx(
            "border-2 rounded-2xl p-2 flex justify-center items-center transition hover:scale-120",
            !children && "aspect-square size-10",
            children && "px-5 gap-3",
            full && "w-full",
            corner && "absolute -top-4 -left-4",
            largeText && "text-2xl",
            largeIcon && "size-12 p-0 aspect-square",
            hide && "scale-0",
            classes,

            !color && "bg-slate-100 border-slate-400 text-black",
            color && "text-white",
            color == "red" && "bg-red-500 border-red-800 hover:shadow-[0_0_20px_oklch(63.7%_0.237_25.331/0.6)]",
            color == "blue" && "bg-blue-500 border-blue-800 hover:shadow-[0_0_20px_oklch(62.3%_0.214_259.815/0.6)]",
            color == "grey" && "bg-slate-500 border-slate-800 hover:shadow-[0_0_20px_oklch(55.4%_0.046_257.417/0.6)]",
            color == "blur" && "backdrop-blur-3xl border-none bg-white/5"
        );
    }

    function iconClasses() {
        return clsx(
            "aspect-square",
            !largeIcon && "size-8",
            largeIcon && "size-10"
        )
    }
</script>

<button type={type} onclick={onclick} class={buttonClasses()}>
    {@render children?.()}
    {#if icon}
        <Icon src={icon} class={iconClasses()} />
    {/if}
</button>