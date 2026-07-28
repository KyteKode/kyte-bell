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