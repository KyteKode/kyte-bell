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



export function layout_magic(): LayoutElement {
    return { kind: LayoutElementKind.Magic, data: "KYTEBELL" };
}

export function layout_uint8(data: number): LayoutElement {
    return { kind: LayoutElementKind.Uint8, data };
}

export function layout_uint32(data: number): LayoutElement {
    return { kind: LayoutElementKind.Uint32, data };
}

export function layout_utf8string(data: string): LayoutElement {
    return { kind: LayoutElementKind.Utf8String, data };
}