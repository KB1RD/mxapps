declare function generateUniqueKey(bytes?: number, isInUse?: (k: string) => boolean): string;
declare function onGenerate<T>(gen: AsyncGenerator<T, any, any>, func: (arg: T) => void): Promise<void>;
export { onGenerate, generateUniqueKey };
