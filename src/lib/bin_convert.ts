import { get_bin_layout, layout_length } from "$lib/bin_layout";
import type { JSONTime, JSONPeriodData, StorageSchema } from "$lib/storage_schemas";
import { LayoutElementKind } from "$lib/layout_element";
import { AMPM } from "$lib/time_type.svelte";



import { Base91 } from "@hpcc-js/wasm-base91";
const base91 = await Base91.load();

import { Zstd } from "@hpcc-js/wasm-zstd";
const zstd = await Zstd.load();
zstd.setCompressionLevel(12);



const text_decoder = new TextDecoder();



export async function to_binary(data: StorageSchema): Promise<string> {
    const layout = get_bin_layout(data);
    const length = layout_length(layout);

    const buffer = new ArrayBuffer(length);
    const data_view = new DataView(buffer);
    const uint8_view = new Uint8Array(buffer);
    const encoder = new TextEncoder();

    let offset = 0;
    for (const el of layout) {
        switch (el.kind) {
            case LayoutElementKind.Magic:
                data_view.setBigUint64(offset, 0x4B59544542454C4Cn) // KYTEBELL
                offset += 8;
                break;

            case LayoutElementKind.Uint8:
                data_view.setUint8(offset, el.data);
                offset += 1;
                break;

            case LayoutElementKind.Uint32:
                data_view.setUint32(offset, el.data);
                offset += 4;
                break;

            case LayoutElementKind.Utf8String: {
                const encoded = encoder.encode(el.data);
                uint8_view.set(encoded, offset);
                offset += encoded.length;
            }
        }
    }

    const compressed = zstd.compress(uint8_view, 0);
    return base91.encode(compressed);
}



export async function from_binary(encoded: string): Promise<StorageSchema | null> {
    const decoded = base91.decode(encoded);
    const decompressed = zstd.decompress(decoded);
    const data_view = new DataView(decompressed.buffer);

    if (
        data_view.getBigUint64(0) != 0x4B59544542454C4Cn || // KYTEBELL
        data_view.getUint8(8) != 0) {
        return null;
    }

    // Not const so it can be mutated in decode_period and decode_time
    // eslint-disable-next-line prefer-const
    let offset = 13; // KYTEBELL (8) + Version (1) + Period Amount (4)
    const stored_data: StorageSchema = {periods: []};

    const period_amount = data_view.getUint32(9);
    for (let i = 0; i < period_amount; i++) {
        const period = decode_period(data_view, decompressed, offset);
        if (period == null) { return null; }

        stored_data.periods.push(period[0]);
        offset = period[1];
    }

    return stored_data;
}

export function decode_period(data_view: DataView, uint8_view: Uint8Array, offset: number): [JSONPeriodData, number] | null {
    const start = decode_time({
        data: data_view,
        offset: offset
    });
    if (start == null) {
        return null;
    }
    offset += 2;

    const end = decode_time({
        data: data_view,
        offset: offset
    });
    if (end == null) {
        return null;
    }
    offset += 2;

    const name_length = data_view.getUint32(offset);
    offset += 4;

    const name = text_decoder.decode(uint8_view.subarray(offset, offset + name_length));
    offset += name_length;

    const other_props_length = data_view.getUint32(offset);
    offset += 4;

    const other: Record<string, string> = {};
    for (let i = 0; i < other_props_length; i++) {
        const key_length = data_view.getUint32(offset);
        offset += 4;
        const key_data = text_decoder.decode(uint8_view.subarray(offset, offset + key_length));
        offset += key_length;

        const value_length = data_view.getUint32(offset);
        offset += 4;
        const value_data = text_decoder.decode(uint8_view.subarray(offset, offset + value_length));
        offset += value_length;

        other[key_data] = value_data;
    }

    return [{ start, end, other, name }, offset];
}

function decode_time(model: { data: DataView, offset: number }): JSONTime | null {
    const byte1 = model.data.getUint8(model.offset);

    let ampm: AMPM;
    let hour: number;
    if (byte1 % 2 == 1) {
        hour = byte1 - 1;
        ampm = AMPM.PM;
    } else {
        hour = byte1;
        ampm = AMPM.AM;
    }

    hour >>= 1;
    if (hour == 0 || hour >= 13) {
        return null;
    }

    const minute = model.data.getUint8(model.offset + 1);
    if (minute >= 60) {
        return null;
    }

    return {
        hour: hour.toString(),
        minute: minute.toString(),
        ampm
    };
}