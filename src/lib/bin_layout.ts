import type {JSONPeriodData, JSONTime, StorageSchema} from "$lib/storage_schemas";

import {
    layout_magic,
    layout_uint32,
    layout_uint8,
    layout_utf8string,
    type LayoutElement,
    LayoutElementKind
} from "$lib/layout_element";



export function layout_length(layout: LayoutElement[]): number {
    let length = 0;

    for (const el of layout) {
        switch (el.kind) {
            case LayoutElementKind.Magic:
                length += 8;
                break;

            case LayoutElementKind.Uint8:
                length += 1;
                break;

            case LayoutElementKind.Uint32:
                length += 4;
                break;

            case LayoutElementKind.Utf8String:
                length += utf8_string_length(el.data).data as number;
        }
    }

    return length;
}

export function get_bin_layout(data: StorageSchema): LayoutElement[] {
    const layout: LayoutElement[] = [
        // Magic number
        layout_magic(),
        // Format version
        layout_uint8(0),
        // Amount of periods
        layout_uint32(data.periods.length)
    ];

    for (const period of data.periods) {
        layout.push(...period_bin_layout(period))
    }

    return layout;
}

function period_bin_layout(period: JSONPeriodData): LayoutElement[] {
    const other_entries = Object.entries(period.other);

    const layout: LayoutElement[] = [
        ...time_bin_layout(period.start),
        ...time_bin_layout(period.end),

        utf8_string_length(period.name),
        layout_utf8string(period.name),

        layout_uint32(other_entries.length)
    ];

    for (const [key, value] of other_entries) {
        layout.push(
            utf8_string_length(key),
            layout_utf8string(key),

            utf8_string_length(value),
            layout_utf8string(value)
        );
    }

    return layout;
}

function time_bin_layout(time: JSONTime): LayoutElement[] {
    const byte1 = (Number(time.hour) << 1) + time.ampm;
    const byte2 = Number(time.minute);
    return [
        layout_uint8(byte1),
        layout_uint8(byte2)
    ];
}

const text_encoder = new TextEncoder();
function utf8_string_length(str: string): LayoutElement {
    return layout_uint32(text_encoder.encode(str).length);
}