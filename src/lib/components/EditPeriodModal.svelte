<script lang="ts">
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import PeriodModal from "$lib/components/PeriodModal.svelte";
    import Button, { type Color } from "$lib/components/Button.svelte";

    import PeriodData from "$lib/period_data.svelte";
    import globals from "$lib/globals.svelte";

    import {Pencil, Trash, XMark} from "svelte-hero-icons";
    import type { IconSource } from "@steeze-ui/heroicons";

    let show = $state(false);
    let period = $state(new PeriodData());
    let valid = $state(false);

    let editIdx: number = $state(0);

    let color: Color = $derived(valid ? "blue" : "grey");
    let icon: IconSource = $derived(valid ? Pencil : XMark);
    let addText: string = $derived(valid ? "Edit" : "Invalid");

    export function edit(idx: number) {
        period = globals.periods[idx].clone();
        period.editIdx = idx;
        editIdx = idx;

        show = true;
    }

    function remove() {
        if (editIdx == null) { return; }

        show = false;
        globals.periodsDelete(editIdx);
    }

    function commit() {
        if (valid) {
            if (editIdx == null) { return; }

            period.editIdx = null;
            globals.periodsUpdate(editIdx, period);

            show = false;
        }
    }
</script>

<ModalBlur show={show}>
    <PeriodModal bind:data={period} bind:show={show} bind:valid={valid}>
        <Button largeText full color={color} onclick={commit} icon={icon}>{addText}</Button>
        <Button largeText full color="red" onclick={remove} icon={Trash}>Remove</Button>
    </PeriodModal>
</ModalBlur>