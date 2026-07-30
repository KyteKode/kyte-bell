import { getBinLayout, layoutLength, LayoutElementKind } from "$lib/bin_layout";
import type { ZPeriodData, ZStoredData, ZTime } from "$lib/storage_schemas";
import { AMPM } from "$lib/time_type.svelte";

import { Base91 } from "@hpcc-js/wasm-base91";
import { Zstd } from "@hpcc-js/wasm-zstd";
import { type Option, none, some } from "$lib/option";

const base91 = await Base91.load();

const zstd = await Zstd.load();
zstd.setCompressionLevel(12);

const textDecoder = new TextDecoder();

export async function toBinary(data: ZStoredData): Promise<string> {
    const layout = getBinLayout(data);
    const length = layoutLength(layout);

    const buffer = new ArrayBuffer(length);
    const dataView = new DataView(buffer);
    const uint8View = new Uint8Array(buffer);
    const encoder = new TextEncoder();

    let offset = 0;
    for (const el of layout) {
        switch (el.kind) {
            case LayoutElementKind.Magic:
                dataView.setBigUint64(offset, 0x4B59544542454C4Cn) // KYTEBELL
                offset += 8;
                break;

            case LayoutElementKind.Uint8:
                dataView.setUint8(offset, el.data);
                offset += 1;
                break;

            case LayoutElementKind.Uint32:
                dataView.setUint32(offset, el.data);
                offset += 4;
                break;

            case LayoutElementKind.Utf8String: {
                const encoded = encoder.encode(el.data);
                uint8View.set(encoded, offset);
                offset += encoded.length;
            }
        }
    }

    const compressed = zstd.compress(uint8View, 0);
    return base91.encode(compressed);
}



export async function fromBinary(encoded: string): Promise<Option<ZStoredData>> {
    const decoded = base91.decode(encoded);
    const decompressed = zstd.decompress(decoded);
    const dataView = new DataView(decompressed.buffer);

    if (
        dataView.getBigUint64(0) != 0x4B59544542454C4Cn || // KYTEBELL
        dataView.getUint8(8) != 0) {
        return none();
    }

    let offset = 13; // KYTEBELL (8) + Version (1) + Period Amount (4)
    const storedData: ZStoredData = { version: 0, periods: [] };

    const periodAmount = dataView.getUint32(9);
    for (let i = 0; i < periodAmount; i++) {
        const periodResult = decodePeriod(dataView, decompressed, offset);
        if (!periodResult.some) { return none(); }
        const period = periodResult.data;

        storedData.periods.push(period[0]);
        offset = period[1];
    }

    return some(storedData);
}

export function decodePeriod(dataView: DataView, unit8View: Uint8Array, offset: number): Option<[ZPeriodData, number]> {
    const startResult = decodeTime({
        data: dataView,
        offset: offset
    });
    if (!startResult.some) { return none(); }
    const start = startResult.data;
    offset += 2;

    const endResult = decodeTime({
        data: dataView,
        offset: offset
    });
    if (!endResult.some) { return none(); }
    const end = endResult.data;
    offset += 2;

    const nameLength = dataView.getUint32(offset);
    offset += 4;

    const name = textDecoder.decode(unit8View.subarray(offset, offset + nameLength));
    offset += nameLength;

    const otherPropsLength = dataView.getUint32(offset);
    offset += 4;

    const other: Record<string, string> = {};
    for (let i = 0; i < otherPropsLength; i++) {
        const keyLength = dataView.getUint32(offset);
        offset += 4;
        const keyData = textDecoder.decode(unit8View.subarray(offset, offset + keyLength));
        offset += keyLength;

        const valueLength = dataView.getUint32(offset);
        offset += 4;
        const valueData = textDecoder.decode(unit8View.subarray(offset, offset + valueLength));
        offset += valueLength;

        other[keyData] = valueData;
    }

    return some([
        { start, end, other, name },
        offset
    ]);
}

function decodeTime(model: { data: DataView, offset: number }): Option<ZTime> {
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
