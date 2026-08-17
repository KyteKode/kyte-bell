import type { ZStoredDataV0, ZPeriod, ZTime } from "$lib/storageSchemas";

export enum LayoutElementKind {
    Magic,
    Uint8,
    Uint32,
    Utf8String
}

export type LayoutElement =
    { kind: LayoutElementKind.Magic, data: "KYTEBELL" } |
    { kind: LayoutElementKind.Uint8, data: number } |
    { kind: LayoutElementKind.Uint32, data: number } |
    { kind: LayoutElementKind.Utf8String, data: string }

export function layoutMagic(): LayoutElement {
    return { kind: LayoutElementKind.Magic, data: "KYTEBELL" };
}

export function layoutUint8(data: number): LayoutElement {
    return { kind: LayoutElementKind.Uint8, data };
}

export function layoutUint32(data: number): LayoutElement {
    return { kind: LayoutElementKind.Uint32, data };
}

export function layoutUtf8String(data: string): LayoutElement {
    return { kind: LayoutElementKind.Utf8String, data };
}

export function layoutLength(layout: LayoutElement[]): number {
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
                length += utf8StringLength(el.data).data as number;
        }
    }

    return length;
}

export function getBinLayout(data: ZStoredDataV0): LayoutElement[] {
    const layout: LayoutElement[] = [
        // Magic number
        layoutMagic(),
        // Format version
        layoutUint8(0),
        // Amount of periods
        layoutUint32(data.periods.length)
    ];

    for (const period of data.periods) {
        layout.push(...periodBinLayout(period))
    }

    return layout;
}

function periodBinLayout(period: ZPeriod): LayoutElement[] {
    const otherEntries = Object.entries(period.other ?? {});

    const layout: LayoutElement[] = [
        ...timeBinLayout(period.start),
        ...timeBinLayout(period.end),

        utf8StringLength(period.name),
        layoutUtf8String(period.name),

        layoutUint32(otherEntries.length)
    ];

    for (const [key, value] of otherEntries) {
        layout.push(
            utf8StringLength(key),
            layoutUtf8String(key),

            utf8StringLength(value),
            layoutUtf8String(value)
        );
    }

    return layout;
}

function timeBinLayout(time: ZTime): LayoutElement[] {
    const byte1 = (Number(time.hour) << 1) + time.ampm;
    const byte2 = Number(time.minute);
    return [
        layoutUint8(byte1),
        layoutUint8(byte2)
    ];
}

const textEncoder = new TextEncoder();
function utf8StringLength(str: string): LayoutElement {
    return layoutUint32(textEncoder.encode(str).length);
}
