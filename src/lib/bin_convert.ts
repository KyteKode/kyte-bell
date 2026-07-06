import { get_bin_layout, layout_length } from "$lib/bin_layout";
import type { StorageSchema } from "$lib/storage_schemas";
import { LayoutElementKind } from "$lib/layout_element";



import { Base91 } from "@hpcc-js/wasm-base91";
const base91 = await Base91.load();

import { Zstd } from "@hpcc-js/wasm-zstd";
const zstd = await Zstd.load();
zstd.setCompressionLevel(12);

export async function to_binary(data: StorageSchema): Promise<Uint8Array> {
    const layout = get_bin_layout(data);
    const length = layout_length(layout);

    const buffer     = new ArrayBuffer(length);
    const data_view  = new DataView(buffer);
    const uint8_view = new Uint8Array(buffer);
    const encoder    = new TextEncoder();

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

    return zstd.compress(uint8_view, 0);
}

export async function to_base64(data: StorageSchema): Promise<string> {
    return base91.encode(await to_binary(data));
}