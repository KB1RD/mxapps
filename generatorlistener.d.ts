declare class GeneratorListener<T> {
    protected _value: T;
    protected callbacks: Set<() => void>;
    constructor(_value: T);
    pushUpdate(): void;
    generate(): AsyncGenerator<T, void, void>;
    get value(): T;
    set value(v: T);
}
declare class MapGeneratorListener<V> {
    readonly map: {
        [key: string]: V;
    };
    protected readonly callbacks: Set<() => void>;
    protected readonly key_callbacks: {
        [key: string]: Set<() => void>;
    };
    protected readonly map_callbacks: Set<() => void>;
    pushKeyUpdate(): void;
    pushUpdate(key: string): void;
    generateKeys(): AsyncGenerator<string[], void, void>;
    generateMap(): AsyncGenerator<{
        [key: string]: V;
    }, void, void>;
    generate(k: string): AsyncGenerator<V | undefined, void, void>;
    get value(): {
        [key: string]: V;
    };
}
export { GeneratorListener, MapGeneratorListener };
