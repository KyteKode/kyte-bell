export type Option<T> =
    { some: true, data: T } |
    { some: false };

export function some<T>(data: T): Option<T> {
    return {some: true, data};
}

export function none(): Option<never> {
    return {some: false};
}