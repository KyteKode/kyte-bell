<script lang="ts">
    import ModalBlur from "$lib/components/ModalBlur.svelte";
    import Button, { type Color } from "$lib/components/Button.svelte";
    import PresetModal from "$lib/components/PresetModal.svelte";

    import Preset from "$lib/preset.svelte";
    import globals from "$lib/globals.svelte";

    import {Pencil, XMark, Trash} from "svelte-hero-icons";
    import type { IconSource } from "@steeze-ui/heroicons";

    let show = $state(false);
    let preset = $state(new Preset());
    let valid = $state(false);
    let isDefault = $state(false);

    let hideDefault = $state(false);
    let editIdx: number = $state(0);

    let color: Color = $derived(valid ? "blue" : "grey");
    let icon: IconSource = $derived(valid ? Pencil : XMark);
    let addText: string = $derived(valid ? "Edit" : "Invalid");

    export function edit() {
        editIdx = globals.currentPreset;
        preset = globals.presets[editIdx].clone();
        preset.editIdx = editIdx;

        isDefault = editIdx == globals.defaultPreset;
        hideDefault = isDefault;

        show = true;
    }

    function remove() {
        show = false;
        globals.presetsDelete(editIdx);
    }

    function commit() {
        if (valid) {
            preset.editIdx = null;
            globals.presetsUpdate(editIdx, preset);

            if (isDefault) {
                globals.defaultPreset = editIdx;
            }

            show = false;
        }
    }
</script>

<ModalBlur show={show}>
    <PresetModal bind:data={preset} bind:show={show} bind:isDefault={isDefault} bind:valid={valid} hideDefault={hideDefault}>
        <Button largeText full color={color} onclick={commit} icon={icon}>{addText}</Button>

        {@const deletable = globals.presets.length > 1 && editIdx != globals.defaultPreset}
        {#if deletable}
            <Button largeText full color="red" onclick={remove} icon={Trash}>Remove</Button>
        {/if}
    </PresetModal>
</ModalBlur>