/// <reference types="node" />
import { Serializable } from 'child_process';
declare type OptionalSerializable = Serializable | null | undefined;
interface KvStorageBackend {
    get(key: string): Promise<OptionalSerializable>;
    set(key: string, value: OptionalSerializable): Promise<void>;
}
declare class KvBackendCache {
    protected readonly origin: KvStorageBackend;
    protected readonly cache: {
        [key: string]: Serializable;
    };
    constructor(origin: KvStorageBackend);
    get(key: string): Promise<OptionalSerializable>;
    set(key: string, value: OptionalSerializable): Promise<void>;
}
export { OptionalSerializable, KvStorageBackend, KvBackendCache };
