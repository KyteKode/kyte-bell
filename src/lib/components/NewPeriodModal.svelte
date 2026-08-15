<script lang="ts">
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import PeriodModal from "$lib/components/PeriodModal.svelte";
    import Button, { type Color } from "$lib/components/Button.svelte";

    import PeriodData from "$lib/period.svelte";
    import globals from "$lib/globals.svelte";

    import {Plus, XMark} from "svelte-hero-icons";
    import type { IconSource } from "@steeze-ui/heroicons";

    let show = $state(false);
    let period = $state(new PeriodData());
    let valid = $state(false);

    let color: Color = $derived(valid ? "blue" : "grey");
    let icon: IconSource = $derived(valid ? Plus : XMark);
    let addText: string = $derived(valid ? "Add" : "Invalid");

    export function create() {
        period = new PeriodData();
        show = true;
    }

    function add() {
        if (valid) {
            globals.periodsPush(period.clone());
            show = false;
        }
    }
</script>

<ModalBlur show={show}>
    <PeriodModal bind:data={period} bind:show={show} bind:valid={valid}>
        <Button largeText full color={color} onclick={add} icon={icon}>{addText}</Button>
    </PeriodModal>
</ModalBlur>