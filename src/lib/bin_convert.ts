import { get_bin_layout, layout_length } from "$lib/bin_layout";
import type { ZStoredData, ZPeriodData, ZTime } from "$lib/storage_schemas";
import { LayoutElementKind } from "$lib/layout_element";
import { AMPM } from "$lib/time_type.svelte";

import { Base91 } from "@hpcc-js/wasm-base91";
const base91 = await Base91.load();

import { Zstd } from "@hpcc-js/wasm-zstd";
const zstd = await Zstd.load();
zstd.setCompressionLevel(12);

const text_decoder = new TextDecoder();

export type DecodedOption<T> =
    { some: true, data: T } |
    { some: false };

function some<T>(data: T): DecodedOption<T> {
    return { some: true, data };
}

export function none(): DecodedOption<never> {
    return { some: false };
}

export async function to_binary(data: ZStoredData): Promise<string> {
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



export async function from_binary(encoded: string): Promise<DecodedOption<ZStoredData>> {
    const decoded = base91.decode(encoded);
    const decompressed = zstd.decompress(decoded);
    const data_view = new DataView(decompressed.buffer);

    if (
        data_view.getBigUint64(0) != 0x4B59544542454C4Cn || // KYTEBELL
        data_view.getUint8(8) != 0) {
        return none();
    }

    let offset = 13; // KYTEBELL (8) + Version (1) + Period Amount (4)
    const stored_data: ZStoredData = { version: 0, periods: [] };

    const period_amount = data_view.getUint32(9);
    for (let i = 0; i < period_amount; i++) {
        const period_result = decode_period(data_view, decompressed, offset);
        if (!period_result.some) { return none(); }
        const period = period_result.data;

        stored_data.periods.push(period[0]);
        offset = period[1];
    }

    return some(stored_data);
}

export function decode_period(data_view: DataView, uint8_view: Uint8Array, offset: number): DecodedOption<[ZPeriodData, number]> {
    const start_result = decode_time({
        data: data_view,
        offset: offset
    });
    if (!start_result.some) { return none(); }
    const start = start_result.data;
    offset += 2;

    const end_result = decode_time({
        data: data_view,
        offset: offset
    });
    if (!end_result.some) { return none(); }
    const end = end_result.data;
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

    return some([
        { start, end, other, name },
        offset
    ]);
}

function decode_time(model: { data: DataView, offset: number }): DecodedOption<ZTime> {
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
        return none();
    }

    const minute = model.data.getUint8(model.offset + 1);
    if (minute >= 60) {
        return none();
    }

    return some({
        hour: hour.toString(),
        minute: minute.toString(),
        ampm
    });
}