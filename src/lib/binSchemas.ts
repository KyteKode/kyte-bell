import * as s from "$lib/storageSchemas";
import * as b from "$lib/binPrimitive";
import { AMPM } from "$lib/time.svelte";
import { Base91 } from "@hpcc-js/wasm-base91";
import { Zstd } from "@hpcc-js/wasm-zstd";

const base91 = await Base91.load();

const zstd = await Zstd.load();
zstd.setCompressionLevel(12);

export function encodeBin(data: s.ZStoredData) {
    return BStoredData.serialize(data);
}

export function decodeBin(data: string) {
    try {
        return s.migrateV1(BStoredDataV0.deserialize(data));
    } catch {
        return BStoredData.deserialize(data);
    }
}

class BinSerdeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BinarySerdeError";
    }
}

export type FullBinSerde<T> = {
    serialize(data: T): string;
    deserialize(encoded: string): T;
};

const maxUncompressedBytes = 64 * 1024; // 64KB

function fullWritePrelude(version: number): DataView {
    const buffer = new ArrayBuffer(maxUncompressedBytes);
    const view = new DataView(buffer);

    // Magic Number "KYTEBELL"
    b.u32.write(view, 0, 0x4B595445);
    b.u32.write(view, 4, 0x42454C4C);

    // Version
    b.u8.write(view, 8, version);

    return view;
}

function fullReadPrelude(b91: string, version: number): DataView {
    const compressed = base91.decode(b91);
    const u8View = zstd.decompress(compressed);
    const view = new DataView(u8View.buffer, u8View.byteOffset, u8View.byteLength);

    // Magic Number "KYTEBELL"
    const [magicLittle] = b.u32.read(view, 0);
    const [magicBig] = b.u32.read(view, 4);
    if (magicLittle != 0x4B595445 || magicBig != 0x42454C4C) {
        throw new BinSerdeError("Magic number does not match 'KYTEBELL'");
    }

    // Version
    const [formatVersion] = b.u8.read(view, 8);
    if (formatVersion != version) {
        throw new BinSerdeError(`Version not ${version}`);
    }

    return view;
}

export const BStoredData: FullBinSerde<s.ZStoredData> = {
    serialize: (data) => {
        const view = fullWritePrelude(0x01);

        // Default Preset
        b.u32.write(view, 9, data.defaultPreset);

        // Presets + Size Checking
        const finalOffset = b.array(BPreset).write(view, 13, data.presets);

        if (finalOffset > maxUncompressedBytes) {
            throw new BinSerdeError(`Uncompressed size of ${finalOffset} bytes exceeds limit of 64KB`);
        }

        const u8View = new Uint8Array(view.buffer, 0, finalOffset);
        const compressed = zstd.compress(u8View);
        return base91.encode(compressed);
    },
    deserialize: (b91) => {
        const view = fullReadPrelude(b91, 0x01);

        if (view.byteLength > maxUncompressedBytes) {
            throw new BinSerdeError(`Uncompressed size of ${view.byteLength} bytes exceeds limit of 64KB`);
        }

        // Default Preset
        const [defaultPreset] = b.u32.read(view, 9);

        // Presets + Size Checking
        const [presets] = b.array(BPreset).read(view, 13);

        return {
            version: 1,
            defaultPreset,
            presets
        };
    }
};

const BCriterion: b.BinElement<s.ZCriterion> = {
    write: (view, offset, value) => {
        let newOffset = offset;

        switch (value.kind) {
            case "dayOfWeek":
                newOffset = b.u8.write(view, newOffset, 0);
                return b.u8.write(view, newOffset, value.day);
            case "month":
                newOffset = b.u8.write(view, newOffset, 1);
                return b.u8.write(view, newOffset, value.month);
            case "date":
                newOffset = b.u8.write(view, newOffset, 2);
                newOffset = b.u8.write(view, newOffset, value.day);
                return b.u8.write(view, newOffset, value.month);
            default:
                throw new BinSerdeError("Unreachable criterion kind");
        }
    },
    read: (view, offset) => {
        const [kindNum] = b.u8.read(view, offset);
        switch (kindNum) {
            case 0:
                return [{
                    kind: "dayOfWeek",
                    day: b.u8.read(view, offset + 1)[0]
                }, offset + 2];
            case 1:
                return [{
                    kind: "month",
                    month: b.u8.read(view, offset + 1)[0]
                }, offset + 2];
            case 2:
                return [{
                    kind: "date",
                    day: b.u8.read(view, offset + 1)[0],
                    month: b.u8.read(view, offset + 2)[0]
                }, offset + 3];
            default:
                throw new BinSerdeError("Invalid criterion kind");
        }
    }
};

const BPreset: b.BinElement<s.ZPreset> = {
    write: (view, offset, value) => {
        let newOffset = b.str.write(view, offset, value.name);
        newOffset = b.array(BPeriod).write(view, newOffset, value.periods);
        newOffset = b.array(BCriterion).write(view, newOffset, value.criteria);

        return newOffset;
    },
    read: (view, offset) => {
        let newOffset;
        let name, periods, criteria;

        /* eslint-disable prefer-const */
        [name, newOffset] = b.str.read(view, offset);
        [periods, newOffset] = b.array(BPeriod).read(view, newOffset);
        [criteria, newOffset] = b.array(BCriterion).read(view, newOffset);

        return [
            {name, periods, criteria},
            newOffset
        ];
    }
};

export const BStoredDataV0: FullBinSerde<s.ZStoredDataV0> = {
    serialize: (data) => {
        const view = fullWritePrelude(0x00);

        // Period Data + size checking
        const finalOffset = b.array(BPeriod).write(view, 9, data.periods);

        if (finalOffset > maxUncompressedBytes) {
            throw new BinSerdeError(`Uncompressed size of ${finalOffset} bytes exceeds limit of 64KB`);
        }

        const u8View = new Uint8Array(view.buffer, 0, finalOffset);
        const compressed = zstd.compress(u8View);
        return base91.encode(compressed);
    },
    deserialize: (b91) => {
        const view = fullReadPrelude(b91, 0x00);

        if (view.byteLength > maxUncompressedBytes) {
            throw new BinSerdeError(`Uncompressed size of ${view.byteLength} bytes exceeds limit of 64KB`);
        }

        // Period Data + size checking
        const [periods] = b.array(BPeriod).read(view, 9);

        return {
            version: 0,
            periods
        };
    }
}

const BPeriod: b.BinElement<s.ZPeriod> = {
    write: (view, offset, value) => {
        let newOffset = BTime.write(view, offset, value.start);

        newOffset = BTime.write(view, newOffset, value.end);
        newOffset = b.str.write(view, newOffset, value.name);
        newOffset = b.record(b.str).write(view, newOffset, value.other ?? {});

        return newOffset;
    },
    read: (view, offset) => {
        let newOffset;
        let name, start, end, other;

        /* eslint-disable prefer-const */
        [start, newOffset] = BTime.read(view, offset);
        [end, newOffset] = BTime.read(view, newOffset);
        [name, newOffset] = b.str.read(view, newOffset);
        [other, newOffset] = b.record(b.str).read(view, newOffset);

        return [
            {name, start, end, other},
            newOffset
        ];
    }
};

const BTime: b.BinElement<s.ZTime> = {
    write: (view, offset, value) => {
        const hourByte = (Number(value.hour) << 1) + value.ampm;
        const minuteByte = Number(value.minute);

        b.u8.write(view, offset, hourByte);
        b.u8.write(view, offset + 1, minuteByte);

        return offset + 2;
    },
    read: (view, offset) => {
        const hourByte = b.u8.read(view, offset)[0];

        let ampm: AMPM;
        let hour: number;
        if (hourByte % 2 == 1) {
            hour = hourByte - 1;
            ampm = AMPM.PM;
        } else {
            hour = hourByte;
            ampm = AMPM.AM;
        }

        hour >>= 1;
        if (hour == 0 || hour >= 13) {
            throw new BinSerdeError("Hour not between 1 and 12");
        }

        const minute = b.u8.read(view, offset + 1)[0];
        if (minute >= 60) {
            throw new BinSerdeError("Minute not between 0 and 59");
        }

        return [{
            hour: hour.toString(),
            minute: minute.toString().padStart(2, '0'),
            ampm: ampm
        }, offset + 2];
    }
};