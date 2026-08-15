<script lang="ts">
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import Button, { type Color } from "$lib/components/Button.svelte";
    import PresetModal from "$lib/components/PresetModal.svelte";

    import Preset from "$lib/preset.svelte";
    import globals from "$lib/globals.svelte";

    import {Plus, XMark} from "svelte-hero-icons";
    import type { IconSource } from "@steeze-ui/heroicons";

    let show = $state(false);
    let preset = $state(new Preset());
    let valid = $state(false);
    let isDefault = $state(false);

    let color: Color = $derived(valid ? "blue" : "grey");
    let icon: IconSource = $derived(valid ? Plus : XMark);
    let addText: string = $derived(valid ? "Add" : "Invalid");

    export function create() {
        preset = new Preset();
        show = true;
    }

    function add() {
        if (valid) {
            globals.presetsPush(preset.clone());
            show = false;
        }
    }
</script>

<ModalBlur show={show}>
    <PresetModal bind:data={preset} bind:show={show} bind:isDefault={isDefault} bind:valid={valid}>
        <Button largeText full color={color} onclick={add} icon={icon}>{addText}</Button>
    </PresetModal>
</ModalBlur>