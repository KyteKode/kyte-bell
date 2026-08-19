export type BinElement<T> = {
    write(view: DataView, offset: number, value: T): number;
    read(view: DataView, offset: number): [T, number];
};

export const u8: BinElement<number> = {
    write: (view, offset, u8) => {
        view.setUint8(offset, u8);
        return offset + 1;
    },
    read: (view, offset) => {
        return [view.getUint8(offset), offset + 1];
    }
}

export const u32: BinElement<number> = {
    write: (view, offset, u32) => {
        view.setUint32(offset, u32);
        return offset + 4;
    },
    read: (view, offset) => {
        return [view.getUint32(offset), offset + 4];
    }
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
export const str: BinElement<string> = {
    write: (view, offset, str) => {
        const encoded = textEncoder.encode(str);
        view.setUint32(offset, encoded.length);

        const u8Array = new Uint8Array(view.buffer);
        u8Array.set(encoded, offset + 4);
        return offset + encoded.length + 4;
    },
    read: (view, offset) => {
        const length = view.getUint32(offset);

        const u8Array = new Uint8Array(view.buffer);
        const strData = textDecoder.decode(u8Array.subarray(offset + 4, offset + length + 4))

        return [strData, offset + length + 4];
    }
}

export function array<T>(schema: BinElement<T>): BinElement<T[]> {
    return {
        write: (view, offset, arr) => {
            let newOffset = u32.write(view, offset, arr.length);

            for (const value of arr) {
                newOffset = schema.write(view, newOffset, value);
            }

            return newOffset;
        },
        read: (view, offset) => {
            // eslint-disable-next-line prefer-const
            let [length, outputOffset] = u32.read(view, offset);

            const arr: T[] = [];

            for (let i = 0; i < length; i++) {
                const [data, newOffset] = schema.read(view, outputOffset);

                arr.push(data);
                outputOffset = newOffset;
            }
            return [arr, outputOffset];
        }
    }
}

export function record<T>(schema: BinElement<T>): BinElement<Record<string, T>> {
    return {
        write: (view, offset, value) => {
            const entries = Object.entries(value);

            view.setUint32(offset, entries.length);
            let newOffset = offset + 4;

            for (const [key, val] of entries) {
                newOffset = str.write(view, newOffset, key);
                newOffset = schema.write(view, newOffset, val);
            }

            return newOffset;
        },
        read: (view, offset) => {
            const length = view.getUint32(offset);
            let newOffset = offset + 4;

            const record: Record<string, T> = {};
            for (let i = 0; i < length; i++) {
                const [key, offset1] = str.read(view, newOffset);
                const [val, offset2] = schema.read(view, offset1);
                record[key] = val;
                newOffset = offset2;
            }

            return [record, newOffset];
        }
    }
}